import { Checkbox } from "./ui/checkbox";
import { models } from "wailsjs/go/models";

type SubtaskProps = {
  subtask: models.Todo;
  onToggle: (id: number) => void;
};

export const Subtask = ({ subtask, onToggle }: SubtaskProps) => {
  const handleChange = () => {
    onToggle(subtask.ID);
  };

  return (
    <div className="flex gap-3 items-center ml-7 my-1">
      <Checkbox checked={subtask.Completed} onCheckedChange={handleChange} />
      <p
        className={`text-sm ${
          subtask.Completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {subtask.Name}
      </p>
    </div>
  );
};
