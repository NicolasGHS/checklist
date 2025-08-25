import { Checkbox } from "./ui/checkbox";

type TaskProps = {
  name: string;
};

export const Task = ({ name }: TaskProps) => {
  return (
    <div className="flex gap-3 items-center">
      <Checkbox />
      <p className="text-foreground">{name}</p>
    </div>
  );
};
