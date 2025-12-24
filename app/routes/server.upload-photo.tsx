import {
	ActionFunctionArgs,
	json,
	unstable_parseMultipartFormData,
	unstable_composeUploadHandlers,
} from '@remix-run/node'

// todo ups... (generate new key)
const accessKey = process.env.BUNNY_STORAGE_KEY
const storageZoneName = 'kh-dk'

const isDev = process.env.NODE_ENV === 'development'

export const action = async ({ request }: ActionFunctionArgs) => {
	// Validate that the access key is configured
	if (!accessKey || accessKey.trim() === '') {
		console.error('BUNNY_STORAGE_KEY is not configured')
		return json(
			{
				error:
					'BunnyCDN storage key is not configured. Please set BUNNY_STORAGE_KEY environment variable.',
			},
			{ status: 500 },
		)
	}

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
					'Content-Type': part.contentType || 'application/octet-stream',
				},
			})

			if (!response.ok) {
				const errorText = await response.text().catch(() => '')
				console.error('BunnyCDN upload failed:', {
					status: response.status,
					statusText: response.statusText,
					errorText,
				})
				throw new Error(
					`BunnyCDN upload failed: ${response.status} ${response.statusText}`,
				)
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
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error occurred'
		return json(
			{
				error: errorMessage,
			},
			{ status: 500 },
		)
	}
}
