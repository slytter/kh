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
	const concurrentUploads = 4
	const totalFiles = files.length
	let uploadedFiles = 0
	const allImageUrls: string[] = []

	for (let i = 0; i < totalFiles; i += concurrentUploads) {
		console.log(`Processing batch ${Math.floor(i / concurrentUploads) + 1}`)
		const uploadBatch = files.slice(i, i + concurrentUploads)
		const formData = new FormData()
		uploadBatch.forEach((file) => formData.append('img', file))

		const response = await fetch('/server/upload-photo', {
			method: 'POST',
			body: formData,
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error(
				`Upload failed: ${response.status} ${response.statusText}`,
				errorText,
			)
			throw new Error(`Upload failed: ${response.statusText}`)
		}

		const result = await response.json()
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
				{photos.length > 0 && (
					<LilHeader>Uploadede fotos ({photos.length})</LilHeader>
				)}
				<PhotoSliderModal
					onOpenChange={setIsPhotoSliderOpen}
					initialIndex={currentPhotoIndex}
					isOpen={isPhotoSliderOpen}
				/>
				<DragDropUpload onFilesSelected={onFilesSelected}>
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
