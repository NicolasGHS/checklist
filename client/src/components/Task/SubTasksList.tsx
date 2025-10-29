import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { models } from "wailsjs/go/models";
import {
  GetSubtasks,
  AddSubtask,
  ToggleTodo,
} from "../../../wailsjs/go/main/App";
import { Subtask } from "./Subtask";

type SubtasksListProps = {
  parentId: number;
};

export const SubtasksList = ({ parentId }: SubtasksListProps) => {
  const [subtasks, setSubtasks] = useState<models.Todo[]>([]);
  const [newName, setNewName] = useState("");

  const loadSubtasks = async () => {
    const result = await GetSubtasks(parentId);
    setSubtasks(result || []);
  };

  useEffect(() => {
    loadSubtasks();
  }, [parentId]);

  const addSubtask = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newName.trim()) {
      e.preventDefault();
      await AddSubtask(newName.trim(), parentId);
      setNewName("");
      await loadSubtasks();
    }
  };

  const toggleSubtask = async (id: number) => {
    await ToggleTodo(id);
    await loadSubtasks();
  };

  return (
    <div className="ml-7 mt-3 space-y-2">
      {subtasks.map((subtask) => (
        <Subtask key={subtask.ID} subtask={subtask} onToggle={toggleSubtask} />
      ))}
      <div className="flex items-center gap-3">
        <div className="w-4 h-4" />
        <Input
          placeholder="Add subtask..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={addSubtask}
          className="border-0 focus-visible:ring-0 shadow-none text-sm"
        />
      </div>
    </div>
  );
};
