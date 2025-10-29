import { Button } from "../ui/button";
import { Plus } from "lucide-react";

type NewTaskProps = {
  onClick: () => void;
};

export const NewTaskButton = ({ onClick }: NewTaskProps) => {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};
