"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";

/* ---------------- TYPES ---------------- */
type Status = "Pending" | "Completed";

type Todo = {
  id: number;
  title: string;
  description: string;
  status: Status;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("Pending");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {user} = useUser()
  console.log("user", user);
  

  /* ---------------- CREATE / UPDATE ---------------- */
  const handleSave = () => {
    if (!title.trim()) return;

    if (editingId !== null) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingId
            ? { ...todo, title, description, status }
            : todo
        )
      );
      setEditingId(null);
    } else {
      setTodos((prev) => [
        ...prev,
        {
          id: Date.now(),
          title,
          description,
          status,
        },
      ]);
    }

    setTitle("");
    setDescription("");
    setStatus("Pending");
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
    setStatus(todo.status);
    setIsModalOpen(true);
  };

  /* ---------------- TOGGLE STATUS (CHECKBOX) ---------------- */
  const handleToggleStatus = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status: todo.status === "Completed" ? "Pending" : "Completed",
            }
          : todo
      )
    );
  };

  /* ---------------- MODAL HELPERS ---------------- */
  const handleOpenNew = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus("Pending");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
        {/* DASHBOARD HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Todo Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage your tasks, mark them complete, and keep track of progress.
            </p>
          </div>
          <Button onClick={handleOpenNew}>Add Todo</Button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {todos.length === 0 && (
            <p className="text-center text-muted-foreground">
              No tasks added yet
            </p>
          )}

          {todos.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
              {todos.map((todo) => (
                <Card key={todo.id} className="h-full">
                  <CardContent className="py-4 space-y-3 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-muted-foreground/40 accent-primary"
                              checked={todo.status === "Completed"}
                              onChange={() => handleToggleStatus(todo.id)}
                            />
                            <h3
                              className={`font-semibold ${
                                todo.status === "Completed"
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {todo.title}
                            </h3>
                          </div>
                          {todo.description && (
                            <p className="text-sm text-muted-foreground">
                              {todo.description}
                            </p>
                          )}
                        </div>

                        <Badge
                          variant={
                            todo.status === "Completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {todo.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(todo)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(todo.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-md">
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-lg">
                    {editingId ? "Edit Todo" : "Add Todo"}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseModal}
                  >
                    <span className="sr-only">Close</span>
                    ✕
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as Status)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" onClick={handleSave}>
                      {editingId ? "Save Changes" : "Create Todo"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
