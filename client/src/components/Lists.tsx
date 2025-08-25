import { List } from "../types/list";

type ListsProps = {
  items: List[];
};

export const Lists = ({ items }: ListsProps) => {
  return (
    <div>
      {items.map((list) => (
        <p>{list.Name}</p>
      ))}
    </div>
  );
};
