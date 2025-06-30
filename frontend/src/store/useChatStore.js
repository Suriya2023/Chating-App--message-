// ✅ useChatStore.js (Zustand Store)
import { create } from 'zustand';
import { axiosInstance } from '../Database/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  userLastActivityMap: {}, // ✅ Track last message time

  // ✅ Set selected user
  setSelectedUser: (user) => set({ selectedUser: user }),

  // ✅ Fetch user list
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/messages/users');
      set({ users: res.data });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load users');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ✅ Fetch messages with selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load messages');
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ✅ Update last activity timestamp
  updateUserLastActivity: (userId) => {
    set((state) => ({
      userLastActivityMap: {
        ...state.userLastActivityMap,
        [userId]: Date.now(),
      },
    }));
  },

  // ✅ Listen to incoming messages in real-time
  ToMessahes: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage"); // clear any existing listener

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get(); // ✅ Always get the latest selectedUser

      // ✅ Only append if the message belongs to the current selected user
      if (!selectedUser || newMessage.senderId !== selectedUser._id) return;

      get().updateUserLastActivity(newMessage.senderId);

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  // ✅ Remove listener (on unmount or switch)
  fromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
  },

  // ✅ Send message
  sendMessages: async (messageData) => {
    const { selectedUser, messages, updateUserLastActivity } = get();

    if (!selectedUser) {
      toast.error("No user selected to send message.");
      return;
    }

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      updateUserLastActivity(selectedUser._id);
      set({ messages: [...messages, res.data] });

    } catch (error) {
      toast.error(error?.response?.data?.message || 'Message send failed');
    }
  },
}));