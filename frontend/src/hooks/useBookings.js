import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingsApi';

// Query keys
const BOOKING_KEYS = {
  all: ['bookings'],
  lists: () => [...BOOKING_KEYS.all, 'list'],
  list: (filters) => [...BOOKING_KEYS.lists(), filters],
  details: () => [...BOOKING_KEYS.all, 'detail'],
  detail: (id) => [...BOOKING_KEYS.details(), id],
  myBookings: (filters) => [...BOOKING_KEYS.all, 'my-bookings', filters]
};

// Get user bookings
export const useMyBookings = (params = {}) => {
  return useQuery({
    queryKey: BOOKING_KEYS.myBookings(params),
    queryFn: () => bookingApi.getMyBookings(params),
    staleTime: 30000 // 30 seconds
  });
};

// Get single booking
export const useBooking = (id) => {
  return useQuery({
    queryKey: BOOKING_KEYS.detail(id),
    queryFn: () => bookingApi.getById(id),
    enabled: !!id
  });
};

// Create booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookingApi.create,
    onSuccess: () => {
      // Invalidate and refetch only bookings list
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.all });
    }
  });
};

// Cancel booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookingApi.cancel,
    onSuccess: (data, bookingId) => {
      // Update specific booking in cache
      queryClient.setQueryData(BOOKING_KEYS.detail(bookingId), data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.all });
    }
  });
};

// Admin: Get all bookings
export const useAllBookings = (params = {}) => {
  return useQuery({
    queryKey: BOOKING_KEYS.list(params),
    queryFn: () => bookingApi.getAll(params),
    staleTime: 30000
  });
};

// Admin: Update booking status
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => bookingApi.updateStatus(id, status),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(BOOKING_KEYS.detail(id), data);
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.lists() });
    }
  });
};
