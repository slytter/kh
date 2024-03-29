import { Project, useProjectStore } from "~/store/store";
import { LilHeader } from "~/components/LilHeader";
import { BottomNav } from "../components/BottomNav";
import { Form, useOutletContext } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { DragAndDropPhotos } from "~/components/DragAndDropPhotos";
import { useState } from "react";
import { OutletContext } from "~/types";
import dayjs from "dayjs";
import { Send } from "lucide-react";
import {
  PhotoArraySchema,
  PhotoSchema,
  ProjectSchema,
} from "~/types/validations";

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

    const {
      data: partialProject,
      error,
      status,
    } = await supabase
      .from("projects")
      .insert({
        name: project.name,
        owner: project.owner,
        generation_props: project.generationProps,
        receivers: project.receivers,
        self_receive: project.selfReceive,
      })
      .select("id")
      .single();

    console.log({ partialProject, status });
    if (!partialProject) {
      throw new Error("No project created");
    }

    photos = photos.map((photo) => {
      console.log(project.id);
      return {
        ...photo,
        project_id: partialProject.id,
      };
    });

    const { data: photoData, error: photoError } = await supabase
      .from("photos")
      .insert(photos);

    // const { error } = await

    if (error || photoError) {
      console.error(error || photoError);
      throw new Error(error || photoError);
    }

    return json(data);
  } catch (error) {
    // If there's a validation or Supabase error, handle it here
    // For example, sending a 400 Bad Request response:
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

type PostModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const PostModal = (props: PostModalProps) => {
  const { isOpen, onOpenChange } = props;

  const draftPhotos = useProjectStore((state) => state.draftPhotos);
  const draftProject = useProjectStore((state) => state.draftProject);
  const numPhotos = draftPhotos.length;
  const firstPhoto = draftPhotos[0];
  const lastPhoto = draftPhotos[numPhotos - 1];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
    >
      <ModalContent className="py-2">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Er vi klar?
            </ModalHeader>
            <ModalBody>
              <p className="text-default-500">
                Email{draftProject.receivers.length === 1 ? "" : "s"}{" "}
                <b>
                  {draftProject.receivers
                    .map((receiver) => receiver)
                    .join(", ")}{" "}
                </b>
                modtager i alt {numPhotos} fotos.
                <br />
                Ét foto{" "}
                <b>
                  hver{" "}
                  {draftProject.generationProps.interval === "weekly"
                    ? "uge"
                    : "dag"}
                </b>{" "}
                fra <b>den {dayjs(firstPhoto.send_at).format("D. MMM")}</b> til
                den <b>{dayjs(lastPhoto.send_at).format("D. MMM - YY")}.</b>
              </p>
            </ModalBody>
            <Form method="post">
              <ModalFooter>
                <input
                  type="hidden"
                  name="draft"
                  value={JSON.stringify(draftProject)}
                />
                <input
                  type="hidden"
                  name="photos"
                  value={JSON.stringify(draftPhotos)}
                />
                <Button variant="flat" onPress={onClose}>
                  Tilbage
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  variant="shadow"
                  type="submit"
                >
                  Jeg er klar 😍
                </Button>
              </ModalFooter>
            </Form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default function CreateOverview() {
  const photos = useProjectStore((state) => state.draftPhotos);
  const setDraftPhotos = useProjectStore((state) => state.setDraftPhotos);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const co = useOutletContext<OutletContext>();
  // const isAuthed = !!session?.user;

  const onClick = () => {
    if (true) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className={"flex flex-1 flex-shrink-0 flex-col"}>
        <LilHeader>Overblik</LilHeader>
        <p className={"mb-2 px-2 text-sm text-default-500"}>
          Her kan du se og sortere dine fotos
        </p>
        <DragAndDropPhotos photos={photos} setPhotos={setDraftPhotos} />
        <PostModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
      <BottomNav
        onClick={onClick}
        title={"Jeg tror vi er klar"}
        startContent={<Send size={18} />}
      />
    </>
  );
}
