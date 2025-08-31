// ===========================================
// Frontend API Client - HTTP calls to backend
// ===========================================

interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
}

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

class ApiClient {
  static baseURL = '/api';

  // Helper method for API calls
  static async apiCall(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse> {
    try {
      const fetchOptions = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        ...(options.body ? { body: options.body } : {}),
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, fetchOptions);

      const data = await response.json();

      if (!response.ok) {
        return { data: null, error: data.message || 'API call failed' };
      }

      return { data, error: null };
    } catch (error) {
      console.error(`API Error - ${endpoint}:`, error);
      return { data: null, error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Products API
  static async getProducts(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.offset) queryParams.append('offset', filters.offset.toString());

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

    return this.apiCall(endpoint);
  }

  static async getProductById(id: string) {
    return this.apiCall(`/products/${id}`);
  }

  // Categories API
  static async getCategories() {
    return this.apiCall('/categories');
  }

  // Users API
  static async authenticateUser(username: string, password: string) {
    return this.apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  static async createUser(userData: { username: string; email: string; password: string; fullName: string }) {
    return this.apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Orders API
  static async createOrder(orderData: { userId: string; items: unknown[]; total: number; shippingAddress: Record<string, unknown> }) {
    return this.apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  static async getUserOrders(userId: string) {
    return this.apiCall(`/orders/user/${userId}`);
  }
}

export default ApiClient;
