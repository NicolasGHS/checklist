import React, { useEffect, useState } from "react";
import {
  AddTodo,
  GetTodos,
  ToggleTodo,
  GetInboxTasks,
} from "../../wailsjs/go/main/App";
import { Task } from "../components/Task";
import { Todo } from "../types/todo";
import { NewTodoCard } from "../components/NewTodoCard";
import { NewTaskButton } from "../components/NewTaskButton";
import { Page } from "../components/Page";

const Inbox: React.FC = () => {
  return (
    <div>
      <Page title="Inbox" id={1} />
    </div>
  );
};

export default Inbox;
