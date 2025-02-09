import {
	ActionFunctionArgs,
	json,
	unstable_parseMultipartFormData,
	unstable_composeUploadHandlers,
	UploadHandlerPart,
} from '@remix-run/node'

// todo ups... (generate new key)
const accessKey = process.env.BUNNY_STORAGE_KEY
const storageZoneName = 'kh-assets'

const isDev = process.env.NODE_ENV === 'development'

export const action = async ({ request }: ActionFunctionArgs) => {
	const uploadHandler = unstable_composeUploadHandlers(async (part) => {
		if (part.name !== 'img' || !part.filename) {
			return undefined
		}

		const uniqueFilename = `${Date.now()}-${part.filename}` // Ensure unique filenames

		const filePath = isDev ? `dev/${uniqueFilename}` : uniqueFilename
		const postUrl = `https://storage.bunnycdn.com/${storageZoneName}/${filePath}`

		try {
			// Accumulate all chunks into a single buffer
			const chunks: Uint8Array[] = []
			for await (const chunk of part.data) {
				chunks.push(chunk)
			}
			const fileBuffer = Buffer.concat(chunks)

			console.log('UPLOADING', { postUrl })
			const response = await fetch(postUrl, {
				method: 'PUT',
				body: fileBuffer,
				headers: {
					AccessKey: accessKey,
					'Content-Type': part.contentType,
				},
			})

			if (!response.ok) {
				throw new Error(`Upload failed: ${response.statusText}`)
			}

			const cdnUrl = `https://kh-assets.b-cdn.net/${filePath}`
			return cdnUrl
		} catch (error) {
			console.error('Upload error:', error)
			throw error
		}
	})

	try {
		const formData = await unstable_parseMultipartFormData(
			request,
			uploadHandler,
		)
		const imageUrls = formData.getAll('img')
		console.log({ imageUrls })
		return json(
			{
				imageUrls,
			},
			{ status: 200 },
		)
	} catch (error) {
		console.error('Upload error:', error)
		return json(
			{
				error: error,
			},
			{ status: 500 },
		)
	}
}
