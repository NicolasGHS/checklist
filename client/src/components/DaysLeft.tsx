import { Flag } from "lucide-react";

type DaysLeftProps = {
  difference: number | undefined;
};

export const DaysLeft = ({ difference }: DaysLeftProps) => {
  return (
    <div>
      {typeof difference === "number" && difference > 0 && (
        <div className="flex ml-auto gap-2">
          <Flag className="w-4" />
          <p className="text-foreground">{difference} days left</p>
        </div>
      )}

      {typeof difference === "number" && difference <= 0 && (
        <p className="ml-auto text-foreground">Today</p>
      )}
    </div>
  );
};
