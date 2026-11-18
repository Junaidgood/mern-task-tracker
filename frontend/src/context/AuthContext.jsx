import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, loginUser, registerUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  // 1. Current user query (No duplicate state copy, directly derived from server)
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getMe,
    retry: false, // 401 par baar baar retry na kare
  });

  // 2. Login Mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // 3. Register Mutation
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // 4. Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear(); // Clear cached tasks
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        authError:
          loginMutation.error?.response?.data?.message ||
          registerMutation.error?.response?.data?.message,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
