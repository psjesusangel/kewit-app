import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'listener' | 'performer';

type OnboardingData = {
  role: Role | null;
  name: string;
  email: string;
  password: string;
};

type OnboardingContextType = {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
  resetData: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>({
    role: null,
    name: '',
    email: '',
    password: '',
  });

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const resetData = () => {
    setData({
      role: null,
      name: '',
      email: '',
      password: '',
    });
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}