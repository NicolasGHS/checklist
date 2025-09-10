import { formatDateYMD } from "@/utils/dates";

type DeadlineProps = {
  date: string;
};

export const Deadline = ({ date }: DeadlineProps) => {
  return (
    <div>
      <p>deadline: {formatDateYMD(date)}</p>
    </div>
  );
};
