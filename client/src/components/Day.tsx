import { Separator } from "./ui/separator";

type DayProps = {
  dayNumber: string;
  weekday: string;
};

export const Day = ({ dayNumber, weekday }: DayProps) => {
  return (
    <div className="flex gap-2 min-h-28">
      <p className="text-2xl">{dayNumber}</p>
      <div className="w-full flex flex-col items-start mr-3">
        <Separator />
        <p className="text-muted-foreground">{weekday}</p>
      </div>
    </div>
  );
};
