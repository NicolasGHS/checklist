import { useEffect, useState } from "react";
import { GetListsWithArchivedTodos } from "bindings/checklist/app";
import * as models from "bindings/checklist/core/models";
import ListItem from "@/components/ListItem";

// Someday tasks grouped by list; each ListItem loads and edits its own tasks.
export default function Someday() {
  const [lists, setLists] = useState<models.List[]>([]);

  const loadLists = async () => {
    const result = await GetListsWithArchivedTodos();
    setLists(result ?? []);
  };

  useEffect(() => {
    loadLists();

    // a task dropped on Someday (or moved out of it) adds or removes a section
    window.addEventListener("taskMoved", loadLists);
    return () => window.removeEventListener("taskMoved", loadLists);
  }, []);

  return (
    <div className="mt-10 flex flex-col min-h-full">
      <h1 className="text-3xl text-foreground font-bold mb-6">Someday</h1>
      {lists.map((list) => (
        <ListItem list={list} key={list.ID} />
      ))}
    </div>
  );
}
