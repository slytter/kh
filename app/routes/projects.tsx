import { Button, Spinner } from '@nextui-org/react'
import { Outlet, useMatches, useNavigate, useOutlet } from '@remix-run/react'
import { ArrowBigLeft, ArrowLeft, Plus } from 'lucide-react'
import { Container } from '~/components/Container'
import { LilHeader } from '~/components/LilHeader'
import { useNavigation } from '@remix-run/react'
import { ReactNode, useRef } from 'react'

type PageTopSectionProps = {
	leftContent?: ReactNode
}
const PageTopSection = (props: PageTopSectionProps) => {
	const navigate = useNavigate()
	const { leftContent } = props

	const contentRef = useRef<HTMLDivElement>(null)

	const headerOffset = contentRef.current?.offsetTop || 0

	return (
		<div ref={contentRef} className="relative w-full">
			<div className="mx-auto flex flex-1 flex-col px-6 md:w-[800px]">
				<div style={{ height: headerOffset }}></div>
				<div
					style={{ top: headerOffset }}
					// Some stolen style from Container.tsx
					className="p-2 flex flex-row items-center justify-between space-x-4 left-2 right-2 fixed z-1000 mx-auto flex flex-1 px-6 md:w-[800px] z-10"
				>
					{leftContent}
					{/* <h1 className="text-lg ">Dine kærlige hilsner</h1> */}
					<Button
						color="primary"
						className="font-semibold"
						variant="shadow"
						onPress={() => navigate('/create/upload')}
						startContent={<Plus />}
					>
						<span>
							Ny <span className="neulis text-md">kh</span>
						</span>
					</Button>
				</div>
			</div>
		</div>
	)
}

export default function Projects() {
	const outlet = useOutlet()

	const matches = useMatches()
	const lastMatch = matches[matches.length - 1]
	const isOverview = lastMatch?.pathname === '/projects/overview'

	const navigate = useNavigate()

	return (
		<Container>
			<PageTopSection
				leftContent={
					!isOverview ? (
						<Button
							onPress={() => navigate('/projects/overview')}
							startContent={<ArrowLeft size={18} />}
							className="backdrop-blur-md bg-white/50"
							variant="light"
						>
							Oversigt
						</Button>
					) : (
						<LilHeader>OVERSIGT</LilHeader>
					)
				}
			/>
			{outlet}
		</Container>
	)
}
