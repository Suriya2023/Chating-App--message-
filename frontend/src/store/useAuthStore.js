import { create } from 'zustand';
import { axiosInstance } from '../Database/axios';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLogging: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkinAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check')
            set({ authUser: res.data })
        } catch (error) {
            console.error("Auth check failed:", error);
            set({ authUser: null, isCheckingAuth: false });
        } finally {
            set({ isCheckingAuth: false })
        }
    }
,
    signup: async (data) => {

    }
}));
