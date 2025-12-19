import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Helper to decode JWT safely
const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
};

const useStore = create(
  persist(
    (set) => ({
      // State variables
      token: null,
      user: null,
      isAuthenticated: false,
      quizResults: null,
      resumeData: null, // <--- This stores the parsed resume text
      aiResult: null,   // <--- This stores the final AI analysis

      // Actions (Functions)
      login: (token) => {
        const decodedUser = decodeToken(token);
        set({
          token,
          user: decodedUser,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          quizResults: null,
          resumeData: null,
          aiResult: null
        });
      },

      // These are the functions your error says are missing:
      setQuizResults: (results) => set({ quizResults: results }),
      setResumeData: (data) => set({ resumeData: data }), 
      setAIResult: (result) => set({ aiResult: result }),
    }),
    {
      name: 'cynosure-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage),
      // Persist these fields:
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        quizResults: state.quizResults,
        // resumeData and aiResult are usually large, but we persist them 
        // so data isn't lost on refresh
        resumeData: state.resumeData, 
        aiResult: state.aiResult
      }),
    }
  )
);

export default useStore;