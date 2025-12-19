"use client";

import {
  createContext,
  useContext,
  useEffect,
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
  user: any;
  setUser: any;
  initialized: boolean; 
};

const userContext = createContext<TodoContextType | undefined>(undefined);

export function useUser(): TodoContextType {
  const ctx = useContext(userContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  // 🔥 Restore user safely
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setInitialized(true); 
  }, []);

  const addTodo = (todo: Omit<Todo, "id">) => {
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...todo,
      },
    ]);
  };

  const updateTodo = (id: number, todo: Omit<Todo, "id">) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...todo } : t))
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTodoStatus = (id: number) => {
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
    <userContext.Provider
      value={{
        todos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodoStatus,
        user,
        setUser,
        initialized, // ✅ PROVIDE THIS
      }}
    >
      {children}
    </userContext.Provider>
  );
}
