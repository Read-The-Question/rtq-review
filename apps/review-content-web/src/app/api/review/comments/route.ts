import { appendVerifiedReviewComment } from '@/lib/review-comments';
import {
  parseReviewCommentRequest,
  ReviewRequestError,
} from '@/lib/review-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const input = parseReviewCommentRequest(await request.json());
    const result = await appendVerifiedReviewComment(input);
    return Response.json(
      { comment: result.comment },
      { status: result.created ? 201 : 200 },
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
      { message: 'The local comment could not be stored.' },
      { status: 500 },
    );
  }
}
