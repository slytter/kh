type LilHeaderProps = {
  children: string;
};

export const LilHeader = (props: LilHeaderProps) => {
  return (
    <h3 className="mb-1 ml-2 text-sm font-medium uppercase opacity-90">
      {props.children}
    </h3>
  );
};
