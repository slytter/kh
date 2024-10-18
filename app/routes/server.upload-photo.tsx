import { ActionFunctionArgs, json, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { unstable_composeUploadHandlers } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, contentType, data, filename }) => {
      if (name !== "img") {
        return undefined;
      }

      console.log(filename, contentType);

      const accessKey = '177a49dd-3e51-4a53-9fbf3900363a-8b7c-4562';
      const storageZoneName = 'kh-assets';
      const uniqueFilename = `${Date.now()}-${filename}`; // Ensure unique filenames
      const postUrl = `https://storage.bunnycdn.com/${storageZoneName}/${uniqueFilename}`;

      try {
        const chunks = [];
        for await (const chunk of data) {
          chunks.push(chunk);
        }
        const fileBuffer = Buffer.concat(chunks);

        const response = await fetch(postUrl, {
          method: 'PUT',
          body: fileBuffer,
          headers: {
            'AccessKey': accessKey,
            'Content-Type': contentType,
          },
        });

        const cdnUrl = `https://kh-assets.b-cdn.net/${uniqueFilename}`;
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        return cdnUrl;
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    },
    unstable_createMemoryUploadHandler()
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