import { ActionFunctionArgs, json, unstable_parseMultipartFormData, unstable_composeUploadHandlers } from "@remix-run/node";

// todo ups... (generate new key)
const accessKey = process.env.BUNNY_STORAGE_KEY
const storageZoneName = 'kh-assets';

export const action = async ({ request }: ActionFunctionArgs) => {
  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, contentType, data, filename }: { name: string, contentType: string, data: AsyncIterable<Uint8Array>, filename: string }) => {
      if (name !== "img") {
        return undefined;
      }
      
      const uniqueFilename = `${Date.now()}-${filename}`; // Ensure unique filenames
      const filePath = process.env.NODE_ENV === 'development' ? `dev/${uniqueFilename}` : uniqueFilename;
      const postUrl = `https://storage.bunnycdn.com/${storageZoneName}/${filePath}`;
      try {
        const uploadPromises: Promise<void>[] = [];
        const cdnUrls: string[] = [];

        for await (const chunk of data) {
          const fileBuffer = Buffer.from(chunk);
          console.log('UPLOADING', { postUrl });

          const uploadPromise = fetch(postUrl, {
            method: 'PUT',
            body: fileBuffer,
            headers: {
              'AccessKey': accessKey,
              'Content-Type': contentType,
            },
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Upload failed: ${response.statusText}`);
            }
            const cdnUrl = `https://kh-assets.b-cdn.net/${filePath}`;
            cdnUrls.push(cdnUrl);
          });

          uploadPromises.push(uploadPromise);
        }

        await Promise.all(uploadPromises);

        return cdnUrls;
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    },
  );

  
  try {
    const formData = await unstable_parseMultipartFormData(request, uploadHandler);
    const imageUrls = formData.getAll("img");
    console.log({imageUrls})
    return json(
      {
        imageUrls,
      },
      { status: 200 },
    );

  } catch (error) {
    console.error('Upload error:', error);
    return json(
      {
        error: error,
      },
      { status: 500 },
    );
  }

};
