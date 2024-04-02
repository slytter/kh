import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
} from "@nextui-org/react";
import { Photo, Project } from "~/store/store";
import { ProjectDescription } from "./ProjectDescription";
import dayjs from "dayjs";
import { HorizontalPhotoOverview } from "./HorizontalPhotoOverview";
import { useState } from "react";
import {
  ArrowRight,
  CameraIcon,
  LucideSettings,
  Settings2,
  SettingsIcon,
  Trash,
} from "lucide-react";
import { TrashIcon } from "@radix-ui/react-icons";
import { Form } from "@remix-run/react";

type Props = {
  project: Project;
  photos: Photo[];
  onDelete: (projectId: number) => void;
  onEdit: () => void;
};

export const ProjectCard = (props: Props) => {
  const { project, photos, onDelete, onEdit } = props;

  const [hover, setHover] = useState(false);

  return (
    <Card className="">
      <CardHeader className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-md">{project.name}</p>
          <p className="text-small text-default-500">
            Oprettet den {dayjs(project.created_at).format("DD. MMM")}
          </p>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="bordered" aria-label="Indstillinger">
              <SettingsIcon size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onClick={() => onEdit(props.project.id)}>
              <button type="submit">Rediger projekt</button>
            </DropdownItem>
            <DropdownItem
              color={"danger"}
              className={"text-danger"}
              onClick={() => onDelete(props.project.id)}
            >
              <button type="submit">Slet projekt</button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <Divider />
      <CardBody aria-label="Dynamic Actions">
        <button
          onMouseOver={() => setHover(true)}
          onMouseOut={() => setHover(false)}
        >
          <HorizontalPhotoOverview photos={photos} height={hover ? 100 : 60} />
        </button>
      </CardBody>
      <Divider />
      <CardFooter className="justify-between">
        {project && (
          <>
            <p className="text-sm">Modtager: {project.receivers}</p>
          </>
        )}
        <Button
          size="sm"
          variant="solid"
          // color="secondary"
          onClick={() => props.onEdit()}
          endContent={<ArrowRight size={16} />}
        >
          Rediger
        </Button>
      </CardFooter>
    </Card>
  );
};
