import React from "react";
import { Button } from "../ui/button";
import { Ghost, LogOut, Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { logOutUser } from "@/store/auth-slice";

export default function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  function handleLogOut(req, res) {
    dispatch(logOutUser());
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className=" md:hidden sm:block">
        <Menu />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogOut}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}
