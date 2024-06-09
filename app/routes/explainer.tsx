import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { useNavigate } from "@remix-run/react";
import {
  HandHeart,
  ImagePlus,
  ImageUpIcon,
  FileImage,
  PersonStandingIcon,
  CalendarIcon,
} from "lucide-react";
import { BottomNav } from "~/components/BottomNav";
import { Container } from "~/components/Container";

type CardProps = {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const ExplainerCard = (props: CardProps) => {
  const { title, description, icon, step } = props;

  return (
    <Card className="p-2 ">
      <CardHeader className="flex-col">{icon}</CardHeader>
      <CardBody className="items-center space-y-2">
        <p className="text-tiny uppercase font-bold text-center">{step}</p>
        <div className="relative w-full items-center flex flex-col">
          <h2 className="font-bold md:text-xl text-2xl neulis text-center">
            {title}
          </h2>
          <p className="font-medium text-small text-center max-w-fit">
            {description}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default function Explainer() {
  const navigate = useNavigate();

  return (
    <div className="">
      <Container>
        <div className="flex min-h-dvh flex-col pt-8 space-y-12 items-center">
          <div className="flex flex-col space-y-2 items-center">
            <h1 className="md:text-5xl text-3xl font-bold text-center mt-8 ">
              Sådan fungerer det
            </h1>
            <h2 className="text-sm text-center max-w-80 ">
              <span className="neulis">kh </span>er er en gaven der bliver ved
              med at give. <br /> Vi sender automatisk billeder til din
              nærmeste, så de hele tiden har et nyt billede at glæde sig over.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <ExplainerCard
              step="step 1"
              icon={<ImagePlus size={40} />}
              title="Udvælg billeder"
              description="Find en række billeder, som du gerne vil afsende til din modtager."
            />
            <ExplainerCard
              step="step 2"
              icon={<CalendarIcon size={40} />}
              title="Planlæg "
              description="Skal billederne sendes dagligt eller ugentligt? Du bestemmer!"
            />
            <ExplainerCard
              step="step 3"
              description="Vælg en modtager, som skal modtage billederne."
              icon={<HandHeart size={40} />}
              title="Vælg modtager"
            />
          </div>
          <div className="flex items-center flex-col">
            <h2 className="font-bold md:text-xl text-2xl neulis text-center">
              Gaven er klar!
            </h2>
            <p className="font-medium text-small text-balance text-center max-w-80">
              Din modtager vil nu modtage et billede hver dag eller uge, som du
              har valgt.
            </p>
          </div>
        </div>
        <BottomNav
          // onClick={}
          disabledReason="Vælg en start dato"
          startContent={<ImagePlus />}
          route="/create/upload"
          title={"Udvælg billeder"}
        />
      </Container>
    </div>
  );
}
