"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type Status = "Pending" | "Completed";

export type Todo = {
  id: number;
  title: string;
  description: string;
  status: Status;
};

type TodoContextType = {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, "id">) => void;
  updateTodo: (id: number, todo: Omit<Todo, "id">) => void;
  deleteTodo: (id: number) => void;
  toggleTodoStatus: (id: number) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function useTodos(): TodoContextType {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return ctx;
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo: TodoContextType["addTodo"] = (todo) => {
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...todo,
      },
    ]);
  };

  const updateTodo: TodoContextType["updateTodo"] = (id, todo) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...todo } : t))
    );
  };

  const deleteTodo: TodoContextType["deleteTodo"] = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTodoStatus: TodoContextType["toggleTodoStatus"] = (id) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "Completed" ? "Pending" : "Completed",
            }
          : t
      )
    );
  };

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, updateTodo, deleteTodo, toggleTodoStatus }}
    >
      {children}
    </TodoContext.Provider>
  );
}


