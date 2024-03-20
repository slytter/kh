import { NavBotton } from "./Button";

type BottomNavProps = {
  route: string;
  title: string;
  disabled?: boolean;
};

export const BottomNav = (props: BottomNavProps) => {
  const { disabled, route, title } = props;

  return (
    <div className="sticky bottom-0 flex w-full p-8">
      <NavBotton disabled={disabled} route={route} title={title} />
      {/* add gradiant */}
    </div>
  );
};
