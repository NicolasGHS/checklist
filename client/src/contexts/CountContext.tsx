import { createContext, useState } from "react";

type CountContextType = {
  inboxCount: number;
  setInboxCount: React.Dispatch<React.SetStateAction<number>>;
  todayCount: number;
  setTodayCount: React.Dispatch<React.SetStateAction<number>>;
};

export const CountContext = createContext<CountContextType | null>(null);

export const CountContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [inboxCount, setInboxCount] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);

  return (
    <CountContext.Provider
      value={{ inboxCount, setInboxCount, todayCount, setTodayCount }}
    >
      {children}
    </CountContext.Provider>
  );
};
