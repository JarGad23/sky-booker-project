export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
  totalSeats: number;
  availableSeats: number;
  airline: string;
}

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  seatNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  flight: Flight;
  passenger: Passenger;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}
