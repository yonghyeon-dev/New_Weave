import { 
  ReminderRule, 
  ReminderSchedule, 
  ReminderLog, 
  ReminderTemplate,
  ReminderSettings,
  ReminderStats,
  ReminderStatus,
  ReminderScheduleStatus,
  ReminderType,
  ConditionField,
  ConditionOperator,
  DEFAULT_REMINDER_RULES,
  DEFAULT_REMINDER_TEMPLATES 
} from '@/lib/types/reminder';
import { Invoice } from '@/lib/types/invoice';
import { Client } from '@/lib/types/client';
import { AdvancedTemplateEngine } from '@/lib/advanced-template-engine';

interface ReminderContext {
  invoice: Invoice;
  client: Client;
  project?: any;
  user: any;
  system: {
    currentDate: Date;
    companyName: string;
    companyEmail: string;
    companyPhone?: string;
  };
}

export class ReminderEngine {
  private static instance: ReminderEngine;
  private templateEngine: AdvancedTemplateEngine;
  private settings: ReminderSettings;
  
  private constructor() {
    this.templateEngine = AdvancedTemplateEngine.getInstance();
    this.settings = this.getDefaultSettings();
  }

  public static getInstance(): ReminderEngine {
    if (!ReminderEngine.instance) {
      ReminderEngine.instance = new ReminderEngine();
    }
    return ReminderEngine.instance;
  }

  // Settings Management
  private getDefaultSettings(): ReminderSettings {
    return {
      isEnabled: true,
      defaultReminderDays: [1, 3, 7, 14],
      maxRemindersPerInvoice: 5,
      businessHours: {
        enabled: true,
        start: '09:00',
        end: '18:00',
        timezone: 'Asia/Seoul',
        weekdays: [1, 2, 3, 4, 5] // Monday to Friday
      },
      emailSettings: {
        fromName: 'Weave 인보이스 시스템',
        fromEmail: 'noreply@weave.com',
        replyToEmail: 'support@weave.com',
        bccEmails: [],
        signature: '\n\n---\nWeave ERP System\nPowered by AI'
      },
      rateLimiting: {
        maxPerHour: 50,
        maxPerDay: 200,
        delayBetweenReminders: 60
      },
      notificationSettings: {
        notifyOnSent: true,
        notifyOnFailed: true,
        notifyOnResponse: false,
        internalNotificationEmails: []
      }
    };
  }

