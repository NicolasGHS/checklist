import { createContext, useState, useEffect, useCallback } from "react";
import { GetTodayCount, GetListCount } from "../../wailsjs/go/main/App";

type CountContextType = {
  inboxCount: number;
  todayCount: number;
  refreshCounts: () => void;
};

export const CountContext = createContext<CountContextType | null>(null);

export const CountContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [inboxCount, setInboxCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);

  const refreshCounts = useCallback(async () => {
    try {
      const [today, inbox] = await Promise.all([
        GetTodayCount(),
        GetListCount(1),
      ]);
      setTodayCount(today);
      setInboxCount(inbox);
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  }, []);

  useEffect(() => {
    refreshCounts();

    const handleTaskMoved = () => {
      refreshCounts();
    };

    window.addEventListener("taskMoved", handleTaskMoved);
    return () => {
      window.removeEventListener("taskMoved", handleTaskMoved);
    };
  }, [refreshCounts]);

  return (
    <CountContext.Provider value={{ inboxCount, todayCount, refreshCounts }}>
      {children}
    </CountContext.Provider>
  );
};
