"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import Shimmer from "@/components/Shimmer";

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
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<"All" | Status>("All");
  const [search, setSearch] = useState("");

  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const fetchTodos = async () => {
      try {
        const res = await api.get(`/todos?userId=${user.id}`);
        setTodos(res.data.todos);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [user]);

  const filteredTodos = todos.filter((todo) => {
    const statusMatch =
      filterStatus === "All" || todo.status === filterStatus;

    const searchMatch = todo.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });


  const handleSave = async () => {
    if (!user?.id) return;

    if(title == ""){
      setError("Please enter the todo title")
      return
    }

    try {
      if (editingId) {
        const res = await api.put("/todos", {
          id: editingId,
          title,
          description,
          status,
        });

        setTodos((prev) =>
          prev.map((t) => (t.id === editingId ? res.data.todo : t))
        );
      } else {
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

    handleCloseModal()

    setTitle("");
    setDescription("");
    setStatus("Pending");
    setEditingId(null);
  };


  const handleDelete = async (id: number) => {
    await api.delete("/todos", { data: { id } });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };


  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
    setStatus(todo.status);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: number) => {
    const updatedTodo = todos.find((t) => t.id === id);
    if (!updatedTodo) return;

    const newStatus: Status =
      updatedTodo.status === "Completed" ? "Pending" : "Completed";

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      )
    );

    await api.put("/todos", {
      id,
      status: newStatus,
    });
  };

  
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

      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
          {/* HEADER */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Task Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your tasks and track progress.
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <Input
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48"
              />

              <Select
                value={filterStatus}
                onValueChange={(v) =>
                  setFilterStatus(v as "All" | Status)
                }
              
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className="cursor-pointer">
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleOpenNew} className="cursor-pointer">Add Todo</Button>
            </div>
          </div>

          {/* LIST */}
          {loading ? (
            <Shimmer />
          ) : filteredTodos.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No matching tasks found
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredTodos.map((todo) => (
                <Card key={todo.id} className="group">
                  <CardContent className="py-3 space-y-3 flex flex-col justify-between h-full">
                    <div className="flex justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={todo.status === "Completed"}
                            onChange={() => handleToggleStatus(todo.id)}
                            className="cursor-pointer"
                          />
                          <h3
                            className={`text-xl font-semibold ${
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
                        className={
                          todo.status === "Completed"
                            ? "bg-green-500"
                            : "bg-amber-400"
                        }
                      >
                        {todo.status}
                      </Badge>
                    </div>

                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(todo)}
                        className="cursor-pointer"
                      >
                        <FiEdit3 /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(todo.id)}
                        className="cursor-pointer"

                      >
                        <MdDeleteOutline /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

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
            }}
            onClose={handleCloseModal}
            error={error}
          />
        </div>
      </div>

      <footer className="py-4 text-center text-sm text-muted-foreground">
        Made with 🩶 by{" "}
        <Link
          href="https://aditya.dotdazzle.in"
          className="underline hover:text-foreground"
        >
          Aditya Rawat
        </Link>
      </footer>
    </AuthGuard>
  );
}
