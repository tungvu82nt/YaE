export interface ServerStatus {
  supabase: boolean;
  database: boolean;
  auth: boolean;
  storage: boolean;
  functions: boolean;
  timestamp: string;
}

export class ServerChecker {
  static async checkSupabaseConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
  }

  static async checkDatabaseConnection(): Promise<boolean> {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  static async checkAuthService(): Promise<boolean> {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase.auth.getSession();
      return !error;
    } catch (error) {
      console.error('Auth service failed:', error);
      return false;
    }
  }

  static async checkAllServices(): Promise<ServerStatus> {
    const timestamp = new Date().toISOString();
    
    const [supabase, database, auth] = await Promise.all([
      this.checkSupabaseConnection(),
      this.checkDatabaseConnection(),
      this.checkAuthService()
    ]);

    return {
      supabase,
      database,
      auth,
      storage: supabase, // Storage depends on Supabase connection
      functions: supabase, // Functions depend on Supabase connection
      timestamp
    };
  }

  static getStatusMessage(status: ServerStatus): string {
    const issues = [];
    
    if (!status.supabase) issues.push('Kết nối Supabase');
    if (!status.database) issues.push('Cơ sở dữ liệu');
    if (!status.auth) issues.push('Hệ thống đăng nhập');
    
    if (issues.length === 0) {
      return 'Tất cả dịch vụ hoạt động bình thường';
    }
    
    return `Phát hiện sự cố: ${issues.join(', ')}`;
  }
}