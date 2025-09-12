import { formatDateYMD } from "@/utils/dates";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Flag } from "lucide-react";

type DeadlineProps = {
  date: Date;
  deleteDeadline: () => void;
};

export const Deadline = ({ date, deleteDeadline }: DeadlineProps) => {
  return (
    <div className="group flex items-center gap-2">
      <Flag className="w-4" />
      <p>Deadline: {formatDateYMD(date)}</p>
      <Button
        variant="outline"
        size="icon"
        className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={deleteDeadline}
      >
        <X className="w-4" />
      </Button>
    </div>
  );
};
