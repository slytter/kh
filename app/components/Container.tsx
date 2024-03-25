import { Header } from "./Header";

type ContainerProps = {
  children: React.ReactNode;
};

export const Container = ({ children }: ContainerProps) => {
  return (
    <>
      <div className=" flex min-h-dvh flex-col ">
        <Header />
        <div className="container mx-auto flex flex-1 flex-col px-6 md:w-[800px]">
          {children}
        </div>
      </div>
    </>
  );
};
