import { getUsageInfo } from '@/lib/insect-api';

export async function GET() {
  try {
    const usage = await getUsageInfo();
    return Response.json({
      success: true,
      usage,
    });
  } catch (error) {
    console.error('[v0] Usage info error:', error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get usage info',
      },
      { status: 500 }
    );
  }
}
