import {
	ActionFunctionArgs,
	defer,
	json,
	LoaderFunctionArgs,
} from '@remix-run/node'
import { getProjectById } from '~/controllers/getProjectById'
import { createSupabaseServerClient } from '~/utils/supabase.server'
import { z } from 'zod'
import { Await, useLoaderData, useFetcher, useMatches } from '@remix-run/react'
import { getPhotosByProjectId } from '~/controllers/getPhtotosByProjectId'
import { Suspense, useState, useEffect } from 'react'
import { Photo } from '~/store/store'
import { Image } from '~/components/shared/Image'
import JSZip from 'jszip'
import { Button, Tooltip } from '@nextui-org/react'
import dayjs from 'dayjs'
import { DownloadIcon, Lock } from 'lucide-react'
import _ from 'lodash'
import { LoginModal } from '~/components/auth/LoginModal'

export async function loader({ request, params }: LoaderFunctionArgs) {
	const validatedParams = z
		.object({
			projectId: z.string(),
		})
		.parse(params)

	const response = new Response()
	const supabase = createSupabaseServerClient({ request, response })
	const projectId = validatedParams.projectId

	// Check if user is authenticated
	const {
		data: { user },
	} = await supabase.auth.getUser()
	const isAuthenticated = !!user

	try {
		const project = await getProjectById(supabase, Number(projectId))
		// const senderPromise = getUser(supabase, project.owner)
		const photosPromise = getPhotosByProjectId(supabase, Number(projectId))
		return defer({
			project,
			photos: photosPromise,
			// sender: senderPromise,
		})
	} catch (error) {
		// Check if it's an "Unauthorized" error from getProjectById
		const errorMessage = error instanceof Error ? error.message : String(error)
		const isUnauthorized = errorMessage === 'Unauthorized'

		// Return specific error type based on authentication status
		if (isUnauthorized) {
			if (!isAuthenticated) {
				return json(
					{
						error:
							'Du skal være logget ind eller oprettet som bruger for at se denne side',
						requiresAuth: true,
						isAuthenticated: false,
					},
					{ status: 401 },
				)
			} else {
				return json(
					{
						error: 'Du har ikke adgang til dette projekt',
						requiresAuth: false,
						isAuthenticated: true,
					},
					{ status: 403 },
				)
			}
		}

		// For other errors (e.g., project not found, database errors)
		// If user is not authenticated, show auth message
		// Otherwise show the actual error
		if (!isAuthenticated) {
			return json(
				{
					error:
						'Du skal være logget ind eller oprettet som bruger for at se denne side',
					requiresAuth: true,
					isAuthenticated: false,
				},
				{ status: 401 },
			)
		}

		// For authenticated users with other errors, show generic error
		return json(
			{
				error: 'Projektet kunne ikke findes eller der opstod en fejl',
				requiresAuth: false,
				isAuthenticated: true,
			},
			{ status: 404 },
		)
	}
}

export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData()
	const intent = formData.get('intent')

	if (intent === 'download') {
		try {
			const validatedParams = z
				.object({
					projectId: z.string(),
				})
				.parse(params)

			const supabase = createSupabaseServerClient({
				request,
				response: new Response(),
			})

			const photos = await getPhotosByProjectId(
				supabase,
				Number(validatedParams.projectId),
			)

			const zip = new JSZip()

			// Download each photo and add to zip
			const photoPromises = photos.map(async (photo: Photo) => {
				try {
					const response = await fetch(photo.url)
					if (!response.ok) {
						throw new Error(
							`Failed to fetch ${photo.url}: ${response.statusText}`,
						)
					}
					const blob = await response.blob()
					const arrayBuffer = await blob.arrayBuffer()
					zip.file(`photo-${photo.id}.jpg`, arrayBuffer)
					console.log('zipping photo', photo.id)
				} catch (error) {
					if (error instanceof Error) {
						console.error(`Failed to process photo ${photo.id}:`, error)
						zip.file(
							`photo-${photo.id}-error.txt`,
							`Failed to download photo: ${error.message}`,
						)
					} else {
						console.error(`Failed to process photo ${photo.id}:`, error)
					}
				}
			})

			// Wait for all photos to be processed
			await Promise.all(photoPromises)

			// Generate zip file as a buffer
			const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

			// Convert buffer to base64
			const base64Data = `data:application/zip;base64,${zipBuffer.toString('base64')}`

			return json({
				downloadUrl: base64Data,
				filename: `project-${validatedParams.projectId}-photos.zip`,
			})
		} catch (error) {
			console.error('Download failed:', error)
			return json(
				{ error: 'Failed to create download. Please try again.' },
				{ status: 500 },
			)
		}
	}

	return json({ message: '' }, { status: 200 })
}

