import { NavBotton } from "./Button";

type BottomNavProps = {
  route?: string;
  title: string;
  disabled?: boolean;
  onClick?: () => void;
  startContent?: React.ReactNode;
  type?: "button" | "submit";
};

export const BottomNav = (props: BottomNavProps) => {
  const { disabled, route, title, onClick, type, startContent } = props;

  return (
    <div className="sticky bottom-0 flex w-full p-8">
      <NavBotton
        startContent={startContent}
        disabled={disabled}
        route={route}
        title={title}
        type={type}
        onClick={onClick}
      />
      {/* add gradiant */}
      <div className="absolute bottom-0 h-8 w-full bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};
