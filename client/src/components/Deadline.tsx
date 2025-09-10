import { formatDateYMD } from "@/utils/dates";
import { X } from "lucide-react";
import { Button } from "./ui/button";

type DeadlineProps = {
  taskId: number;
  date: string;
};

export const Deadline = ({ taskId, date }: DeadlineProps) => {
  const deleteDeadline = async () => {
    console.log(`delete from id: ${taskId}`);
  };

  return (
    <div className="flex items-center gap-2">
      <p>deadline: {formatDateYMD(date)}</p>
      <Button
        variant="outline"
        size="icon"
        className="size-6"
        onClick={deleteDeadline}
      >
        <X className="w-4" />
      </Button>
    </div>
  );
};
