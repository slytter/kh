import { Header } from "./Header";

type ContainerProps = {
  children: React.ReactNode;
  transparentHeader?: boolean;
};

export const Container = ({ children, transparentHeader }: ContainerProps) => {
  return (
    <>
      <div className=" flex min-h-dvh flex-col ">
        <Header transparrent={transparentHeader} />
        <div className="container mx-auto flex flex-1 flex-col px-6 md:w-[800px]">
          {children}
        </div>
      </div>
    </>
  );
};
