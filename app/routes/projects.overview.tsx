import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Skeleton,
	useDisclosure,
} from '@nextui-org/react'
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	defer,
	json,
	redirect,
} from '@remix-run/node'
import {
	Await,
	Outlet,
	useActionData,
	useLoaderData,
	useNavigate,
	useNavigation,
	useOutlet,
	useSubmit,
} from '@remix-run/react'
import { Suspense, useEffect, useState } from 'react'
import { ProjectCard } from '~/components/ProjectCard'
import { deleteProject } from '~/controllers/deleteProject'
import { getPhotosByProjectId } from '~/controllers/getPhtotosByProjectId'
import { getProjectsFromOwner } from '~/controllers/getProjectsFromOwner'
import { getProjectsToReciever } from '~/controllers/getProjectsToReciever'
import { createSupabaseServerClient } from '~/utils/supabase.server'

// should be authed
// otherwise, should be redirected to login page
// fetch projects from server
export async function loader({ request }: LoaderFunctionArgs) {
	const response = new Response()
	const supabase = createSupabaseServerClient({ request, response })
	const { data } = await supabase.auth.getUser()

	if (!data.user) {
		return redirect('/login')
	}

	try {
		const sendingProjects = await getProjectsFromOwner(supabase, data.user.id)
		const recievingProjects = await getProjectsToReciever(
			supabase,
			data.user.email || '',
		)

		console.log({ recievingProjects })

		const photoPromises = sendingProjects.map((project) =>
			getPhotosByProjectId(supabase, project.id),
		)
		const receivedPhotosPromises = recievingProjects.map((project) =>
			getPhotosByProjectId(supabase, project.id),
		)

		const photos = Promise.all(photoPromises)
		const receivedPhotos = Promise.all(receivedPhotosPromises)

		return defer({
			projects: sendingProjects,
			recievingProjects,
			photos,
			receivedPhotos,
			type: 'success',
			message: 'Projects fetched successfully',
		})
	} catch (error) {
		console.error(error)
		return defer(
			{
				projects: null,
				recievingProjects: [],
				photos: [],
				receivedPhotosPromises: [],
				type: 'error',
				message: 'Failed to fetch projects',
			},
			{ status: 500 },
		)
	}
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const response = new Response()
	const supabase = createSupabaseServerClient({ request, response })

	const uid = (await supabase.auth.getUser()).data.user?.id

	const formData = await request.formData()
	// check if input name delete
	if (formData.get('type') === 'delete') {
		try {
			if (!uid) throw new Error('User not authenticated')

			const projectId = formData.get('projectId')
			await deleteProject(supabase, Number(projectId), uid)
			return json({
				type: 'success',
				message: 'Project deleted successfully',
			})
		} catch (error) {
			console.error(error)
			return json(
				{ type: 'error', message: 'Failed to delete project' },
				{ status: 500 },
			)
		}
	}
}

// this
export default function Overview() {
	const { projects, photos, recievingProjects, receivedPhotos } =
		useLoaderData<typeof loader>()
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const [projectToDelete, setProjectToDelete] = useState<number | null>(null)

	const submit = useSubmit()
	const actionData = useActionData<typeof action>()
	const navigation = useNavigation()
	const outlet = useOutlet()
	const navigate = useNavigate()

	const openDeleteModal = (projectId: number) => {
		setProjectToDelete(projectId)
		onOpen()
	}

	const closeDeleteModal = () => {
		setProjectToDelete(null)
		onOpenChange()
	}

	const deleteProject = () => {
		console.log('delete project', projectToDelete)
		submit({ type: 'delete', projectId: projectToDelete }, { method: 'post' })
	}

	const navigateToEdit = (projectId: number) => {
		navigate(`/projects/edit/${projectId}`)
	}

	useEffect(() => {
		if (actionData?.type === 'success') {
			closeDeleteModal()
			// resetDraftProject();
		}

		if (actionData?.type === 'error') {
			// todo better error handling
			alert(
				'Der skete en fejl. Prøv igen senere.' +
					JSON.stringify(actionData.message),
			)
		}
	}, [actionData])

	const isSubmitting =
		navigation.state === 'submitting' || navigation.state === 'loading'

	return (
		<>
			<div className="space-y-2">
				<ul className="flex flex-shrink-0 flex-col gap-4">
					{projects?.map((project, i) => (
						<Suspense
							key={project.id}
							fallback={<Skeleton className="w-full h-[140px] rounded-lg" />}
						>
							<Await resolve={photos}>
								{(photos) => (
									<ProjectCard
										type="sending"
										key={project.id}
										onEdit={() => project.id && navigateToEdit(project.id)}
										onDelete={(id) => {
											openDeleteModal(id)
										}}
										project={{ ...project, name: `Projekt ${i + 1}` }}
										photos={photos[i]}
									/>
								)}
							</Await>
						</Suspense>
					))}
				</ul>

				<h2 className="text-lg font-bold">Projekter jeg modtager</h2>
				{recievingProjects?.map((project, i) => (
					<Suspense
						fallback={<Skeleton className="w-full h-[140px] rounded-lg" />}
						key={project.id}
					>
						<Await resolve={receivedPhotos}>
							{(receivedPhotos) => (
								<ProjectCard
									hideUnsent={true}
									type="receiving"
									key={project.id}
									onEdit={() => project.id && navigateToEdit(project.id)}
									onDelete={(id) => {
										openDeleteModal(id)
									}}
									project={{ ...project, name: `Projekt ${i + 1}` }}
									photos={receivedPhotos[i]}
								/>
							)}
						</Await>
					</Suspense>
				))}
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
			<Modal
				isOpen={!!outlet}
				onOpenChange={() => navigate('/projects/overview')}
			>
				<ModalContent>
					<Outlet />
				</ModalContent>
			</Modal>
		</>
	)
}
