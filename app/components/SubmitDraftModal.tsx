import { useProjectStore } from "~/store/store";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
  useOutletContext,
} from "@remix-run/react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect } from "react";
import { OutletContext } from "~/types";
import { Login } from "~/components/auth/Login";
import { ProjectDescription } from "~/components/ProjectDescription";
import { action } from "../routes/create.overview";

export type PostModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SubmitDraftModal = (props: PostModalProps) => {
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
      resetDraftProject();
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
