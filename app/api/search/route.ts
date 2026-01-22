import { searchInsectByName } from '@/lib/insect-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return Response.json(
        { error: 'Search query required' },
        { status: 400 }
      );
    }

    const results = await searchInsectByName(query);

    return Response.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to search insects',
      },
      { status: 500 }
    );
  }
}
