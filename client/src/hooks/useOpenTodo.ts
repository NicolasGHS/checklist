import { useCallback, useState } from "react";
import { useEscapeKey } from "./useEscapeKey";

export const useOpenTodo = () => {
  const [openTodoId, setOpenTodoId] = useState<number>();

  const open = useCallback((id: number) => setOpenTodoId(id), []);
  const close = useCallback(() => setOpenTodoId(undefined), []);

  useEscapeKey(() => {
    if (openTodoId) close();
  });

  return { openTodoId, open, close };
};
