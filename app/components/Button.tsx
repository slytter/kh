import { Button } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";

type NavButtonProps = {
  route?: string;
  onClick?: () => void;
  title: string;
  disabled?: boolean;
  type?: "submit" | "button";
  startContent?: React.ReactNode;
};

export const NavBotton = (props: NavButtonProps) => {
  const { route, onClick, title, disabled, type, startContent } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    route && navigate(route);
  };

  return (
    <Button
      color="primary"
      size="lg"
      disabled={disabled}
      type={type || "button"}
      onClick={handleClick}
      variant="shadow"
      radius="lg"
      startContent={startContent}
      className="mx-auto disabled:cursor-wait disabled:opacity-20"
    >
      {title}
    </Button>
  );
};
