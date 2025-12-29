import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { Login } from "./Login";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const LoginModal = (props: Props) => {
  const { isOpen, onOpenChange } = props;

  return (
    <Modal
      backdrop={"blur"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={true}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        <ModalBody className="w-full">
          <Login />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
