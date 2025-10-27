import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserRoundCog,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { logOutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper.jsx";
import { Label } from "../ui/label";
import { Search } from "lucide-react";

function HeaderRightContent() {
  const dispatch = useDispatch();
  function handleLogOut() {
    dispatch(logOutUser());
  }
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);
  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => {
            setOpenCartSheet(true);
          }}
          variant="outline"
          size="icon"
          className='relative p-5'
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute top-[-0px] right-[5px] text-sm ">{cartItems?.length || 0} </span>
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper cartItems={cartItems} setOpenCartSheet={setOpenCartSheet} />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserRoundCog className="mr-2 h-4 w-4" /> Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleLogOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  function handleNavigate(item) {
    sessionStorage.removeItem("productFilters");
    const currentFilter =
      item.id !== "home" && item.id !== "products" && item.id !== "search"
        ? {
            category: [item.id],
          }
        : null;
    sessionStorage.setItem("productFilters", JSON.stringify(currentFilter));
    console.log("Navigating to:", item, "with filters:", currentFilter);
    location.pathname.includes('listings') && currentFilter !==null ?  setSearchParams(new URLSearchParams(`?category=${item.id}`)) : 
    navigate(item.href);
  }
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingMenuItems.map((item) => (
        <Label
          onClick={() => handleNavigate(item)}
          className="text-sm font-medium "
          key={item.id}
          to={item.href}
        >
          {
            item.label === 'Search' ? <Search className="h-4 w-4 ml-4"/> : <span className="text-black"> {item.label}</span>
            }
       
        </Label>
      ))}
    </nav>
  );
}

export default function ShoppingHeader() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2" to="/shop/home">
          <HousePlug className="h-6 w-6 text-black" />
          <span className="font-bold text-black">ECommerce</span>
        </Link>
        <Sheet>
          <SheetTrigger>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className=" hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}
