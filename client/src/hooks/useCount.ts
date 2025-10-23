// src/hooks/useCount.ts
import { useContext } from "react";
import { CountContext } from "@/contexts/CountContext";

export const useCount = () => {
  const context = useContext(CountContext);
  if (!context) {
    throw new Error("useCount must be used within a CountContextProvider");
  }
  return context;
};
