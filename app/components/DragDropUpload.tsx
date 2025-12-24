import React, { useCallback, useRef } from 'react'

interface DragDropUploadProps {
	onFilesSelected: (files: File[]) => void
	children?: React.ReactNode
}

const GradientGlowBox = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-900">
			<div className="relative w-40 h-40 bg-white rounded-lg shadow-sm">
				<div
					className="absolute top-2 left-[-10px] right-[-10px] bottom-[-10px] scale-[1.1] blur-2xl z-[-1] animate-glow 
        bg-gradient-to-l from-pink-500 via-purple-500 to-indigo-600 bg-[length:200%_200%]"
				></div>
			</div>
			<style>
				{`
          @keyframes glow {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }
          .animate-glow {
            animation: glow 2.5s linear infinite;
          }
        `}
			</style>
		</div>
	)
}

export default function AnimatedGlowBox() {
	return (
		<div className="flex items-center justify-center min-h-screen text-gray-500">
			<div
				className={`
          relative bg-white px-6 py-4 rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.01)]
          after:content-[''] after:absolute after:top-[15px] after:left-0 after:right-0 after:z-[-1]
          after:h-full after:w-full after:[transform:scale(0.9)_translateZ(0)] after:blur-[15px]
          after:bg-[linear-gradient(to_left,_#ff5770,_#e4428d,_#c42da8,_#9e16c3,_#6501de,_#9e16c3,_#c42da8,_#e4428d,_#ff5770)]
          after:[background-size:200%_200%] after:animate-glow
        `}
			>
				Animated Gradient Underglow
			</div>
		</div>
	)
}

export function DragDropUpload({
	onFilesSelected,
	children,
}: DragDropUploadProps) {
	const dropZoneRef = useRef<HTMLDivElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const formRef = useRef<HTMLFormElement>(null)
	const handleDragOver = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault()
			event.stopPropagation()
			if (dropZoneRef.current) {
				dropZoneRef.current.classList.add('border-gray-400', 'shadow-xl')
			}
		},
		[],
	)

	const handleDragLeave = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault()
			event.stopPropagation()
			if (dropZoneRef.current) {
				dropZoneRef.current.classList.remove('border-gray-400', 'shadow-xl')
			}
		},
		[],
	)

	const handleDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault()
			event.stopPropagation()
			if (dropZoneRef.current) {
				dropZoneRef.current.classList.remove('border-gray-400', 'shadow-xl')
			}
			const files = Array.from(event.dataTransfer.files)
			onFilesSelected(files)
			if (fileInputRef.current) {
				const dataTransfer = new DataTransfer()
				files.forEach((file) => dataTransfer.items.add(file))
				fileInputRef.current.files = dataTransfer.files
			}
		},
		[onFilesSelected],
	)

	const handleFileChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(event.target.files || [])
			onFilesSelected(files)
		},
		[onFilesSelected],
	)

	return (
		<div>
			<button
				type="button"
				className="w-full"
				onClick={() => fileInputRef.current?.click()}
			>
				<div
					ref={dropZoneRef}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className="bg-white shadow-lg border-1 border-gray-300 rounded-2xl p-4 text-center cursor-pointer hover:border-gray-400 flex flex-col items-center justify-center"
				>
					<AnimatedGlowBox></AnimatedGlowBox>
					{children}
					<form ref={formRef} method="post" encType="multipart/form-data">
						<input
							ref={fileInputRef}
							type="file"
							name="img"
							accept="image/*"
							multiple
							style={{ display: 'none' }}
							onChange={handleFileChange}
						/>
					</form>
				</div>
			</button>
		</div>
	)
}