  public getSettings(): ReminderSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<ReminderSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Rule Management
  public async getRules(): Promise<ReminderRule[]> {
    // In production, this would fetch from database
    const savedRules = this.loadFromStorage<ReminderRule[]>('reminder_rules');
    if (savedRules && savedRules.length > 0) {
      return savedRules;
    }

    // Create default rules
    const defaultRules: ReminderRule[] = DEFAULT_REMINDER_RULES.map((rule, index) => ({
      ...rule,
      id: `default-rule-${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    this.saveToStorage('reminder_rules', defaultRules);
    return defaultRules;
  }

  public async createRule(rule: Omit<ReminderRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReminderRule> {
    const newRule: ReminderRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const rules = await this.getRules();
    rules.push(newRule);
    this.saveToStorage('reminder_rules', rules);

    return newRule;
  }

  public async updateRule(ruleId: string, updates: Partial<ReminderRule>): Promise<ReminderRule> {
    const rules = await this.getRules();
    const ruleIndex = rules.findIndex(r => r.id === ruleId);
    
    if (ruleIndex === -1) {
      throw new Error(`Rule not found: ${ruleId}`);
    }

    rules[ruleIndex] = {
      ...rules[ruleIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.saveToStorage('reminder_rules', rules);
    return rules[ruleIndex];
  }

  public async deleteRule(ruleId: string): Promise<void> {
    const rules = await this.getRules();
    const filteredRules = rules.filter(r => r.id !== ruleId);
    this.saveToStorage('reminder_rules', filteredRules);
  }

  // Template Management
  public async getTemplates(): Promise<ReminderTemplate[]> {
    const savedTemplates = this.loadFromStorage<ReminderTemplate[]>('reminder_templates');
    if (savedTemplates && savedTemplates.length > 0) {
      return savedTemplates;
    }

    this.saveToStorage('reminder_templates', DEFAULT_REMINDER_TEMPLATES);
    return DEFAULT_REMINDER_TEMPLATES;
  }

  public async createTemplate(template: Omit<ReminderTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReminderTemplate> {
    const newTemplate: ReminderTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const templates = await this.getTemplates();
    templates.push(newTemplate);
    this.saveToStorage('reminder_templates', templates);

    return newTemplate;
  }

  // Schedule Management
  public async generateSchedules(invoices: Invoice[]): Promise<ReminderSchedule[]> {
    if (!this.settings.isEnabled) {
      return [];
    }

    const rules = await this.getRules();
    const activeRules = rules.filter(r => r.isEnabled);
    const schedules: ReminderSchedule[] = [];

    for (const invoice of invoices) {
      // Skip invoices that are already paid
      if (invoice.status === 'paid') continue;

      for (const rule of activeRules) {
        // Check if rule conditions are met
        if (!this.evaluateConditions(rule.conditions, invoice)) continue;

        const schedule = this.createScheduleFromRule(invoice, rule);
        if (schedule) {
          schedules.push(schedule);
        }
      }
    }

    // Save schedules
    const existingSchedules = this.loadFromStorage<ReminderSchedule[]>('reminder_schedules') || [];
    const allSchedules = [...existingSchedules, ...schedules];
    this.saveToStorage('reminder_schedules', allSchedules);

    return schedules;
  }

  private createScheduleFromRule(invoice: Invoice, rule: ReminderRule): ReminderSchedule | null {
    const now = new Date();
    const dueDate = new Date(invoice.dueDate);
    
    let scheduledDate: Date;
    
    if (rule.triggerType === 'before') {
      scheduledDate = new Date(dueDate.getTime() - (rule.triggerDays * 24 * 60 * 60 * 1000));
    } else {
      scheduledDate = new Date(dueDate.getTime() + (rule.triggerDays * 24 * 60 * 60 * 1000));
    }

    // Skip if scheduled time has passed for 'before' reminders
    if (rule.triggerType === 'before' && scheduledDate < now) {
      return null;
    }

    // Adjust for business hours
    scheduledDate = this.adjustForBusinessHours(scheduledDate);

    return {
      id: `schedule-${invoice.id}-${rule.id}-${Date.now()}`,
      invoiceId: invoice.id,
      ruleId: rule.id,
      scheduledAt: scheduledDate,
      status: ReminderScheduleStatus.SCHEDULED,
      attemptCount: 0,
      createdAt: now,
      updatedAt: now
    };
  }

  private adjustForBusinessHours(date: Date): Date {
    if (!this.settings.businessHours.enabled) {
      return date;
    }

    const adjusted = new Date(date);
    const dayOfWeek = adjusted.getDay();
    
    // If not a business day, move to next business day
    if (!this.settings.businessHours.weekdays.includes(dayOfWeek)) {
      const daysToAdd = this.settings.businessHours.weekdays[0] - dayOfWeek + 
        (dayOfWeek >= this.settings.businessHours.weekdays[0] ? 7 : 0);
      adjusted.setDate(adjusted.getDate() + daysToAdd);
    }

    // Set to business hours
    const [startHour, startMinute] = this.settings.businessHours.start.split(':').map(Number);
    adjusted.setHours(startHour, startMinute, 0, 0);

    return adjusted;
  }

  private evaluateConditions(conditions: any[], invoice: Invoice): boolean {
    if (conditions.length === 0) return true;

    // Simple condition evaluation - in production would be more sophisticated
    return conditions.every(condition => {
      switch (condition.field) {
        case ConditionField.INVOICE_AMOUNT:
          return this.evaluateNumericCondition(invoice.total, condition.operator, condition.value);
        case ConditionField.INVOICE_STATUS:
          return this.evaluateStringCondition(invoice.status, condition.operator, condition.value);
        case ConditionField.OVERDUE_DAYS:
          const overdueDays = this.calculateOverdueDays(invoice);
          return this.evaluateNumericCondition(overdueDays, condition.operator, condition.value);
        default:
          return true;
      }
    });
  }

  private evaluateNumericCondition(actual: number, operator: ConditionOperator, expected: number): boolean {
    switch (operator) {
      case ConditionOperator.EQUALS:
        return actual === expected;
      case ConditionOperator.GREATER_THAN:
        return actual > expected;
      case ConditionOperator.LESS_THAN:
        return actual < expected;
      case ConditionOperator.GREATER_EQUAL:
        return actual >= expected;
      case ConditionOperator.LESS_EQUAL:
        return actual <= expected;
      default:
        return false;
    }
  }

  private evaluateStringCondition(actual: string, operator: ConditionOperator, expected: string): boolean {
    switch (operator) {
      case ConditionOperator.EQUALS:
        return actual === expected;
      case ConditionOperator.NOT_EQUALS:
        return actual !== expected;
      case ConditionOperator.CONTAINS:
        return actual.toLowerCase().includes(expected.toLowerCase());
      case ConditionOperator.NOT_CONTAINS:
        return !actual.toLowerCase().includes(expected.toLowerCase());
      default:
        return false;
    }
  }

  private calculateOverdueDays(invoice: Invoice): number {
    const now = new Date();
    const dueDate = new Date(invoice.dueDate);
    const diffTime = now.getTime() - dueDate.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  }

  // Reminder Processing
  public async processScheduledReminders(): Promise<ReminderLog[]> {
    const schedules = this.loadFromStorage<ReminderSchedule[]>('reminder_schedules') || [];
    const now = new Date();
    
    const dueSchedules = schedules.filter(s => 
      s.status === ReminderScheduleStatus.SCHEDULED && 
      s.scheduledAt <= now
    );

    const logs: ReminderLog[] = [];

    for (const schedule of dueSchedules) {
      try {
        const log = await this.sendReminder(schedule);
        logs.push(log);
        
        // Update schedule status
        schedule.status = ReminderScheduleStatus.SENT;
        schedule.attemptCount++;
        schedule.lastAttempt = now;
        schedule.updatedAt = now;
        
      } catch (error) {
        // Handle failure
        schedule.status = ReminderScheduleStatus.FAILED;
        schedule.attemptCount++;
        schedule.lastAttempt = now;
        schedule.errorMessage = (error as Error).message;
        schedule.updatedAt = now;
        
        // Schedule retry if within limits
        if (schedule.attemptCount < 3) {
          schedule.nextAttempt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
          schedule.status = ReminderScheduleStatus.SCHEDULED;
        }
      }
    }

    // Save updated schedules
    this.saveToStorage('reminder_schedules', schedules);
    
    // Save logs
    const existingLogs = this.loadFromStorage<ReminderLog[]>('reminder_logs') || [];
    const allLogs = [...existingLogs, ...logs];
    this.saveToStorage('reminder_logs', allLogs);

    return logs;
  }

  private async sendReminder(schedule: ReminderSchedule): Promise<ReminderLog> {
    // Get rule and template
    const rules = await this.getRules();
    const rule = rules.find(r => r.id === schedule.ruleId);
    if (!rule) {
      throw new Error(`Rule not found: ${schedule.ruleId}`);
    }

    // Get invoice and related data (mock for now)
    const context = await this.buildReminderContext(schedule.invoiceId);
    
    // Render template
    const renderedSubject = this.templateEngine.render(rule.template.subject, context);
    const renderedBody = this.templateEngine.render(rule.template.body, context);

    // Simulate sending email
    const log: ReminderLog = {
      id: `log-${Date.now()}`,
      invoiceId: schedule.invoiceId,
      ruleId: schedule.ruleId,
      scheduleId: schedule.id,
      reminderType: rule.reminderType,
      status: ReminderStatus.SENT,
      sentAt: new Date(),
      recipient: {
        email: context.client.email || '',
        name: context.client.name,
        type: 'client'
      },
      template: {
        ...rule.template,
        subject: renderedSubject,
        body: renderedBody
      },
      metadata: {
        invoiceNumber: context.invoice.invoiceNumber,
        clientName: context.client.name,
        amount: context.invoice.total,
        currency: context.invoice.currency,
        dueDate: new Date(context.invoice.dueDate),
        overdueDays: this.calculateOverdueDays(context.invoice),
        userId: context.user.id,
        sentVia: 'email'
      }
    };

    console.log(`Reminder sent: ${renderedSubject}`);
    return log;
  }

  private async buildReminderContext(invoiceId: string): Promise<ReminderContext> {
    // Mock data - in production would fetch from database
    return {
      invoice: {
        id: invoiceId,
        number: 'INV-2024-001',
        status: 'issued',
        total: 1200000,
        currency: 'KRW',
        dueDate: new Date('2024-09-15'),
        issuedAt: new Date('2024-08-15')
      } as unknown as Invoice,
      client: {
        id: 'client-1',
        name: '테크스타트업',
        email: 'contact@techstartup.com'
      } as Client,
      project: {
        name: '웹사이트 리뉴얼 프로젝트'
      },
      user: {
        id: 'user-1',
        name: '김개발',
        company: 'Weave Studio',
        email: 'kim@weave.com',
        phone: '02-1234-5678'
      },
      system: {
        currentDate: new Date(),
        companyName: 'Weave Studio',
        companyEmail: 'contact@weave.com',
        companyPhone: '02-1234-5678'
      }
    };
  }

  // Statistics
  public async getStats(): Promise<ReminderStats> {
    const logs = this.loadFromStorage<ReminderLog[]>('reminder_logs') || [];
    const schedules = this.loadFromStorage<ReminderSchedule[]>('reminder_schedules') || [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sentToday = logs.filter(l => new Date(l.sentAt) >= today).length;
    const sentThisWeek = logs.filter(l => new Date(l.sentAt) >= weekAgo).length;
    const sentThisMonth = logs.filter(l => new Date(l.sentAt) >= monthAgo).length;

    const deliveredCount = logs.filter(l => l.status === ReminderStatus.DELIVERED).length;
    const successRate = logs.length > 0 ? (deliveredCount / logs.length) * 100 : 0;

    const upcomingReminders = schedules.filter(s => 
      s.status === ReminderScheduleStatus.SCHEDULED && s.scheduledAt > now
    ).length;

    const remindersByStatus: Record<ReminderStatus, number> = {
      [ReminderStatus.PENDING]: 0,
      [ReminderStatus.SENT]: 0,
      [ReminderStatus.DELIVERED]: 0,
      [ReminderStatus.FAILED]: 0,
      [ReminderStatus.BOUNCED]: 0,
      [ReminderStatus.CLICKED]: 0,
      [ReminderStatus.REPLIED]: 0
    };

    const remindersByType: Record<ReminderType, number> = {
      [ReminderType.GENTLE_REMINDER]: 0,
      [ReminderType.PAYMENT_DUE]: 0,
      [ReminderType.OVERDUE_NOTICE]: 0,
      [ReminderType.FINAL_NOTICE]: 0,
      [ReminderType.THANK_YOU]: 0,
      [ReminderType.CUSTOM]: 0
    };

    logs.forEach(log => {
      remindersByStatus[log.status]++;
      remindersByType[log.reminderType]++;
    });

    return {
      totalReminders: logs.length,
      sentToday,
      sentThisWeek,
      sentThisMonth,
      successRate,
      averageResponseTime: 0, // Would calculate from actual response data
      overdueInvoices: 0, // Would calculate from invoice data
      upcomingReminders,
      remindersByStatus,
      remindersByType
    };
  }

  // Utility methods
  private saveToStorage<T>(key: string, data: T): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  private loadFromStorage<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Public API methods for testing
  public async testReminder(ruleId: string, invoiceId: string): Promise<string> {
    const rules = await this.getRules();
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) {
      throw new Error(`Rule not found: ${ruleId}`);
    }

    const context = await this.buildReminderContext(invoiceId);
    const renderedSubject = this.templateEngine.render(rule.template.subject, context);
    const renderedBody = this.templateEngine.render(rule.template.body, context);

    return `Subject: ${renderedSubject}\n\n${renderedBody}`;
  }

  public async previewTemplate(template: ReminderTemplate, invoiceId: string): Promise<string> {
    const context = await this.buildReminderContext(invoiceId);
    const renderedSubject = this.templateEngine.render(template.subject, context);
    const renderedBody = this.templateEngine.render(template.body, context);

    return `Subject: ${renderedSubject}\n\n${renderedBody}`;
  }
}