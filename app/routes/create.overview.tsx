import { useProjectStore } from "~/store/store";
import { LilHeader } from "~/components/LilHeader";
import { BottomNav } from "../components/BottomNav";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { DragAndDropPhotos } from "~/components/DragAndDropPhotos";
import { useState } from "react";
import { Send } from "lucide-react";
import { PhotoArraySchema, ProjectSchema } from "~/types/validations";
import { insertProjectAndPhotos } from "~/controllers/insertProject";
import { SubmitDraftModal } from "../components/SubmitDraftModal";
import { Button } from "@nextui-org/react";
import { ShuffleIcon } from "@radix-ui/react-icons";

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const formData = await request.formData();
  const projectData = Object.fromEntries(formData); // Convert formData to a regular object

  try {
    const draftAsJSON = JSON.parse(projectData.draft.toString());
    const photosAsJSON = JSON.parse(projectData.photos.toString());

    const project = ProjectSchema.parse(draftAsJSON);
    let photos = PhotoArraySchema.parse(photosAsJSON);

    await insertProjectAndPhotos(supabase, project, photos);

    return json(
      {
        type: "success",
        error: null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    // If there's a validation or Supabase error, handle it here
    // For example, sending a 400 Bad Request response:
    return json({ type: "error", error }, { status: 400 });
  }
};

export default function CreateOverview() {
  const photos = useProjectStore((state) => state.draftPhotos);
  const setDraftPhotos = useProjectStore((state) => state.setDraftPhotos);
  const randomizePhotos = useProjectStore(
    (state) => state.randomizeDraftPhotos,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClick = () => {
    if (true) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className={"flex flex-1 flex-shrink-0 flex-col"}>
        <div className="flex flex-row justify-between">
          <div>
            <LilHeader>Overblik</LilHeader>
            <p className={"mb-2 px-2 text-sm text-default-500"}>
              Her kan du se og sortere dine fotos
            </p>
          </div>
          <Button
            color="default"
            size="sm"
            onClick={randomizePhotos}
            variant="flat"
            radius="sm"
            startContent={<ShuffleIcon />}
            className="flex"
          >
            Bland fotos
          </Button>
        </div>
        <DragAndDropPhotos photos={photos} setPhotos={setDraftPhotos} />
        <SubmitDraftModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
      <BottomNav
        onClick={onClick}
        title={"Jeg tror vi er klar"}
        startContent={<Send size={18} />}
      />
    </>
  );
}
