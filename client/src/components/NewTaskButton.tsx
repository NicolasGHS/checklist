import { Button } from "./ui/button";
import { Plus } from "lucide-react";

type NewTaskProps = {
  onClick: () => void;
};

export const NewTaskButton = ({ onClick }: NewTaskProps) => {
  return (
    <div>
      <Button
        variant="secondary"
        onClick={onClick}
        size="icon"
        className="size-8"
      >
        <Plus />
      </Button>
    </div>
  );
};
