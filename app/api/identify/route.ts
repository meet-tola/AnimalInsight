import { uploadInsectImage, getIdentificationResults } from '@/lib/insect-api';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      console.error('[v0] No image file provided in request');
      return Response.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    console.log('Received image:', file.name, `(${file.size} bytes)`);

    // Check if API key is set
    if (!process.env.INSECT_ID_API_KEY) {
      console.error('[v0] INSECT_ID_API_KEY environment variable not set');
      return Response.json(
        {
          error:
            'API key not configured. Please set INSECT_ID_API_KEY in environment variables.',
        },
        { status: 500 }
      );
    }

    // Step 1: Upload image to Insect.id API
    console.log('[v0] Uploading image to Insect.id API');
    const uploadResponse = await uploadInsectImage(file);
    const accessToken = uploadResponse.access_token;
    console.log('[v0] Got access token:', accessToken.substring(0, 20) + '...');

    // Step 2: Get identification results with details
    console.log('[v0] Fetching detailed identification results');
    const results = await getIdentificationResults(
      accessToken,
      'common_names,url,description,image'
    );

    console.log("Identification:", results);
    

    console.log(
      '[v0] Identification complete. Found',
      results.results?.length,
      'matches'
    );

    return Response.json({
      success: true,
      accessToken,
      results: results.results || [],
    });
  } catch (error) {
    console.error('[v0] Identification error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to identify insect';
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
