import { List } from "../types/list";

type ListsProps = {
  items: List[];
};

export const Lists = ({ items }: ListsProps) => {
  return (
    <div className="mt-3 flex flex-col items-start ml-2 gap-2">
      {items.map((list) => (
        <p>{list.Name}</p>
      ))}
    </div>
  );
};
