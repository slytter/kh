import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "~/components/Container";
import { LilHeader } from "~/components/LilHeader";
import { ProjectCard } from "~/components/ProjectCard";
import { deleteProject } from "~/controllers/deleteProject";
import { getPhotosByProjectId } from "~/controllers/getPhtotosByProjectId";
import { getProjectsFromOwner } from "~/controllers/getProjectsFromOwner";
import { createSupabaseServerClient } from "~/utils/supabase.server";

// should be authed
// otherwise, should be redirected to login page
// fetch projects from server
export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return redirect("/login");
  }

  try {
    const projects = await getProjectsFromOwner(supabase, data.user.id);

    const photoPromises = projects.map((project) =>
      getPhotosByProjectId(supabase, project.id),
    );

    const photos = await Promise.all(photoPromises);

    return json({
      projects,
      photos,
      type: "success",
      message: "Projects fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return json(
      {
        projects: null,
        photos: [],
        type: "error",
        message: "Failed to fetch projects",
      },
      { status: 500 },
    );
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const formData = await request.formData();
  const projectData = Object.fromEntries(formData); // Convert formData to a regular object

  const uid = (await supabase.auth.getUser()).data.user?.id;

  // check if input name delete
  if (formData.get("type") === "delete") {
    try {
      if (!uid) throw new Error("User not authenticated");

      const projectId = formData.get("projectId");
      await deleteProject(supabase, Number(projectId), uid);
      return json({
        type: "success",
        message: "Project deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return json(
        { type: "error", message: "Failed to delete project" },
        { status: 500 },
      );
    }
  }
};

const PageTopSection = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex flex-row items-center justify-between space-x-4">
      <LilHeader>kærlige hilsner</LilHeader>
      {/* <h1 className="text-lg ">Dine kærlige hilsner</h1> */}
      <Button
        color="primary"
        className="font-semibold"
        variant="shadow"
        onPress={() => navigate("/create/upload")}
        startContent={<Plus />}
      >
        Ny hilsen
      </Button>
    </div>
  );
};

// this
export default function DashBoard() {
  const { projects, photos } = useLoaderData<typeof loader>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const navigate = useNavigate();

  const openDeleteModal = (projectId: number) => {
    setProjectToDelete(projectId);
    onOpen();
  };

  const closeDeleteModal = () => {
    setProjectToDelete(null);
    onOpenChange();
  };

  const deleteProject = () => {
    console.log("delete project", projectToDelete);
    submit({ type: "delete", projectId: projectToDelete }, { method: "post" });
  };

  const navigateToEdit = (projectId: number) => {
    navigate(`/edit/${projectId}`);
  };

  useEffect(() => {
    if (actionData?.type === "success") {
      closeDeleteModal();
      // resetDraftProject();
    }

    if (actionData?.type === "error") {
      // todo better error handling
      alert(
        "Der skete en fejl. Prøv igen senere." +
          JSON.stringify(actionData.message),
      );
    }
  }, [actionData]);

  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <Container>
      <PageTopSection />
      <div className="space-y-2">
        <ul className="flex flex-shrink-0 flex-col gap-4">
          {projects?.map((project, i) => (
            <ProjectCard
              onEdit={() => project.id && navigateToEdit(project.id)}
              onDelete={(id) => {
                openDeleteModal(id);
              }}
              project={{ ...project, name: `Projekt ${i + 1}` }}
              photos={photos[i]}
            />
          ))}
        </ul>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Slet projekt
              </ModalHeader>
              <ModalBody>
                <p>
                  Er du sikker på at du vil slette dette projekt? Denne handling
                  kan ikke fortrydes.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Tilbage
                </Button>
                <Button
                  color="danger"
                  onPress={() => deleteProject()}
                  isLoading={isSubmitting}
                >
                  Slet
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
}
