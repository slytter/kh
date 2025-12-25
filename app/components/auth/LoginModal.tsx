import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { Login } from "./Login";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isDismissable?: boolean;
  message?: string;
};

export const LoginModal = (props: Props) => {
  const { isOpen, onOpenChange, isDismissable = true, message } = props;

  return (
    <Modal
      backdrop={"blur"}
      isOpen={isOpen}
      onOpenChange={isDismissable ? onOpenChange : undefined}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={true}
      hideCloseButton={!isDismissable}
    >
      <ModalContent>
        <ModalBody className="w-full">
          <Login message={message} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
