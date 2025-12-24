import {
	Body,
	Button,
	Container,
	Font,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import * as React from 'react'
import { transformSrc } from '~/components/shared/Image'

const main: React.CSSProperties = {
	backgroundColor: '#ffffff',
}

const link: React.CSSProperties = {
	color: '#2754C5',
	fontFamily:
		"-apple-system, BlinkMacSystemFont,'inter' 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '12px',
	textDecoration: 'underline',
}

const text: React.CSSProperties = {
	color: '#333',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '16px',
	textAlign: 'center',
	margin: '0',
}

const footer: React.CSSProperties = {
	textAlign: 'center',
	color: '#898989',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '12px',
	lineHeight: '22px',
	marginTop: '12px',
	marginBottom: '24px',
}

interface PhotoEmailProps {
	imageSource: string
	imageNumber: number
	numImages: number
	userMail: string
	senderName: string
	isReceipt: boolean
	projectId: number
	originalRecipient?: string
	message?: string
}

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: ''

export const PhotoEmail = ({
	imageSource,
	imageNumber,
	numImages,
	senderName,
	userMail,
	message,
	isReceipt,
	originalRecipient,
	projectId,
}: PhotoEmailProps) => {
	const unSubscribeUrl =
		'https://kh-eta.vercel.app/email/unsubscribe?email=' + userMail
	const projectUrl = `https://kh-eta.vercel.app/projects/${projectId}`

	return (
		<Html>
			<Head>
				<Font
					fontFamily="inter"
					fallbackFontFamily="Helvetica"
					webFont={{
						url: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
						format: 'woff2',
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
			</Head>
			<Preview>Dit daglige minde fra kh.dk</Preview>
			<Tailwind>
				<Body style={main}>
					<Container className="px-2 mx-auto">
						<Link href="https://kh-eta.vercel.app/" target="_blank">
							<Img
								src={`https://ucarecdn.com/934da8c8-6a2e-4ff6-a86b-2f4fa6fe6872/kh.png`}
								// src={`${baseUrl}/static/kh.png`}
								width="32"
								style={{ marginTop: 16 }}
								alt="Kh's Logo"
							/>
						</Link>
						{isReceipt && originalRecipient && (
							<Text
								className="pt-6"
								style={{ ...text, fontWeight: 600, margin: '0', fontSize: 20 }}
							>
								Dette billede er blevet sendt til {originalRecipient}
							</Text>
						)}
						<Text
							style={{ ...text, fontWeight: 600, margin: '0', marginTop: 16 }}
						>
							Billede {imageNumber} af {numImages}
						</Text>
						{message && <Text style={{ ...text }}>"{message}"</Text>}
						<Img
							src={transformSrc(imageSource, 'lg')}
							alt="Dagens billede"
							width="100%"
							height="auto"
							className="rounded-xl"
							style={{
								marginBottom: '0px',
								marginTop: '8px',
							}}
						/>
						<Section className="text-center mt-[16px] mb-[16px]">
							<Button
								className="bg-[#000000] rounded-xl text-white text-[14px] font-semibold no-underline text-center px-8 py-3"
								href={projectUrl}
							>
								Se alle billeder
							</Button>
						</Section>

						<Link href="https://kh-eta.vercel.app/" target="_blank">
							<div className="flex flex-col items-center pt-2">
								<Img
									// src={`${baseUrl}/static/kh.png`}
									src={`https://ucarecdn.com/934da8c8-6a2e-4ff6-a86b-2f4fa6fe6872/kh.png`}
									height="16"
									alt="Kh's Logo"
								/>
								<Text
									style={{
										...text,
										color: 'black',
										opacity: 0.8,
										fontSize: '12px',
										fontWeight: 400,
									}}
								>
									{senderName}
								</Text>
							</div>
						</Link>
						<Text style={footer}>
							<Link
								href={'https://kh-eta.vercel.app/?email=' + userMail}
								target="_blank"
								style={{ ...link, color: '#898989' }}
							>
								kh.dk
							</Link>{' '}
							– et minde hver dag, til en du holder af 💘
							<br />
						</Text>
						<Text style={footer}>
							<Link href={unSubscribeUrl} target="_blank" style={link}>
								Afmeld kh
							</Link>
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

PhotoEmail.PreviewProps = {
	imageSource: 'https://images.unsplash.com/photo-1713288971538-80084dbfc161',
	imageNumber: 1,
	numImages: 52,
	isReceipt: true,
	originalRecipient: 'dinmor@gmail.com',
	userMail: 'ns@wayer.io',
	senderName: 'Nikolaj Schlüter',
	message: 'Dengang vi var i Italien',
} as PhotoEmailProps

export default PhotoEmail
