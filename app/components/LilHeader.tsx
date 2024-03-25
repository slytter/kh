import { ReactNode } from "react";

type LilHeaderProps = {
  children: ReactNode;
};

export const LilHeader = (props: LilHeaderProps) => {
  return (
    <h3 className="mb-1 ml-2 text-sm font-medium uppercase opacity-100">
      {props.children}
    </h3>
  );
};
