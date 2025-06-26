import { create } from "zustand";

const storedTheme = localStorage.getItem("chat-theme") || "light";

export const useThemeStore = create((set) => ({
  theme: storedTheme,
  setTheme: (newTheme) => {
    localStorage.setItem("chat-theme", newTheme);
    set({ theme: newTheme });
  },
}));
