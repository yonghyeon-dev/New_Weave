export interface ReminderRule {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  triggerDays: number; // 마감일로부터 며칠 전/후
  triggerType: 'before' | 'after'; // 마감일 전/후
  repeatInterval: number; // 반복 간격 (일 단위)
  maxReminders: number; // 최대 리마인드 횟수
  reminderType: ReminderType;
  template: ReminderTemplate;
  conditions: ReminderCondition[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderSchedule {
  id: string;
  invoiceId: string;
  ruleId: string;
  scheduledAt: Date;
  status: ReminderScheduleStatus;
  attemptCount: number;
  lastAttempt?: Date;
  nextAttempt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderLog {
  id: string;
  invoiceId: string;
  ruleId: string;
  scheduleId: string;
  reminderType: ReminderType;
  status: ReminderStatus;
  sentAt: Date;
  recipient: ReminderRecipient;
  template: ReminderTemplate;
  metadata: ReminderMetadata;
  errorMessage?: string;
  responseData?: any;
}

export interface ReminderTemplate {
  id: string;
  name: string;
  type: ReminderType;
  subject: string;
  body: string;
  variables: string[];
  isDefault: boolean;
  language: string;
  tone: ReminderTone;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderCondition {
  field: ConditionField;
  operator: ConditionOperator;
  value: string | number | boolean;
  logicalOperator?: 'AND' | 'OR';
}

export interface ReminderRecipient {
  email: string;
  name?: string;
  type: 'client' | 'internal' | 'external';
  language?: string;
}

export interface ReminderMetadata {
  invoiceNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  dueDate: Date;
  overdueDays?: number;
  projectName?: string;
  userId: string;
  sentVia: 'email' | 'sms' | 'webhook';
  deliveryId?: string;
}

export interface ReminderStats {
  totalReminders: number;
  sentToday: number;
  sentThisWeek: number;
  sentThisMonth: number;
  successRate: number;
  averageResponseTime: number;
  overdueInvoices: number;
  upcomingReminders: number;
  remindersByStatus: Record<ReminderStatus, number>;
  remindersByType: Record<ReminderType, number>;
}

export interface ReminderSettings {
  isEnabled: boolean;
  defaultReminderDays: number[];
  maxRemindersPerInvoice: number;
  businessHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;
    timezone: string;
    weekdays: number[]; // 0-6, Sunday=0
  };
  emailSettings: {
    fromName: string;
    fromEmail: string;
    replyToEmail?: string;
    bccEmails: string[];
    signature: string;
  };
  rateLimiting: {
    maxPerHour: number;
    maxPerDay: number;
    delayBetweenReminders: number; // seconds
  };
  notificationSettings: {
    notifyOnSent: boolean;
    notifyOnFailed: boolean;
    notifyOnResponse: boolean;
    internalNotificationEmails: string[];
  };
}

export interface ReminderCampaign {
  id: string;
  name: string;
  description: string;
  targetInvoices: string[];
  rules: ReminderRule[];
  scheduledAt: Date;
  status: CampaignStatus;
  results: CampaignResults;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignResults {
  totalInvoices: number;
  remindersSent: number;
  remindersDelivered: number;
  remindersFailed: number;
  paymentsReceived: number;
  totalAmountCollected: number;
  averagePaymentTime: number;
  responseRate: number;
}

// Enums
export enum ReminderType {
  GENTLE_REMINDER = 'gentle_reminder',
  PAYMENT_DUE = 'payment_due',
  OVERDUE_NOTICE = 'overdue_notice',
  FINAL_NOTICE = 'final_notice',
  THANK_YOU = 'thank_you',
  CUSTOM = 'custom'
}

export enum ReminderStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  BOUNCED = 'bounced',
  CLICKED = 'clicked',
  REPLIED = 'replied'
}

export enum ReminderScheduleStatus {
  SCHEDULED = 'scheduled',
  PROCESSING = 'processing',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum ReminderTone {
  POLITE = 'polite',
  PROFESSIONAL = 'professional',
  URGENT = 'urgent',
  FRIENDLY = 'friendly',
  FORMAL = 'formal'
}

export enum ConditionField {
  INVOICE_AMOUNT = 'invoice_amount',
  INVOICE_STATUS = 'invoice_status',
  CLIENT_TYPE = 'client_type',
  PROJECT_TYPE = 'project_type',
  PAYMENT_TERMS = 'payment_terms',
  OVERDUE_DAYS = 'overdue_days',
  PREVIOUS_REMINDERS = 'previous_reminders',
  CLIENT_PAYMENT_HISTORY = 'client_payment_history'
}

export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_EQUAL = 'greater_equal',
  LESS_EQUAL = 'less_equal',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  IN = 'in',
  NOT_IN = 'not_in'
}

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Default reminder templates
export const DEFAULT_REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: 'gentle-reminder-kr',
    name: '정중한 리마인더 (한국어)',
    type: ReminderType.GENTLE_REMINDER,
    subject: '{{client.name}}님, {{invoice.number}} 인보이스 안내',
    body: `안녕하세요 {{client.name}}님,

{{project.name}} 프로젝트 관련하여 발송해드린 인보이스 {{invoice.number}}에 대해 안내드립니다.

• 인보이스 번호: {{invoice.number}}
• 금액: {{invoice.amount | currency}}
• 결제 기한: {{invoice.dueDate | date}}
{{#if invoice.overdueDays}}
• 연체일: {{invoice.overdueDays}}일
{{/if}}

결제가 완료되지 않으셨다면, 편리한 시간에 결제해주시기 바랍니다.

궁금한 사항이 있으시면 언제든 연락 주세요.

감사합니다.

{{user.name}}
{{user.company}}
{{user.email}}
{{user.phone}}`,
    variables: ['client', 'invoice', 'project', 'user'],
    isDefault: true,
    language: 'ko',
    tone: ReminderTone.POLITE,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'overdue-notice-kr',
    name: '연체 통지 (한국어)',
    type: ReminderType.OVERDUE_NOTICE,
    subject: '[연체 안내] {{invoice.number}} 인보이스 결제 요청',
    body: `{{client.name}}님께,

{{project.name}} 프로젝트의 인보이스 {{invoice.number}}가 연체되었습니다.

• 인보이스 번호: {{invoice.number}}
• 금액: {{invoice.amount | currency}}
• 원래 결제 기한: {{invoice.dueDate | date}}
• 연체일: {{invoice.overdueDays}}일

빠른 시일 내에 결제해주시기 바랍니다. 연체가 계속될 경우 추가 조치가 있을 수 있습니다.

결제 관련 문의사항이나 결제 계획이 있으시면 즉시 연락 주시기 바랍니다.

{{user.name}}
{{user.company}}
{{user.email}}
{{user.phone}}`,
    variables: ['client', 'invoice', 'project', 'user'],
    isDefault: true,
    language: 'ko',
    tone: ReminderTone.URGENT,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'payment-thank-you-kr',
    name: '결제 감사 (한국어)',
    type: ReminderType.THANK_YOU,
    subject: '{{client.name}}님, 결제 완료 확인 및 감사 인사',
    body: `{{client.name}}님,

인보이스 {{invoice.number}} 결제를 확인했습니다. 감사합니다!

• 결제 금액: {{invoice.amount | currency}}
• 결제일: {{invoice.paidDate | date}}
• 프로젝트: {{project.name}}

앞으로도 좋은 협업 관계를 유지하시길 바라며, 추가 프로젝트나 궁금한 사항이 있으시면 언제든 연락해주세요.

감사합니다.

{{user.name}}
{{user.company}}`,
    variables: ['client', 'invoice', 'project', 'user'],
    isDefault: true,
    language: 'ko',
    tone: ReminderTone.FRIENDLY,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Default reminder rules
export const DEFAULT_REMINDER_RULES: Omit<ReminderRule, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: '1일 전 사전 알림',
    description: '결제 기한 1일 전에 정중한 리마인더를 보냅니다',
    isEnabled: true,
    triggerDays: 1,
    triggerType: 'before',
    repeatInterval: 0,
    maxReminders: 1,
    reminderType: ReminderType.GENTLE_REMINDER,
    template: DEFAULT_REMINDER_TEMPLATES[0],
    conditions: []
  },
  {
    name: '3일 후 연체 통지',
    description: '결제 기한 3일 후에 연체 통지를 보냅니다',
    isEnabled: true,
    triggerDays: 3,
    triggerType: 'after',
    repeatInterval: 7,
    maxReminders: 3,
    reminderType: ReminderType.OVERDUE_NOTICE,
    template: DEFAULT_REMINDER_TEMPLATES[1],
    conditions: [
      {
        field: ConditionField.INVOICE_STATUS,
        operator: ConditionOperator.EQUALS,
        value: 'unpaid'
      }
    ]
  },
  {
    name: '최종 통지',
    description: '연체 14일 후에 최종 통지를 보냅니다',
    isEnabled: true,
    triggerDays: 14,
    triggerType: 'after',
    repeatInterval: 0,
    maxReminders: 1,
    reminderType: ReminderType.FINAL_NOTICE,
    template: DEFAULT_REMINDER_TEMPLATES[1],
    conditions: [
      {
        field: ConditionField.INVOICE_STATUS,
        operator: ConditionOperator.EQUALS,
        value: 'unpaid'
      },
      {
        field: ConditionField.OVERDUE_DAYS,
        operator: ConditionOperator.GREATER_EQUAL,
        value: 14,
        logicalOperator: 'AND'
      }
    ]
  }
];