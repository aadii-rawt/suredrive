"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";

export default function Header() {
  const { user, setUser } = useUser();
  const router = useRouter();

  if (!user) return null; 

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const firstLetter = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="w-full  bg-background">
      <div className="max-w-5xl mx-auto border-b flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold"></h1>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 cursor-pointer rounded-full">
              <Avatar className="h-9 w-9">
                {/* If you later add profile image */}
                <AvatarImage src={user.avatar || ""} alt={user.name} />
                <AvatarFallback>{firstLetter}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
            <IoIosLogOut className="text-red-600"/>  Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
