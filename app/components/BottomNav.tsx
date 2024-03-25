import { NavBotton } from "./Button";

type BottomNavProps = {
  route: string;
  title: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
};

export const BottomNav = (props: BottomNavProps) => {
  const { disabled, route, title, onClick, type } = props;

  return (
    <div className="sticky bottom-0 flex w-full p-8">
      <NavBotton
        disabled={disabled}
        route={route}
        title={title}
        type={type}
        onClick={onClick}
      />
      {/* add gradiant */}
    </div>
  );
};
