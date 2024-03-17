import { Button } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";

type NavButtonProps = {
  route: string;
  onClick?: () => void;
  title: string;
};

export const NavBotton = (props: NavButtonProps) => {
  const { route, onClick, title } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    onClick?.();
    navigate(route);
  };

  return (
    <Button
      color="primary"
      size="lg"
      href="/create"
      onClick={handleClick}
      className="mx-auto font-bold"
    >
      {title}
    </Button>
  );
};
