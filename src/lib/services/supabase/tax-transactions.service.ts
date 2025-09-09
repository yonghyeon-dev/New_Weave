import { getSupabaseClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

// Type definitions
export type Transaction = Database['public']['Tables']['tax_transactions']['Row'];
export type TransactionInsert = Database['public']['Tables']['tax_transactions']['Insert'];
export type TransactionUpdate = Database['public']['Tables']['tax_transactions']['Update'];
export type MonthlySummary = Database['public']['Tables']['tax_monthly_summary']['Row'];

export interface TransactionFilters {
  dateRange?: string;
  transactionType?: 'all' | '매입' | '매출';
  projectId?: string | null;
  clientId?: string | null;
  startDate?: Date;
  endDate?: Date;
}

export interface MonthlyStats {
  year: number;
  month: number;
  totalSales: number;
  totalPurchases: number;
  vatPayable: number;
  transactionCount: number;
  withholding_tax_collected: number;
  withholding_tax_paid: number;
}

export interface YearlyProjection {
  expectedRevenue: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  growthRate: number;
}

export interface MonthlyTrend {
  month: number;
  매출: number;
  매입: number;
}

export class TaxTransactionService {
  private supabase = getSupabaseClient();

  // CRUD Operations
  async createTransaction(data: Omit<TransactionInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const { data: result, error } = await this.supabase
      .from('tax_transactions')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async getTransactions(filters: TransactionFilters): Promise<Transaction[]> {
    let query = this.supabase
      .from('tax_transactions')
      .select(`
        *,
        projects (
          id,
          name
        ),
        clients (
          id,
          name,
          company
        )
      `)
      .order('transaction_date', { ascending: false });

    // Apply filters
    if (filters.transactionType && filters.transactionType !== 'all') {
      query = query.eq('transaction_type', filters.transactionType);
    }

    if (filters.projectId) {
      query = query.eq('project_id', filters.projectId);
    }

    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    if (filters.startDate) {
      query = query.gte('transaction_date', filters.startDate.toISOString());
    }

    if (filters.endDate) {
      query = query.lte('transaction_date', filters.endDate.toISOString());
    }

    // Handle date range presets
    if (filters.dateRange) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      switch (filters.dateRange) {
        case 'thisMonth':
          query = query.gte('transaction_date', startOfMonth.toISOString())
                      .lte('transaction_date', endOfMonth.toISOString());
          break;
        case 'lastMonth':
          const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
          query = query.gte('transaction_date', lastMonthStart.toISOString())
                      .lte('transaction_date', lastMonthEnd.toISOString());
          break;
        case 'thisYear':
          const yearStart = new Date(now.getFullYear(), 0, 1);
          const yearEnd = new Date(now.getFullYear(), 11, 31);
          query = query.gte('transaction_date', yearStart.toISOString())
                      .lte('transaction_date', yearEnd.toISOString());
          break;
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async updateTransaction(id: string, data: TransactionUpdate): Promise<Transaction> {
    const { data: result, error } = await this.supabase
      .from('tax_transactions')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tax_transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Project Linking
  async linkToProject(transactionId: string, projectId: string): Promise<void> {
    const { error } = await this.supabase
      .from('tax_transactions')
      .update({ project_id: projectId })
      .eq('id', transactionId);

    if (error) throw error;
  }

  async getProjectTransactions(projectId: string): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('tax_transactions')
      .select('*')
      .eq('project_id', projectId)
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Statistics and Projections
  async getMonthlyStatistics(year: number, month: number): Promise<MonthlyStats> {
    // First try to get from summary table
    const { data: summary, error: summaryError } = await this.supabase
      .from('tax_monthly_summary')
      .select('*')
      .eq('year', year)
      .eq('month', month)
      .single();

    if (summary && !summaryError) {
      return {
        year: summary.year,
        month: summary.month,
        totalSales: Number(summary.total_sales),
        totalPurchases: Number(summary.total_purchases),
        vatPayable: Number(summary.vat_payable),
        transactionCount: summary.transaction_count,
        withholding_tax_collected: Number(summary.withholding_tax_collected),
        withholding_tax_paid: Number(summary.withholding_tax_paid)
      };
    }

    // If not found, calculate manually
    return this.calculateMonthlyStats(year, month);
  }

  async getYearlyProjection(year: number): Promise<YearlyProjection> {
    // Get current year data
    const { data: yearData } = await this.supabase
      .from('tax_transactions')
      .select('*')
      .eq('transaction_type', '매출')
      .gte('transaction_date', `${year}-01-01`)
      .lte('transaction_date', `${year}-12-31`);

    const currentMonth = new Date().getMonth() + 1;
    const totalRevenue = yearData?.reduce((sum, t) => sum + Number(t.total_amount), 0) || 0;
    const monthlyAverage = currentMonth > 0 ? totalRevenue / currentMonth : 0;
    const expectedRevenue = monthlyAverage * 12;

    // Get current and previous month revenue
    const currentMonthRevenue = yearData
      ?.filter(t => new Date(t.transaction_date).getMonth() + 1 === currentMonth)
      .reduce((sum, t) => sum + Number(t.total_amount), 0) || 0;

    const previousMonthRevenue = yearData
      ?.filter(t => new Date(t.transaction_date).getMonth() + 1 === currentMonth - 1)
      .reduce((sum, t) => sum + Number(t.total_amount), 0) || 0;

    // Calculate growth rate
    const { data: lastYearData } = await this.supabase
      .from('tax_transactions')
      .select('*')
      .eq('transaction_type', '매출')
      .gte('transaction_date', `${year - 1}-01-01`)
      .lte('transaction_date', `${year - 1}-12-31`);

    const lastYearTotal = lastYearData?.reduce((sum, t) => sum + Number(t.total_amount), 0) || 0;
    const growthRate = lastYearTotal > 0 
      ? ((expectedRevenue / lastYearTotal - 1) * 100) 
      : 0;

    return {
      expectedRevenue,
      currentMonthRevenue,
      previousMonthRevenue,
      growthRate
    };
  }

  async getMonthlyTrend(year: number): Promise<MonthlyTrend[]> {
    const { data } = await this.supabase
      .from('tax_transactions')
      .select('*')
      .gte('transaction_date', `${year}-01-01`)
      .lte('transaction_date', `${year}-12-31`);

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      매출: 0,
      매입: 0
    }));

    data?.forEach(transaction => {
      const month = new Date(transaction.transaction_date).getMonth();
      if (transaction.transaction_type === '매출') {
        monthlyData[month].매출 += Number(transaction.total_amount);
      } else {
        monthlyData[month].매입 += Number(transaction.total_amount);
      }
    });

    return monthlyData;
  }

  async getTransactionsByDateRange(start: Date, end: Date): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('tax_transactions')
      .select('*')
      .gte('transaction_date', start.toISOString())
      .lte('transaction_date', end.toISOString())
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Bulk Operations
  async bulkImportTransactions(transactions: Omit<TransactionInsert, 'id' | 'created_at' | 'updated_at'>[]): Promise<{ success: number; failed: number }> {
    const results = { success: 0, failed: 0 };
    
    // Process in batches to avoid timeout
    const batchSize = 50;
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      
      const { data, error } = await this.supabase
        .from('tax_transactions')
        .insert(batch)
        .select();
      
      if (error) {
        results.failed += batch.length;
        console.error('Batch import error:', error);
      } else {
        results.success += data?.length || 0;
      }
    }
    
    return results;
  }

  async exportToExcel(filters: TransactionFilters): Promise<Blob> {
    const transactions = await this.getTransactions(filters);
    
    // Format data for Excel export
    const excelData = transactions.map(t => ({
      날짜: t.transaction_date,
      구분: t.transaction_type,
      거래처: t.supplier_name,
      사업자번호: t.business_number,
      공급가액: t.supply_amount,
      부가세: t.vat_amount,
      '원천세(3.3%)': t.withholding_tax_3_3,
      '원천세(6.8%)': t.withholding_tax_6_8,
      합계: t.total_amount,
      카테고리: t.category,
      설명: t.description
    }));

    // Convert to CSV (simple export format)
    const headers = Object.keys(excelData[0] || {});
    const csvContent = [
      headers.join(','),
      ...excelData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    return new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  // Private helper methods
  private async calculateMonthlyStats(year: number, month: number): Promise<MonthlyStats> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const { data } = await this.supabase
      .from('tax_transactions')
      .select('*')
      .gte('transaction_date', startDate.toISOString())
      .lte('transaction_date', endDate.toISOString());

    const stats: MonthlyStats = {
      year,
      month,
      totalSales: 0,
      totalPurchases: 0,
      vatPayable: 0,
      transactionCount: data?.length || 0,
      withholding_tax_collected: 0,
      withholding_tax_paid: 0
    };

    data?.forEach(transaction => {
      if (transaction.transaction_type === '매출') {
        stats.totalSales += Number(transaction.total_amount);
        stats.vatPayable += Number(transaction.vat_amount);
        stats.withholding_tax_collected += Number(transaction.withholding_tax_3_3) + Number(transaction.withholding_tax_6_8);
      } else {
        stats.totalPurchases += Number(transaction.total_amount);
        stats.vatPayable -= Number(transaction.vat_amount); // 매입 부가세는 공제
        stats.withholding_tax_paid += Number(transaction.withholding_tax_3_3) + Number(transaction.withholding_tax_6_8);
      }
    });

    // Try to cache the result
    await this.supabase
      .from('tax_monthly_summary')
      .upsert({
        user_id: (await this.supabase.auth.getUser()).data.user?.id || '',
        year,
        month,
        total_sales: stats.totalSales,
        total_purchases: stats.totalPurchases,
        vat_payable: stats.vatPayable,
        withholding_tax_collected: stats.withholding_tax_collected,
        withholding_tax_paid: stats.withholding_tax_paid,
        transaction_count: stats.transactionCount,
        last_updated: new Date().toISOString()
      });

    return stats;
  }

  // Real-time subscription
  subscribeToChanges(userId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel('tax_transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tax_transactions',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }
}

// Singleton instance
export const taxTransactionService = new TaxTransactionService();