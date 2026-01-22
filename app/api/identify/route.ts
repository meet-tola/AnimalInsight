import { uploadInsectImage, getIdentificationResults } from '@/lib/insect-api';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      console.error('No image file provided in request');
      return Response.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    console.log('Received image:', file.name, `(${file.size} bytes)`);

    // Check if API key is set
    if (!process.env.INSECT_ID_API_KEY) {
      console.error('INSECT_ID_API_KEY environment variable not set');
      return Response.json(
        {
          error:
            'API key not configured. Please set INSECT_ID_API_KEY in environment variables.',
        },
        { status: 500 }
      );
    }

    // Step 1: Upload image to Insect.id API
    console.log('Uploading image to Insect.id API');
    const uploadResponse = await uploadInsectImage(file);
    const accessToken = uploadResponse.access_token;
    console.log('Got access token:', accessToken.substring(0, 20) + '...');

    // Step 2: Get identification results with details
    console.log('Fetching detailed identification results');
    // After getting the response
const apiResponse = await getIdentificationResults(
  accessToken,
  'common_names,url,description,image'
);

// ← This is the real object from the API
console.log("Identification:", apiResponse);

// Now access the nested suggestions
const suggestions = apiResponse.result?.classification?.suggestions || [];

console.log(
  'Identification complete. Found',
  suggestions.length,
  'matches'
);

return Response.json({
  success: true,
  accessToken,
  results: suggestions,   // ← this is what the frontend probably wants
});
  } catch (error) {
    console.error('Identification error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to identify insect';
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
