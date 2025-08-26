import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type NewTaskProps = {
  onClick: () => void;
};

// TODO: make meta icon dynamic with windows
export const NewTaskButton = ({ onClick }: NewTaskProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          onClick={onClick}
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>⌘ + n</HoverCardContent>
    </HoverCard>
  );
};
