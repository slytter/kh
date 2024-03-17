type LilHeaderProps = {
  children: string;
};

export const LilHeader = (props: LilHeaderProps) => {
  return <h3 className="mb-2 text-sm uppercase">{props.children}</h3>;
};
