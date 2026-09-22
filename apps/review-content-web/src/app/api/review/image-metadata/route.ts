import { persistReviewImageMetadata } from '@/lib/review-image-metadata';
import {
  parseReviewImageMetadataRequest,
  resolveVerifiedReviewTarget,
  ReviewRequestError,
} from '@/lib/review-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const input = parseReviewImageMetadataRequest(await request.json());
    const target = await resolveVerifiedReviewTarget(input.target);
    const result = persistReviewImageMetadata({
      ...input,
      target: { ...target, side: input.target.side },
    });
    return Response.json(
      {
        imageMetadata: input.imageMetadata,
        message: result.message,
        side: target.side,
      },
      { status: result.status },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json(
        { message: 'The request body is not valid JSON.' },
        { status: 400 },
      );
    }
    if (error instanceof ReviewRequestError) {
      return Response.json(
        { message: error.message },
        { status: error.status },
      );
    }
    return Response.json(
      { message: 'The image metadata request could not be processed.' },
      { status: 500 },
    );
  }
}
