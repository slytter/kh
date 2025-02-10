import {
	ActionFunctionArgs,
	defer,
	json,
	LoaderFunctionArgs,
} from '@remix-run/node'
import { getProjectById } from '~/controllers/getProjectById'
import { createSupabaseServerClient } from '~/utils/supabase.server'
import { z } from 'zod'
import { Await, useLoaderData, useFetcher } from '@remix-run/react'
import { getPhotosByProjectId } from '~/controllers/getPhtotosByProjectId'
import { Suspense } from 'react'
import { Photo } from '~/store/store'
import { Image } from '~/components/shared/Image'
import JSZip from 'jszip'
import { Button } from '@nextui-org/react'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { DownloadIcon, Lock } from 'lucide-react'

export async function loader({ request, params }: LoaderFunctionArgs) {
	const validatedParams = z
		.object({
			projectId: z.string(),
		})
		.parse(params)

	const response = new Response()
	const supabase = createSupabaseServerClient({ request, response })
	const projectId = validatedParams.projectId
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
		const e = error instanceof Error ? error.message : 'Unknown error'
		return json({ error: e }, { status: 401 })
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
		<div className="overflow-hidden rounded-md relative max-w-screen-sm">
			{isLocked && (
				<div className="absolute inset-0 backdrop-blur-lg bg-black/30 flex items-center justify-center flex-col">
					<Lock size={40} color="white" />
					<p className="text-center text-sm text-white"></p>
				</div>
			)}
			{children}
		</div>
	)
}

export default function SeeProject() {
	const data = useLoaderData<typeof loader>()
	const fetcher = useFetcher()
	const isDownloading = fetcher.state === 'submitting'
	// Handle the download when data is received
	useEffect(() => {
		if (fetcher.data?.downloadUrl) {
			const link = document.createElement('a')
			link.href = fetcher.data.downloadUrl
			link.download = fetcher.data.filename
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	}, [fetcher.data])

	if ('error' in data) {
		return <div>Error: {data.error}</div>
	}

	const { project, photos } = data

	return (
		<>
			<h1 className="text-2xl font-bold">{project.name}</h1>
			<div>
				<fetcher.Form
					method="post"
					className=" p-4 fixed bottom-0 right-0 left-0 items-center flex justify-center bg-gradient-to-t from-white to-transparent z-10"
				>
					<Button
						color="primary"
						aria-label="Indstillinger"
						title=""
						type="submit"
						name="intent"
						value="download"
						startContent={<DownloadIcon />}
						isLoading={isDownloading}
					>
						{isDownloading ? 'Henter' : 'Download alle fotos '}
					</Button>
				</fetcher.Form>
			</div>
			<Suspense fallback={<p>Loading photos...</p>}>
				<h2 className="text-md mb-4 text-gray-600">
					{/* <Await resolve={sender}>{(sender) => <>{sender.email}</>}</Await> */}
					Til {project.receivers.join(', ')}
				</h2>
				<Await resolve={photos}>
					{(photos) => (
						<div className="flex flex-col gap-4">
							{photos.map((photo, i) => (
								<div
									className="w-full mt-4 gap-2 flex flex-col items-center"
									key={photo.id}
								>
									<h3 className="flex items-center gap-2 text-md text-gray-600">
										<span className="font-bold">FOTO {i + 1}</span>
										<span className="bg-gray-200 px-2 rounded-md text-xs">
											{photo.did_send ? 'Sendt ' : 'Sendes '}
											{dayjs(photo.send_at).format('DD. MMM YY')}
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
						</div>
					)}
				</Await>
			</Suspense>
		</>
	)
}
