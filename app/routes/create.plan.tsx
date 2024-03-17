import { Tab, Tabs } from "@nextui-org/react";
import { Container } from "~/components/Container";
import { LilHeader } from "~/components/LilHeader";
import { useProjectStore } from "~/store/store";

export default function CreatePlan() {
  const store = useProjectStore((store) => store.draft);

  return (
    <Container>
      <LilHeader>Interval</LilHeader>
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options" color="primary" size="lg">
          <Tab key="daily" title="Daglig" />
          <Tab key="weekly" title="Ugenlig" />
        </Tabs>
      </div>
    </Container>
  );
}
