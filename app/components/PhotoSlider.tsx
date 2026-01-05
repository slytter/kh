import React from 'react'
import Flicking from '@egjs/react-flicking'
import '@egjs/react-flicking/dist/flicking.css'
import { HorizontalPhotoOverview } from './HorizontalPhotoOverview'
import { Image } from './shared/Image'
import { Photo } from '~/store/store'

const handleDragStart = (e: React.DragEvent<HTMLImageElement>) =>
	e.preventDefault()

type Props = {
	photos: Photo[]
	initialIndex: number
	chosenIndex: number
	setChosenIndex: (index: number) => void
	flickingRef: React.RefObject<Flicking>
}

export const PhotoSlider = (props: Props) => {
	const { photos, initialIndex, chosenIndex, setChosenIndex, flickingRef } =
		props

	if (!photos || photos.length === 0) {
		return null
	}

	return (
		<>
			<Flicking
				ref={flickingRef}
				cameraClass="flicking-camera"
				initialIndex={initialIndex}
				align="center"
				circular={false}
				deceleration={0.0075}
				onChanged={(e) => {
					setChosenIndex(e.index)
				}}
			>
				{photos.map((photo, index) => (
					<div
						className="panel border-r-20 w-full overflow-hidden"
						key={photo.id}
						style={{
							height: '80vh',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Image
							className="panel inher border-r-20 w-full object-contain outline-1"
							style={{ height: 'inherit' }}
							src={photo.url}
							size="lg"
							alt={'Photo ' + index}
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
						flickingRef.current?.moveTo(index)
						setChosenIndex(index)
					}}
				/>
			</div>
		</>
	)
}