const HiddenImageOverlay = (props: {
	children: React.ReactNode
	unlockDate?: number
}) => {
	const { children, unlockDate } = props

	const isLocked = unlockDate && unlockDate > new Date().getTime()

	return (
		<div className="overflow-hidden rounded-md relative max-w-screen-sm shadow-md">
			{isLocked && (
				<div className="absolute inset-0 backdrop-blur-2xl bg-black/30 flex items-center justify-center flex-col gap-2">
					<Lock size={40} color="white" />
					<p className="text-center text-sm text-white">
						Sendes den {dayjs(unlockDate).format('D. MMM YY')}
					</p>
				</div>
			)}
			{children}
		</div>
	)
}

export default function SeeProject() {
	const data = useLoaderData<typeof loader>()
	const fetcher = useFetcher()
	const matches = useMatches()
	const rootData = matches.find((match) => match.id === 'root')?.data as
		| { session?: { user?: { id: string } } }
		| undefined
	const session = rootData?.session
	const isDownloading = fetcher.state === 'submitting'

	// Auto-open login modal if auth is required
	const [showLoginModal, setShowLoginModal] = useState(false)

	useEffect(() => {
		if ('error' in data && data.requiresAuth && !data.isAuthenticated) {
			setShowLoginModal(true)
		}
	}, [data])

	// Close modal when user successfully logs in (revalidation happens automatically in root.tsx)
	useEffect(() => {
		if (session?.user && showLoginModal) {
			setShowLoginModal(false)
		}
	}, [session?.user, showLoginModal])

	// Handle the download when data is received
	useEffect(() => {
		const data = fetcher.data as
			| { downloadUrl?: string; filename?: string }
			| undefined
		if (data?.downloadUrl && data?.filename) {
			const link = document.createElement('a')
			link.href = data.downloadUrl
			link.download = data.filename
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	}, [fetcher.data])

	if ('error' in data) {
		// If user is logged in but doesn't have access, show error message
		if (data.isAuthenticated && !data.requiresAuth) {
			return (
				<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
					<p className="text-lg text-gray-700 text-center px-4">{data.error}</p>
					<Button
						onClick={() => window.history.back()}
						color="default"
						variant="flat"
					>
						Tilbage
					</Button>
				</div>
			)
		}

		// If user needs to authenticate, show modal with error message
		return (
			<>
				{data.requiresAuth && !data.isAuthenticated && (
					<LoginModal
						isOpen={showLoginModal}
						onOpenChange={setShowLoginModal}
						isDismissable={false}
						message={data.error}
					/>
				)}
			</>
		)
	}

	const { project, photos } = data

	return (
		<>
			<h1 className="text-2xl font-bold">{project.name}</h1>

			<Suspense fallback={<p>Loading photos...</p>}>
				<h2 className="text-md mb-4 text-gray-600">
					{/* <Await resolve={sender}>{(sender) => <>{sender.email}</>}</Await> */}
					Til {project.receivers.join(', ')}
				</h2>
				<Await resolve={photos}>
					{(photos) => {
						const isAllSent = photos.every((photo) => photo.did_send)
						return (
							<div className="flex flex-col gap-4">
								{_.orderBy(photos, ['send_at'], ['asc']).map((photo, i) => (
									<div
										className="w-full mt-4 gap-2 flex flex-col items-center"
										key={photo.id}
									>
										<h3 className="flex items-center gap-2 text-md text-gray-600">
											<span className="font-bold">FOTO {i + 1}</span>
											<span className="bg-gray-200 px-2 rounded-md text-xs">
												{photo.did_send ? 'Sendt ' : 'Sendes '}
												<span className="font-bold">
													{dayjs(photo.send_at).format('D. MMM YY')}
												</span>
											</span>
										</h3>
										<HiddenImageOverlay unlockDate={photo.send_at}>
											<Image
												className={'w-full object-cover h-full'}
												src={photo.url}
												size="lg"
												alt={photo.id}
											/>
										</HiddenImageOverlay>
									</div>
								))}
								<div>
									<fetcher.Form
										method="post"
										className=" p-4 fixed bottom-0 right-0 left-0 items-center flex justify-center bg-gradient-to-t from-white to-transparent z-10"
									>
										<Tooltip
											content={
												isAllSent
													? 'Hent alle fotos'
													: 'Alle fotos skal være sendt før du kan hente dem'
											}
											isDisabled={!isAllSent}
										>
											<Button
												color="primary"
												className="disabled:cursor-not-allowed disabled:opacity-80"
												aria-label="Download"
												type="submit"
												name="intent"
												value="download"
												disabled={!isAllSent}
												startContent={<DownloadIcon />}
												isLoading={isDownloading}
											>
												{isDownloading ? 'Henter' : 'Download alle fotos '}
											</Button>
										</Tooltip>
									</fetcher.Form>
								</div>
							</div>
						)
					}}
				</Await>
			</Suspense>
		</>
	)
}
