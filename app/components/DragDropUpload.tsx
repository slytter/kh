import React, { useCallback, useRef } from 'react'

interface DragDropUploadProps {
	onFilesSelected: (files: File[]) => void
	children?: React.ReactNode
}

export default function AnimatedGlowBox() {
	return (
		<>
			<style>
				{`
          @keyframes gradient-shift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes glow-pulse {
            0%, 100% {
              opacity: 0.7;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.08);
            }
          }
          @keyframes outline-glow {
            0%, 100% {
              opacity: 0.85;
              box-shadow: 
                0 0 0 1px rgba(255, 107, 157, 0.4),
                0 0 0 2px rgba(108, 92, 231, 0.3),
                0 0 0 3px rgba(255, 107, 157, 0.2),
                0 0 15px rgba(255, 107, 157, 0.5),
                0 0 30px rgba(108, 92, 231, 0.4),
                0 0 45px rgba(255, 107, 157, 0.3);
            }
            50% {
              opacity: 1;
              box-shadow: 
                0 0 0 1px rgba(255, 107, 157, 0.6),
                0 0 0 2px rgba(108, 92, 231, 0.5),
                0 0 0 3px rgba(255, 107, 157, 0.4),
                0 0 20px rgba(255, 107, 157, 0.7),
                0 0 40px rgba(108, 92, 231, 0.6),
                0 0 60px rgba(255, 107, 157, 0.5);
            }
          }
          .gradient-underglow-main {
            animation: gradient-shift 4s ease-in-out infinite;
          }
          .gradient-underglow-secondary {
            animation: gradient-shift 5s ease-in-out infinite reverse;
          }
          .gradient-underglow-outer {
            animation: glow-pulse 3s ease-in-out infinite;
          }
          .outline-shadow {
            animation: outline-glow 3s ease-in-out infinite;
          }
        `}
			</style>
			<div
				className="absolute inset-0 rounded-2xl pointer-events-none"
				style={{ zIndex: 0, overflow: 'visible' }}
			>
				{/* Animated outline shadow */}
				<div
					className="absolute inset-0 rounded-2xl outline-shadow"
					style={{
						pointerEvents: 'none',
					}}
				/>
				{/* Main animated gradient layer - visible glow */}
				<div
					className="absolute rounded-2xl gradient-underglow-main"
					style={{
						top: '-12px',
						left: '-12px',
						right: '-12px',
						bottom: '-12px',
						background:
							'linear-gradient(135deg, #ff6b9d, #c44569, #f8b500, #c44569, #6c5ce7, #a29bfe, #6c5ce7, #c44569, #ff6b9d)',
						backgroundSize: '300% 300%',
						filter: 'blur(20px)',
						opacity: 0.9,
					}}
				/>
				{/* Secondary glow layer for depth */}
				<div
					className="absolute rounded-2xl gradient-underglow-secondary"
					style={{
						top: '-16px',
						left: '-16px',
						right: '-16px',
						bottom: '-16px',
						background:
							'linear-gradient(135deg, #ff6b9d, #6c5ce7, #a29bfe, #6c5ce7, #ff6b9d)',
						backgroundSize: '200% 200%',
						filter: 'blur(28px)',
						opacity: 0.7,
					}}
				/>
				{/* Subtle outer glow */}
				<div
					className="absolute rounded-2xl gradient-underglow-outer"
					style={{
						top: '-20px',
						left: '-20px',
						right: '-20px',
						bottom: '-20px',
						background:
							'radial-gradient(circle at center, #ff6b9d, #6c5ce7, transparent 70%)',
						filter: 'blur(36px)',
						opacity: 0.6,
					}}
				/>
			</div>
		</>
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
				dropZoneRef.current.classList.add('border-gray-400')
			}
		},
		[],
	)

	const handleDragLeave = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault()
			event.stopPropagation()
			if (dropZoneRef.current) {
				dropZoneRef.current.classList.remove('border-gray-400')
			}
		},
		[],
	)

	const handleDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault()
			event.stopPropagation()
			if (dropZoneRef.current) {
				dropZoneRef.current.classList.remove('border-gray-400')
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
		<div className="relative" style={{ overflow: 'visible' }}>
			<button
				type="button"
				className="w-full relative"
				onClick={() => fileInputRef.current?.click()}
				style={{ overflow: 'visible' }}
			>
				<div
					ref={dropZoneRef}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className="relative border-1 border-gray-300 rounded-2xl p-4 text-center cursor-pointer hover:border-gray-400 flex flex-col items-center justify-center"
					style={{ overflow: 'visible' }}
				>
					<AnimatedGlowBox />
					{/* White background layer */}
					<div
						className="absolute inset-0 rounded-2xl"
						style={{
							backgroundColor: '#ffffff',
							zIndex: 1,
							pointerEvents: 'none',
						}}
					/>
					<div className="relative z-10">{children}</div>
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
