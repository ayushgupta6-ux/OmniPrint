import { Link } from "react-router";
import { User, LogOut, Package, ShieldCheck, Store, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserDropdownProps {
  userName: string;
  isAdmin: boolean;
  isVendor: boolean;
  onLogout: () => void;
}

export function UserDropdown({ userName, isAdmin, isVendor, onLogout }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3 hover:bg-secondary outline-none">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium">Welcome, {userName.split(" ")[0]}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">Logged in</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/orders" className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /><span>My Orders</span></Link>
        </DropdownMenuItem>
        
        {isAdmin && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/admin/products" className="flex items-center gap-2 text-accent"><ShieldCheck className="h-4 w-4" /><span>Admin Panel</span></Link>
          </DropdownMenuItem>
        )}
        
        {isVendor && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/vendor/dashboard" className="flex items-center gap-2 text-accent"><Store className="h-4 w-4" /><span>Vendor Dashboard</span></Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" /><span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}