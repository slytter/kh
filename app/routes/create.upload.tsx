import { useState } from 'react'
import { HorizontalPhotoOverview } from '~/components/HorizontalPhotoOverview'
import { LilHeader } from '~/components/LilHeader'
import { Photo, useProjectStore } from '~/store/store'
import { DragDropUpload } from '~/components/DragDropUpload'
import { Spinner } from '@nextui-org/react'
import { CalendarIcon, UploadCloudIcon } from 'lucide-react'
import { BottomNav } from '~/components/BottomNav'
import { PhotoSliderModal } from '~/components/PhotoSliderModal'

const photoFactory = (url: string) =>
	({
		id: url,
		url: url,
		did_send: false,
		message: '',
		created_at: Date.now(),
	}) as Photo

const uploadPhotos = async (
	files: File[],
	onProgress: (progress: number) => void,
): Promise<string[]> => {
	const concurrentUploads = 2
	const totalFiles = files.length
	let uploadedFiles = 0
	const allImageUrls: string[] = []

	for (let i = 0; i < totalFiles; i += concurrentUploads) {
		console.log(`Processing batch ${Math.floor(i / concurrentUploads) + 1}`)
		const uploadBatch = files.slice(i, i + concurrentUploads)
		const formData = new FormData()
		uploadBatch.forEach((file) => formData.append('img', file))

		let response: Response
		try {
			response = await fetch('/server/upload-photo', {
				method: 'POST',
				body: formData,
			})
		} catch (networkError) {
			// Network error (no internet, CORS, timeout, etc.)
			console.error('Network error during upload:', networkError)
			throw new Error(
				`Netværksfejl: ${networkError instanceof Error ? networkError.message : 'Kunne ikke forbinde til serveren'}`,
			)
		}

		// Read body as text first (can only read once)
		const responseText = await response.text().catch(() => '')

		if (!response.ok) {
			let errorMessage = `Upload fejlede (${response.status})`

			// Handle common infrastructure errors with user-friendly messages
			if (
				response.status === 503 ||
				responseText.includes('SERVICE_UNAVAILABLE')
			) {
				console.error('Service unavailable:', responseText)
				throw new Error(
					'Serveren er midlertidigt utilgængelig. Prøv igen om lidt.',
				)
			}

			if (response.status === 504 || responseText.includes('GATEWAY_TIMEOUT')) {
				console.error('Gateway timeout:', responseText)
				throw new Error(
					'Upload tog for lang tid. Prøv med færre billeder ad gangen.',
				)
			}

			// Try to parse as JSON
			if (responseText) {
				try {
					const errorData = JSON.parse(responseText)
					if (errorData.error) {
						errorMessage = errorData.error
					}
				} catch {
					// Not JSON, use the text directly if it's not HTML and not infra error
					if (!responseText.startsWith('<!') && !responseText.includes('::')) {
						errorMessage = responseText
					}
				}
			}

			console.error(`Upload failed: ${response.status}`, responseText)
			throw new Error(errorMessage)
		}

		let result: { imageUrls?: string[]; error?: string }
		try {
			result = JSON.parse(responseText)
		} catch {
			console.error('Failed to parse response:', responseText)
			throw new Error('Ugyldigt svar fra server')
		}

		// Check if the response contains an error
		if (result.error) {
			throw new Error(result.error)
		}

		if (!result.imageUrls || !Array.isArray(result.imageUrls)) {
			throw new Error('Invalid response from upload server')
		}

		allImageUrls.push(...result.imageUrls)

		uploadedFiles += uploadBatch.length
		const newProgress = Math.round((uploadedFiles / totalFiles) * 100)
		console.log(`Progress: ${newProgress}%`)
		onProgress(newProgress)
	}

	return allImageUrls
}

export default function Upload() {
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(null as null | number)
	const [error, setError] = useState<string | null>(null)

	const photos = useProjectStore((store) => store.draftPhotos)
	const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
	const [isPhotoSliderOpen, setIsPhotoSliderOpen] = useState(false)

	const addPhotos = useProjectStore((store) => store.addDraftPhotos)
	const setIsUploading = useProjectStore((store) => store.setIsUploading)
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])

	const handleUpload = async (files: File[]) => {
		setIsUploading(true)
		setError(null)
		setUploading(true)
		setProgress(0)

		if (files.length === 0) {
			setError('Please select at least one file to upload.')
			setUploading(false)
			return
		}

		try {
			const uploadedUrls = await uploadPhotos(files, setProgress)
			const photos = uploadedUrls.map(photoFactory)
			addPhotos(photos)
		} catch (err: any) {
			console.error('Upload error:', err)
			setError(err.message || 'En fejl opstod under upload')
		} finally {
			setIsUploading(false)
			setSelectedFiles([])
			setUploading(false)
			setProgress(null)
		}

		console.log('Upload completed')
	}

	const onFilesSelected = (files: File[]) => {
		handleUpload(files)
		setSelectedFiles(files)
	}

	return (
		<div className={'flex min-h-dvh flex-col justify-between'}>
			<div className="flex flex-col">
				<PhotoSliderModal
					onOpenChange={setIsPhotoSliderOpen}
					initialIndex={currentPhotoIndex}
					isOpen={isPhotoSliderOpen}
				/>
				<DragDropUpload onFilesSelected={onFilesSelected}>
					{photos.length > 0 && (
						<div className="w-full text-left">
							<LilHeader>Uploadede fotos ({photos.length})</LilHeader>
						</div>
					)}
					<HorizontalPhotoOverview
						numLoadingPhotos={3}
						chosenIndex={currentPhotoIndex}
						photos={photos}
						onPhotoPress={(_, index) => {
							setCurrentPhotoIndex(index)
							setIsPhotoSliderOpen(true)
						}}
					/>
					<div className="flex flex-col items-center justify-center p-4 py-16">
						{uploading ? (
							<Spinner />
						) : (
							<UploadCloudIcon className="w-10 h-10 text-gray-500" />
						)}
						<p className="text-gray-500">
							{progress !== null
								? `${progress}%`
								: 'Træk fotos hertil, eller klik for at vælge'}
						</p>
					</div>
					{selectedFiles.length > 0 && (
						<p>
							Uploader {selectedFiles.length} foto
							{selectedFiles.length > 1 ? 's' : ''}
						</p>
					)}
					{error && <p className="text-red-500 text-center">{error}</p>}
				</DragDropUpload>
			</div>
			<BottomNav
				disabled={uploading || photos.length === 0}
				route="/create/plan"
				startContent={<CalendarIcon />}
				title={'Planlæg afsendelse'}
				disabledReason="Upload billeder først"
			/>
		</div>
	)
}
