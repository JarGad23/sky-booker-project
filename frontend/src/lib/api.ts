import { Flight, Booking, AuthResponse, User } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Auth
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(result.access_token);
    return result;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(result.access_token);
    return result;
  }

  logout() {
    this.setToken(null);
  }

  async getMe(): Promise<User> {
    return this.request<User>('/users/me');
  }

  // Flights
  async getFlights(params?: {
    origin?: string;
    destination?: string;
    departureDate?: string;
  }): Promise<Flight[]> {
    const searchParams = new URLSearchParams();
    if (params?.origin) searchParams.set('origin', params.origin);
    if (params?.destination) searchParams.set('destination', params.destination);
    if (params?.departureDate) searchParams.set('departureDate', params.departureDate);

    const query = searchParams.toString();
    return this.request<Flight[]>(`/flights${query ? `?${query}` : ''}`);
  }

  async getFlight(id: string): Promise<Flight> {
    return this.request<Flight>(`/flights/${id}`);
  }

  async getAvailableSeats(flightId: string): Promise<string[]> {
    return this.request<string[]>(`/flights/${flightId}/seats`);
  }

  // Bookings
  async createBooking(data: {
    flightId: string;
    seatNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }): Promise<Booking> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyBookings(): Promise<Booking[]> {
    return this.request<Booking[]>('/bookings/my');
  }

  async cancelBooking(id: string): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
