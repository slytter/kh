import { PersonIcon } from "@radix-ui/react-icons";

export const Header = () => {
  return (
    <div className="flex flex-row items-center justify-between p-4">
      <h1 className="text-3xl font-bold">kh</h1>
      <PersonIcon className="align-middle" />
    </div>
  );
};
