"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import AddTodo from "@/components/AddTodo";
import Link from "next/link";
import api from "@/lib/axios";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { json } from "stream/consumers";
import Shimmer from "@/components/Shimmer";

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
  const { user } = useUser()
  console.log("user", user);
  const [loading,setLoading] = useState<boolean>(true)


  useEffect(() => {
    if (!user?.id) return;

    const fetchTodos = async () => {
      try {
        const res = await api.get(`/todos?userId=${user.id}`);
        setTodos(res.data.todos);
        
      } catch (error) {
        console.log(error);
        
      } finally{
        setLoading(false)
      }
    };

    fetchTodos();
  }, [user]);


  /* ---------------- CREATE / UPDATE ---------------- */
  const handleSave = async () => {
    if (!title.trim() || !user?.id) return;

    try {
      // 🔵 UPDATE
      if (editingId) {
        const res = await api.put("/todos", {
          id: editingId,
          title,
          description,
          status,
        });

        setTodos((prev) =>
          prev.map((t) =>
            t.id === editingId ? res.data.todo : t
          )
        );
      }
      // 🟢 CREATE
      else {
        const res = await api.post("/todos", {
          title,
          description,
          status,
          userId: user.id,
        });

        setTodos((prev) => [res.data.todo, ...prev]);
      }
    } catch (err) {
      console.error("Failed to save todo");
    }

    // reset
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setEditingId(null);
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: string) => {
    await api.delete("/todos", { data: { id } });
    setTodos((prev) => prev.filter((t) => t.id.toString() !== id));
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
  const handleToggleStatus = async (id: number) => {

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
    const res = await api.put("/todos", {
      id: id,
      status,
    });
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
    <AuthGuard>
      <Header />
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1">
          <div className="max-w-5xl mx-auto w-full py-10 px-4 space-y-8">
            {/* DASHBOARD HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Task Management</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your tasks, mark them complete, and keep track of progress.
                </p>
              </div>
              <Button onClick={handleOpenNew}>Add Todo</Button>
            </div>

            {/* LIST */}
            <div className="space-y-4">
              {loading ? <Shimmer /> : todos.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No tasks added yet
                </p>
              )}

              {todos.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
                  {todos.map((todo) => (
                    <Card key={todo.id} className="h-full group">
                      <CardContent className="py-2 space-y-3 h-full flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4  cursor-pointer rounded border-muted-foreground/40 accent-primary"
                                  checked={todo.status === "Completed"}
                                  onChange={() => handleToggleStatus(todo.id)}
                                />
                                <h3
                                  className={`font-semibold text-xl ${todo.status === "Completed"
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
                              className={
                                todo.status === "Completed"
                                  ? "bg-green-500"
                                  : "bg-amber-400"
                              }
                            >
                              {todo.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="justify-end gap-2 pt-1 flex opacity-0 group-hover:opacity-100 duration-500">
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => handleEdit(todo)}
                          >
                            <FiEdit3 /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={() => handleDelete(todo.id)}
                          >
                            <MdDeleteOutline />  Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <AddTodo
              open={isModalOpen}
              editingId={editingId}
              title={title}
              description={description}
              status={status}
              setTitle={setTitle}
              setDescription={setDescription}
              setStatus={setStatus}
              onSave={() => {
                handleSave();
                handleCloseModal();
              }}
              onClose={handleCloseModal}
            />


          </div>
        </div>
      </div>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        Made with 🩶 by{" "}
        <Link href="https://aditya.dotdazzle.in" className="underline hover:text-foreground">
          Aditya Rawat
        </Link>
      </footer>

    </AuthGuard>
  );
}
