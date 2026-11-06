import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sidebarItems } from "@/constants/sidebarItems";

// Cmd/Ctrl + 1..6 jumps to the sidebar views in their sidebar order
// (Inbox, Today, Upcoming, Anytime, Someday, Logbook). Matches on `code`
// rather than `key` so it also works on layouts like AZERTY, where the
// digit row needs Shift.
export const useNavigationHotkeys = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;

      const match = /^Digit([1-9])$/.exec(e.code);
      if (!match) return;

      const item = sidebarItems[Number(match[1]) - 1];
      if (!item) return;

      e.preventDefault();
      navigate(item.url);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);
};
