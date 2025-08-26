import { NewTaskButton } from "./NewTaskButton";
import { Separator } from "./ui/separator";

type ToolbarProps = {
  showCard: () => void;
};

export const Toolbar = ({ showCard }: ToolbarProps) => {
  return (
    <div className="bottom-0 h-12 flex flex-col items-center justify-center">
      <Separator />
      <div className="h-full flex items-center justify-center">
        <NewTaskButton onClick={showCard} />
      </div>
    </div>
  );
};
