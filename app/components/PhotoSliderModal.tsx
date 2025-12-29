import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { useProjectStore } from '../store/store'
import { PhotoSlider } from './PhotoSlider'
import Flicking from '@egjs/react-flicking'

type Props = {
	initialIndex: number
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
}

export const PhotoSliderModal = (props: Props) => {
	const { initialIndex, isOpen, onOpenChange } = props
	const [chosenIndex, setChosenIndex] = useState(initialIndex)
	const photos = useProjectStore((state) => state.draftPhotos)
	const flickingRef = React.useRef<Flicking>(null)

	// Sync the chosenIndex and move the carousel when initialIndex changes or modal opens
	useEffect(() => {
		if (isOpen) {
			setChosenIndex(initialIndex)
			// Small delay to ensure Flicking is mounted
			setTimeout(() => {
				flickingRef.current?.moveTo(initialIndex)
			}, 0)
		}
	}, [initialIndex, isOpen])

	return (
		<Modal
			backdrop={'blur'}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			isDismissable={true}
			isKeyboardDismissDisabled={true}
			size="4xl"
			placement="center"
		>
			<ModalContent>
				<ModalBody className="p-0 pt-10">
					{photos && photos.length > 0 && (
						<PhotoSlider
							photos={photos}
							initialIndex={initialIndex}
							chosenIndex={chosenIndex}
							setChosenIndex={setChosenIndex}
							flickingRef={flickingRef}
						/>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
