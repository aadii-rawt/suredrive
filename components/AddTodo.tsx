"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Status = "Pending" | "Completed";

type AddTodoProps = {
  open: boolean;
  editingId: number | null;
  title: string;
  description: string;
  status: Status;
  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setStatus: (v: Status) => void;
  onSave: () => void;
  onClose: () => void;
};

export default function AddTodo({
  open,
  editingId,
  title,
  description,
  status,
  setTitle,
  setDescription,
  setStatus,
  onSave,
  onClose,
}: AddTodoProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {editingId ? "Edit Todo" : "Add Todo"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="cursor-pointer">
              ✕
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              required
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
            
              <Button
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button className="flex-1 cursor-pointer" onClick={onSave}>
                {editingId ? "Save Changes" : "Create Todo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
