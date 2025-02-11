import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/react'
import { Photo, Project } from '~/store/store'
import dayjs from 'dayjs'
import { HorizontalPhotoOverview } from './HorizontalPhotoOverview'
import { useState } from 'react'
import { ArrowRight, SettingsIcon } from 'lucide-react'
import { useNavigate } from '@remix-run/react'
import _ from 'lodash'

type Props = {
	project: Project
	type: 'sending' | 'receiving'
	photos: Photo[]
	onDelete: (projectId: number) => void
	onEdit: (projectId: number) => void
}

export const ProjectCard = (props: Props) => {
	const { project, photos, onDelete, onEdit, type } = props

	const [hover, setHover] = useState(false)

	const projectId = project.id

	const navigate = useNavigate()

	return (
		<Card className="">
			<CardHeader className="flex items-center justify-between">
				<div className="flex flex-col">
					<p className="text-md">{project.name}</p>
					<p className="text-small text-default-500">
						Oprettet den {dayjs(project.created_at).format('DD. MMM')}
					</p>
				</div>
				<Dropdown>
					<DropdownTrigger>
						<Button isIconOnly variant="bordered" aria-label="Indstillinger">
							<SettingsIcon size={20} />
						</Button>
					</DropdownTrigger>
					<DropdownMenu>
						<DropdownItem
							onClick={() => {
								projectId && onEdit(projectId)
							}}
						>
							<button type="submit">Rediger projekt</button>
						</DropdownItem>
						<DropdownItem
							onClick={() => {
								navigate(`/projects/overview/${projectId}/receipt`)
							}}
						>
							<button type="submit">Se kvittering</button>
						</DropdownItem>
						<DropdownItem
							color={'danger'}
							className={'text-danger'}
							onClick={() => projectId && onDelete(projectId)}
						>
							<button type="submit">Slet projekt</button>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</CardHeader>
			<Divider />
			<CardBody aria-label="Dynamic Actions">
				<div
					onMouseOver={() => setHover(true)}
					onMouseOut={() => setHover(false)}
					onBlur={() => setHover(false)}
					onFocus={() => setHover(true)}
				>
					<HorizontalPhotoOverview
						photos={_.orderBy(photos, ['send_at'], ['asc'])}
						height={hover ? 100 : 60}
						hideUnsent={type === 'receiving'}
					/>
				</div>
			</CardBody>
			<Divider />
			<CardFooter className="justify-between">
				{project && (
					<>
						<p className="text-sm">
							{project.receivers.map((receiver) => (
								<span
									className="bg-gray-200 px-2 py-1 rounded-md text-xs"
									key={receiver}
								>
									{receiver}
								</span>
							))}
						</p>
					</>
				)}
				<Button
					size="sm"
					variant="solid"
					// color="secondary"
					onClick={() =>
						props.project.id && navigate(`/projects/${props.project.id}`)
					}
					endContent={<ArrowRight size={16} />}
				>
					Se projekt
				</Button>
			</CardFooter>
		</Card>
	)
}
