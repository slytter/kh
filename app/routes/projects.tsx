import { Button, Spinner } from "@nextui-org/react";
import { Outlet, useNavigate } from "@remix-run/react";
import { Plus } from "lucide-react";
import { Container } from "~/components/Container";
import { LilHeader } from "~/components/LilHeader";
import { useNavigation } from "@remix-run/react";


const PageTopSection = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex flex-row items-center justify-between space-x-4">
      <LilHeader>kærlige hilsner</LilHeader>
      {/* <h1 className="text-lg ">Dine kærlige hilsner</h1> */}
      <Button
        color="primary"
        className="font-semibold"
        variant="shadow"
        onPress={() => navigate("/create/upload")}
        startContent={<Plus />}
      >
        Ny hilsen
      </Button>
    </div>
  );
};



export default function Projects() {
  return (
    <Container>
      <PageTopSection />
      <Outlet />
    </Container>
  );
}