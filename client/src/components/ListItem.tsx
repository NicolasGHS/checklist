import { useEffect, useState } from "react";
import { GetLists, GetTodosByList } from "../../wailsjs/go/main/App";
import { models } from "wailsjs/go/models";
import { Hash } from "lucide-react";
import { Task } from "./Task";

export default function ListItem() {
  const [lists, setLists] = useState<models.List[]>([]);
  const [todosByList, setTodosByList] = useState<Record<number, models.Todo[]>>(
    {}
  );
  const [openTodoId, setOpenTodoId] = useState<number>();

  const loadLists = async () => {
    try {
      const result = await GetLists();
      setLists(result);

      for (const list of result) {
        await loadTodos(list.ID);
      }
    } catch (error) {
      console.error("Failed to fetch lists", error);
    }
  };

  const loadTodos = async (listID: number) => {
    try {
      const result = await GetTodosByList(listID);
      setTodosByList((prev) => ({
        ...prev,
        [listID]: result,
      }));
    } catch (error) {
      console.error("Failed to fetch todo's: ", error);
    }
  };

  const handleToggle = async (id: number) => {
    console.log("asda");
  };

  const toggleTodoCard = (id: number) => {
    setOpenTodoId(id);
  };

  useEffect(() => {
    loadLists();
  }, []);

  return (
    <div>
      {lists.map((list) => (
        <div key={list.ID} className="mb-4">
          <div className="flex items-center gap-2">
            <Hash className="w-5" />
            <h1 className="text-xl">{list.Name}</h1>
          </div>

          <div className="ml-6 mt-2">
            {(todosByList[list.ID] ?? []).map((todo) => (
              <Task
                todo={todo}
                onToggle={handleToggle}
                currentListId={list.ID}
                openCard={toggleTodoCard}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
