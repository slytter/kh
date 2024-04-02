import { useProjectStore } from "~/store/store";
import { LilHeader } from "~/components/LilHeader";
import { BottomNav } from "../components/BottomNav";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
  useOutletContext,
} from "@remix-run/react";
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
import { useEffect, useState } from "react";
import { OutletContext } from "~/types";
import { Send } from "lucide-react";
import { PhotoArraySchema, ProjectSchema } from "~/types/validations";
import { insertProjectAndPhotos } from "~/controllers/insertProject";
import { Login } from "~/components/auth/Login";
import { ProjectDescription } from "~/components/ProjectDescription";

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

type PostModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const PostDraftModal = (props: PostModalProps) => {
  const { isOpen, onOpenChange } = props;

  const draftPhotos = useProjectStore((state) => state.draftPhotos);
  const draftProject = useProjectStore((state) => state.draftProject);
  const resetDraftProject = useProjectStore((state) => state.resetDraftProject);
  const { session } = useOutletContext<OutletContext>();
  const isAuthed = !!session?.access_token;
  const navigate = useNavigate();

  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  useEffect(() => {
    if (actionData?.type === "success") {
      // onOpenChange(false);
      // resetDraftProject();
      navigate("/projects");
    }
    if (actionData?.error) {
      // todo better error handling
      alert(
        "Der skete en fejl. Prøv igen senere." +
          JSON.stringify(actionData.error),
      );
    }
  }, [actionData]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
    >
      <ModalContent className="py-2">
        {(onClose) =>
          !isAuthed ? (
            <ModalBody>
              <Login defaultSignState="signup" />
            </ModalBody>
          ) : (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Er vi klar?
              </ModalHeader>
              <ModalBody>
                <ProjectDescription
                  photos={draftPhotos}
                  project={draftProject}
                />
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
                    variant="shadow"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Jeg er klar 😍
                  </Button>
                </ModalFooter>
              </Form>
            </>
          )
        }
      </ModalContent>
    </Modal>
  );
};

export default function CreateOverview() {
  const photos = useProjectStore((state) => state.draftPhotos);
  const setDraftPhotos = useProjectStore((state) => state.setDraftPhotos);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <PostDraftModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
      <BottomNav
        onClick={onClick}
        title={"Jeg tror vi er klar"}
        startContent={<Send size={18} />}
      />
    </>
  );
}
