import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

export function useFlights(params?: {
  origin?: string;
  destination?: string;
  departureDate?: string;
}) {
  return useQuery({
    queryKey: ["flights", params],
    queryFn: () => api.getFlights(params),
  });
}

export function useFlight(id: string) {
  return useQuery({
    queryKey: ["flight", id],
    queryFn: () => api.getFlight(id),
    enabled: !!id,
  });
}

export function useAvailableSeats(flightId: string) {
  return useQuery({
    queryKey: ["seats", flightId],
    queryFn: () => api.getAvailableSeats(flightId),
    enabled: !!flightId,
  });
}

export function useMyBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: () => api.getMyBookings(),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      flightId: string;
      seatNumber: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    }) => api.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["seats"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
