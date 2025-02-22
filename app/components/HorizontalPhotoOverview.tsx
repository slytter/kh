import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	ScrollShadow,
	Skeleton,
} from '@nextui-org/react'
import { Photo, useProjectStore } from '../store/store'
import { useEffect, useRef } from 'react'
import { Image } from '../components/shared/Image'
type Props = {
	photos: Photo[]
	numLoadingPhotos?: number
	onPhotoPress?: (photo: Photo, index: number) => void
	chosenIndex?: number
	height?: number
	hideUnsent?: boolean
}

export const HorizontalPhotoOverview = (props: Props) => {
	const {
		photos,
		onPhotoPress,
		height,
		chosenIndex,
		numLoadingPhotos,
		hideUnsent,
	} = props
	// const photos = useProjectStore((store) => store.draft.photos);
	const removePhoto = useProjectStore((store) => store.removePhoto)

	const scrollRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				right: 0,
				behavior: 'smooth',
			})
		}
	}, [chosenIndex, height])

	return (
		<div>
			<ScrollShadow
				ref={scrollRef}
				hideScrollBar
				offset={10}
				orientation="horizontal"
				className="flex space-x-1 overflow-x-auto"
			>
				{photos.map((photo, index) => {
					const hidden = hideUnsent && !photo.did_send
					return (
						<button
							key={photo.id}
							onClick={(e) => {
								e.stopPropagation()
								onPhotoPress?.(photo, index)
							}}
							className={`relative flex-shrink-0 cursor-pointer overflow-hidden
            first:rounded-bl-xl first:rounded-tl-xl last:rounded-br-xl last:rounded-tr-xl
          `}
						>
							<Image
								size="sm"
								src={`${photo.url}`}
								width="100"
								height={height || '100'}
								key={photo.id}
								className={`z-10 h-[${height || '100'}px] w-[70px] rounded-lg bg-gray-100 object-cover transition-all duration-200 ${chosenIndex === index ? 'border-4 border-black' : ''} ${hidden ? 'blur-sm' : ''}`}
								style={{ height: height || '100px' }}
								alt={'file.fileInfo.originalFilename' || ''}
							/>
							<div className="absolute right-1 top-1">
								<Dropdown placement="bottom-end">
									<DropdownTrigger>
										<div className="h-6 w-6 rounded-md bg-white p-0 opacity-90 hover:opacity-100 text-xs items-center justify-center flex">
											···
										</div>
									</DropdownTrigger>
									<DropdownMenu aria-label="Profile Actions" variant="flat">
										<DropdownItem
											key="profile"
											className="h-8 gap-2"
											onClick={(e) => {
												e.stopPropagation()
												removePhoto(photo.id)
											}}
										>
											<p className="font-semibold">Slet billede</p>
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</div>
						</button>
					)
				})}
			</ScrollShadow>
			{numLoadingPhotos &&
				Array.from({ length: 4 }).map((_, index) => (
					<div key={index} className="flex-shrink-0 w-70 h-100 bg-gray-100">
						<Skeleton className="w-full h-full" />
					</div>
				))}
		</div>
	)
}
