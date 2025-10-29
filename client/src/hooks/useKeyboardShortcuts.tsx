import { useEffect } from "react";

export const useKeyboardShortcuts = ({
  onNewTask,
  onCloseTask,
}: {
  onNewTask: () => void;
  onCloseTask: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        onNewTask();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onCloseTask();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewTask, onCloseTask]);
};
