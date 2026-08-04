import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router';

const API_URL = 'http://localhost:8080/api/v1/auth';



export const useAuth = () => {
  const setToken = useAuthStore((state: any) => state.setToken);
  const navigate = useNavigate();

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setToken(data.token); // Save token to Zustand & LocalStorage
      navigate('/'); // Redirect to Home
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: user) => {
      // Mapping frontend schema to backend DTO
      const payload = {
        name: userData.name,
        email: userData.email,
        number: userData.phoneNumber, // Backend expects 'number'
        password: userData.password,
        role:userData.role 
      };
      const response = await axios.post(`${API_URL}/register`, payload);
      return response.data;
    },
    onSuccess: () => {
      navigate('/login'); // Redirect to login on success
    }
  });

  return { loginMutation, registerMutation };
};

interface user{
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    role: string
}