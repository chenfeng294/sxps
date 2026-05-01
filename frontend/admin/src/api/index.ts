const API_BASE = '/api/v1';

class ApiClient {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    console.log('API Request:', url, options.method || 'GET');

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = endpoint;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url = `${endpoint}?${queryString}`;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post<ApiResponse<{ token: string; user: any }>>('/auth/login', data),

  register: (data: { username: string; password: string; email?: string }) =>
    api.post<ApiResponse<{ token: string; user: any }>>('/auth/register', data),

  me: () => api.get<ApiResponse<{ user: any }>>('/auth/me'),
};

export const productApi = {
  list: (params?: { search?: string; status?: string; category?: string }) =>
    api.get<ApiResponse<PaginatedData<any>>>('/products', params),

  get: (id: string) => api.get<ApiResponse<any>>(`/products/${id}`),

  create: (data: any) => api.post<ApiResponse<any>>('/products', data),

  update: (id: string, data: any) => api.put<ApiResponse<any>>(`/products/${id}`, data),

  toggleStatus: (id: string) => api.post<ApiResponse<any>>(`/products/${id}/toggle-status`),

  delete: (id: string) => api.delete<ApiResponse<any>>(`/products/${id}`),
};

export const orderApi = {
  list: (params?: { search?: string; status?: string; customer?: string }) =>
    api.get<ApiResponse<PaginatedData<any>>>('/orders', params),

  get: (id: string) => api.get<ApiResponse<any>>(`/orders/${id}`),

  create: (data: any) => api.post<ApiResponse<any>>('/orders', data),

  submit: (id: string) => api.post<ApiResponse<any>>(`/orders/${id}/submit`),

  audit: (id: string) => api.post<ApiResponse<any>>(`/orders/${id}/audit`),

  cancel: (id: string) => api.post<ApiResponse<any>>(`/orders/${id}/cancel`),

  completeSorting: (id: string) => api.post<ApiResponse<any>>(`/orders/${id}/complete-sorting`),

  completeDelivery: (id: string) => api.post<ApiResponse<any>>(`/orders/${id}/complete-delivery`),
};

export const purchaseApi = {
  list: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/purchases', params),
  get: (id: string) => api.get<ApiResponse<any>>(`/purchases/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/purchases', data),
  suppliers: () => api.get<ApiResponse<any>>('/purchases/suppliers'),
  confirm: (id: string) => api.post<ApiResponse<any>>(`/purchases/${id}/confirm`),
  receive: (id: string) => api.post<ApiResponse<any>>(`/purchases/${id}/receive`),
  delete: (id: string) => api.delete<ApiResponse<any>>(`/purchases/${id}`),
};

export const warehouseApi = {
  list: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/warehouse', params),
  inventory: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/warehouse/inventory', params),
  locations: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/warehouse/locations', params),
  createInventory: (data: any) => api.post<ApiResponse<any>>('/warehouse/inventory', data),
  updateInventory: (id: string, data: any) => api.put<ApiResponse<any>>(`/warehouse/inventory/${id}`, data),
  deleteInventory: (id: string) => api.delete<ApiResponse<any>>(`/warehouse/inventory/${id}`),
  stockIn: (id: string, data: any) => api.post<ApiResponse<any>>(`/warehouse/inventory/${id}/stock-in`, data),
  stockOut: (id: string, data: any) => api.post<ApiResponse<any>>(`/warehouse/inventory/${id}/stock-out`, data),
  transfer: (data: any) => api.post<ApiResponse<any>>('/warehouse/stock-transfer', data),
};

export const sortingApi = {
  list: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/sorting', params),
  operators: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/sorting/operators', params),
  startSorting: (id: string, data?: any) => api.post<ApiResponse<any>>(`/sorting/${id}/start`, data),
  completeSorting: (id: string) => api.post<ApiResponse<any>>(`/sorting/${id}/complete`),
};

export const deliveryApi = {
  list: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/delivery', params),
  riders: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/delivery/riders', params),
  assignRider: (id: string, data: any) => api.post<ApiResponse<any>>(`/delivery/${id}/assign`, data),
  confirmPickup: (id: string) => api.post<ApiResponse<any>>(`/delivery/${id}/pickup`),
  confirmDelivery: (id: string) => api.post<ApiResponse<any>>(`/delivery/${id}/deliver`),
};

export const financeApi = {
  list: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/finance', params),
  transactions: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/finance/transactions', params),
  invoices: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/finance/invoices', params),
  issueInvoice: (id: string) => api.post<ApiResponse<any>>(`/finance/invoices/${id}/issue`),
};

export const reportApi = {
  dashboard: () => api.get<ApiResponse<any>>('/report/dashboard'),
  sales: (params?: any) => api.get<ApiResponse<any>>('/report/sales', params),
  customers: (params?: any) => api.get<ApiResponse<any>>('/report/customers', params),
};

export const customerApi = {
  list: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/customers', params),
  get: (id: string) => api.get<ApiResponse<any>>(`/customers/${id}`),
  create: (data: any) => api.post<ApiResponse<any>>('/customers', data),
  update: (id: string, data: any) => api.put<ApiResponse<any>>(`/customers/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<any>>(`/customers/${id}`),
};

export const marketingApi = {
  list: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/marketing', params),
  promotions: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/marketing/promotions', params),
  coupons: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/marketing/coupons', params),
  createPromotion: (data: any) => api.post<ApiResponse<any>>('/marketing/promotions', data),
  togglePromotion: (id: string) => api.post<ApiResponse<any>>(`/marketing/promotions/${id}/toggle`),
  createCoupon: (data: any) => api.post<ApiResponse<any>>('/marketing/coupons', data),
};

export const systemApi = {
  list: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/system', params),
  users: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/system/users', params),
  roles: (params?: any) => api.get<ApiResponse<PaginatedData<any>>>('/system/roles', params),
  config: () => api.get<ApiResponse<any>>('/system/config'),
  createUser: (data: any) => api.post<ApiResponse<any>>('/system/users', data),
  updateUser: (id: string, data: any) => api.put<ApiResponse<any>>(`/system/users/${id}`, data),
  toggleUser: (id: string) => api.post<ApiResponse<any>>(`/system/users/${id}/toggle`),
  createRole: (data: any) => api.post<ApiResponse<any>>('/system/roles', data),
  updateConfig: (data: any) => api.put<ApiResponse<any>>('/system/config', data),
};
