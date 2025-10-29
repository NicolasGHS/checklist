import { useState } from "react";
import { Button } from "../ui/button";
import { Flag } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Deadline } from "./Deadline";
import { DaysLeft } from "../DaysLeft";

type DeadlinePickerProps = {
  deadline?: Date;
  daysLeft?: number;
  onSelect: (date: Date) => void;
  onDelete: () => void;
  completed?: boolean;
};

export const DeadlinePicker = ({
  deadline,
  daysLeft,
  onSelect,
  onDelete,
  completed,
}: DeadlinePickerProps) => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="flex items-center justify-between">
      {deadline && (
        <div className="group flex items-center gap-2">
          <Deadline date={deadline} deleteDeadline={onDelete} />
          {!completed && <DaysLeft difference={daysLeft} />}
        </div>
      )}

      <div className="relative">
        <Button size="icon" onClick={() => setShowCalendar(!showCalendar)}>
          <Flag className="w-4" />
        </Button>
        {showCalendar && (
          <div className="absolute top-full right-0 z-50 mt-2">
            <Calendar
              mode="single"
              selected={deadline}
              onSelect={(d) => {
                if (d) {
                  onSelect(d);
                  setShowCalendar(false);
                }
              }}
              className="rounded-lg border bg-background shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};
