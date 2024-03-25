import React, { useEffect, useState } from "react";
import { memo } from "react";
import { useProjectStore } from "../store/store";
import Flicking, { MoveEvent } from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { HorizontalPhotoOverview } from "./HorizontalPhotoOverview";

const handleDragStart = (e) => e.preventDefault();

type Props = {
  initialIndex: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const PhotoSlider = (props: Props) => {
  const { initialIndex, isOpen, onOpenChange } = props;

  const [chosenIndex, setChosenIndex] = useState(initialIndex);
  const photos = useProjectStore((state) => state.draft.photos);
  const flicking = React.useRef<Flicking>(null);

  return (
    <Modal
      backdrop={"blur"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={true}
      isKeyboardDismissDisabled={true}
      size="4xl"
      placement="center"
    >
      <ModalContent>
        <ModalBody className="p-0 pt-10">
          <Flicking
            ref={flicking}
            cameraClass="flicking-camera"
            initialIndex={initialIndex}
            align="center"
            circular={false}
            deceleration={0.0075}
            onChanged={(e) => {
              setChosenIndex(e.index);
              console.log(e);
            }}
          >
            {photos.map((photo, index) => (
              <div
                className="panel border-r-20 w-full overflow-hidden"
                key={photo.id}
                style={{
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  className="panel inher border-r-20 w-full object-contain outline-1"
                  style={{ height: "inherit" }}
                  src={photo.url}
                  alt={"Photo " + index}
                  onDragStart={handleDragStart}
                />
              </div>
            ))}
          </Flicking>
          <div className="p-2">
            <HorizontalPhotoOverview
              photos={photos}
              height={56}
              chosenIndex={chosenIndex}
              onPhotoPress={(_, index) => {
                flicking.current?.moveTo(index);
                setChosenIndex(index);
              }}
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
