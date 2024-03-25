import { useProjectStore } from "~/store/store";
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

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const { message } = Object.fromEntries(await request.formData());

  await supabase.from("messages").insert({ content: String(message) });

  return json(null, { headers: response.headers });
};

type PostModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const PostModal = (props: PostModalProps) => {
  const { isOpen, onOpenChange } = props;

  const draft = useProjectStore((state) => state.draft);
  const numPhotos = draft.photos.length;
  const firstPhoto = draft.photos[0];
  const lastPhoto = draft.photos[numPhotos - 1];
  const { generationProps } = draft;

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
                Email{draft.receivers.length === 1 ? "" : "s"}{" "}
                <b>{draft.receivers.map((receiver) => receiver).join(", ")} </b>
                modtager i alt {numPhotos} fotos.
                <br />
                Ét foto{" "}
                <b>
                  hver {generationProps.interval === "weekly" ? "uge" : "dag"}
                </b>{" "}
                fra <b>den {dayjs(firstPhoto.send_at).format("D. MMM")}</b> til
                den <b>{dayjs(lastPhoto.send_at).format("D. MMM - YY")}.</b>
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Tilbage
              </Button>
              <Button color="primary" onPress={onClose} variant="shadow">
                Jeg er klar 😍
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default function CreateOverview() {
  const photos = useProjectStore((state) => state.draft.photos);
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
        <p className={"text-default-500 mb-2 px-2 text-sm"}>
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
