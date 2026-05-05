import React, { createContext, useContext, useState, useCallback } from 'react';

type Ctx = {
  swipeEnabled: boolean;
  setSwipeEnabled: (v: boolean) => void;
};

const TabSwipeContext = createContext<Ctx>({
  swipeEnabled: true,
  setSwipeEnabled: () => {},
});

export function TabSwipeProvider({ children }: { children: React.ReactNode }) {
  const [swipeEnabled, setSwipeEnabledState] = useState(true);
  const setSwipeEnabled = useCallback((v: boolean) => setSwipeEnabledState(v), []);
  return (
    <TabSwipeContext.Provider value={{ swipeEnabled, setSwipeEnabled }}>
      {children}
    </TabSwipeContext.Provider>
  );
}

export function useTabSwipe() {
  return useContext(TabSwipeContext);
}
