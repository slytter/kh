import { ActionFunctionArgs, json } from "@remix-run/node";


// untested
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const filePath = formData.get("filePath") as string;

  if (!filePath) {
    return json({ error: "File path is required" }, { status: 400 });
  }

  const accessKey = '177a49dd-3e51-4a53-9fbf3900363a-8b7c-4562';
  const storageZoneName = 'kh-assets';
  const deleteUrl = `https://storage.bunnycdn.com/${storageZoneName}/${filePath}`;

  try {
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'AccessKey': accessKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }

    return json({ success: true, message: "File deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return json(
      { error: "Failed to delete the file", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
};

