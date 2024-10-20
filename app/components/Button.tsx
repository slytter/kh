import { Button, Tooltip } from "@nextui-org/react";
import { PrefetchPageLinks, useNavigate } from "@remix-run/react";

type NavButtonProps = {
  route?: string;
  onClick?: () => void;
  title: string;
  disabled?: boolean;
  disabledReason?: string;
  type?: "submit" | "button";
  startContent?: React.ReactNode;
};

export const NavBotton = (props: NavButtonProps) => {
  const {
    route,
    onClick,
    title,
    disabled,
    disabledReason,
    type,
    startContent,
  } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    route && navigate(route);
  };

  return (
    <Tooltip content={disabledReason} isDisabled={!disabled}>
      <Button
        color="primary"
        size="lg"
        disabled={disabled}
        type={type || "button"}
        onClick={handleClick}
        variant="shadow"
        radius="lg"
        startContent={startContent}
        className="mx-auto disabled:cursor-not-allowed disabled:opacity-20"
      >
        {title}
      </Button>
    </Tooltip>
  );
};
