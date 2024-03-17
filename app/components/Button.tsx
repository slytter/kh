import { Button } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";

type NavButtonProps = {
  route: string;
  onClick?: () => void;
  title: string;
  disabled?: boolean;
};

export const NavBotton = (props: NavButtonProps) => {
  const { route, onClick, title, disabled } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    navigate(route);
  };

  return (
    <Button
      color="primary"
      size="lg"
      href="/create"
      disabled={disabled}
      onClick={handleClick}
      className="mx-auto font-bold disabled:cursor-wait disabled:opacity-20"
    >
      {title}
    </Button>
  );
};
