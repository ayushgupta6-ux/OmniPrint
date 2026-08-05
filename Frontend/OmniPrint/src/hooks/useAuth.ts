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
    onSuccess: async (data) => {
      setToken(data.token); // Save token to Zustand & LocalStorage
      try {
        // 1. Decode token to check role and ID
        const payload = JSON.parse(atob(data.token.split('.')[1]));

        // 2. SMART ROUTING LOGIC
        if (payload.role === 'VENDOR') {
           try {
               // Check if this vendor has created an agency profile yet
               const profile = await api.vendor.getVendorProfile(payload.userId); 
               
               if (profile && profile.agencyName) {
                   navigate('/vendor/dashboard'); // Already onboarded!
               } else {
                   navigate('/vendor/onboarding'); // Needs setup!
               }
           } catch (profileError) {
               // If the API throws an error (like a 404 Not Found), it means no profile exists
               navigate('/vendor/onboarding');
           }
        } else {
            // Normal user routing
            navigate('/'); 
        }
      } catch (tokenError) {
        console.error("Failed to parse token:", tokenError);
        navigate('/'); // Fallback routing if token decoding fails
      }
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