import { ActionFunctionArgs, json } from '@remix-run/node'

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

	try {
		const formData = await request.formData()
		const files = formData.getAll('img') as File[]

		if (!files || files.length === 0) {
			return json({ error: 'No files uploaded' }, { status: 400 })
		}

		const imageUrls: string[] = []

		for (const file of files) {
			if (!(file instanceof File) || !file.name) {
				console.log('Skipping non-file entry')
				continue
			}

			const uniqueFilename = `${Date.now()}-${file.name}`
			const filePath = isDev ? `dev/${uniqueFilename}` : uniqueFilename
			const postUrl = `https://storage.bunnycdn.com/${storageZoneName}/${filePath}`

			// Convert File to ArrayBuffer
			const arrayBuffer = await file.arrayBuffer()

			console.log('UPLOADING', { postUrl, size: arrayBuffer.byteLength })

			const response = await fetch(postUrl, {
				method: 'PUT',
				body: arrayBuffer,
				headers: {
					AccessKey: accessKey,
					'Content-Type': file.type || 'application/octet-stream',
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
			imageUrls.push(cdnUrl)
		}

		console.log({ imageUrls })
		return json({ imageUrls }, { status: 200 })
	} catch (error) {
		console.error('Upload error:', error)
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error occurred'
		return json({ error: errorMessage }, { status: 500 })
	}
}
