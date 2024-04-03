import { LogOut, Mail, User } from "lucide-react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  Avatar,
  Dropdown,
} from "@nextui-org/react";
import { useNavigate, useOutletContext } from "@remix-run/react";
import { OutletContext } from "../types";
import { useEffect, useState } from "react";
import { LoginModal } from "./auth/LoginModal";

function DropdownMenuDemo() {
  const { session, supabase } = useOutletContext<OutletContext>();

  const navigate = useNavigate();
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={session.user.user_metadata.name}
          size="sm"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem
          key="profile"
          className="h-14 gap-2"
          onClick={() => navigate("/projects")}
        >
          <p className="font-semibold">Logget ind som</p>
          <p className="">{session.user.email}</p>
        </DropdownItem>
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onClick={() => supabase.auth.signOut()}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export const Header = () => {
  const { session } = useOutletContext<OutletContext>();
  const isAuthed = !!session?.user;

  const [showLogin, setShowLogin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (session?.user) {
      setShowLogin(false);
    }
  }, [session?.user]);

  return (
    <Navbar shouldHideOnScroll maxWidth="md">
      <NavbarBrand onClick={() => navigate("/")} className="cursor-pointer">
        <p className="text-2xl font-bold">kh</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          {isAuthed ? (
            <DropdownMenuDemo />
          ) : (
            <Button
              onClick={() => setShowLogin(true)}
              as={Link}
              color="default"
              variant="flat"
            >
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
      <LoginModal isOpen={showLogin} onOpenChange={setShowLogin} />
    </Navbar>
  );
};
