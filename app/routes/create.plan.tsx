import { Container } from "~/components/Container";
import { useProjectStore } from "~/store/store";

export default function CreatePlan() {
  const store = useProjectStore((store) => store.draft);

  return (
    <Container>
      <h1>Create Plan</h1>
      <p>{JSON.stringify(store.owner)}</p>
    </Container>
  );
}
