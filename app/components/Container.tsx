import { ScrollShadow } from "@nextui-org/react";
import { Header } from "./Header";

type ContainerProps = {
  children: React.ReactNode;
};

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="container mx-auto flex min-h-dvh flex-col md:w-[800px]">
      <Header />
      <div className="flex flex-1 flex-col px-6">{children}</div>
    </div>
  );
};
