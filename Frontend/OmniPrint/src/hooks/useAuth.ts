import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router';
import { api } from '@/api/api';

export const useAuth = () => {
  const setToken = useAuthStore((state: any) => state.setToken);
  const navigate = useNavigate();

  // Login Mutation
  const loginMutation = useMutation<{ token: string }, unknown, { email: string; password: string }>({
    mutationFn: async (credentials) => {
      return api.auth.login(credentials);
    },
    onSuccess: (data) => {
      setToken(data.token); // Save token to Zustand & LocalStorage
      navigate('/'); // Redirect to Home
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: user) => {
      return api.auth.register(userData);
    },
    onSuccess: () => {
      navigate('/login'); // Redirect to login on success
    },
  });

  return { loginMutation, registerMutation };
};

interface user {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}