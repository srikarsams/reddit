// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PostVote, CommentVote, Comment, Post, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { db } from '../../prisma';
import { authCheck } from '../../utils/auth-check';
import { fetchPost } from '../../utils/fetch-post';
import { setUserVote } from '../../utils/set-user-vote';

type CommentWithUserVote = Comment & {
  userVote: number;
};

type PostWithUserVote = Post & {
  userVote: number;
  comments: CommentWithUserVote[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostWithUserVote | { error: string }>
) {
  const user = await authCheck(req, res);
  if (!user) {
    return;
  }

  if (req.method === 'POST') {
    try {
      const validated = VotePayloadValidator.parse(req.body);
      let vote: PostVote | CommentVote | null;

      // if the vote is for a post
      if (validated.postId) {
        vote = await db.postVote.findFirst({
          where: {
            username: user.username,
            postId: validated.postId,
          },
        });
        // if no vote and value is 0, invalid scenario since we can't reset the vote if it doesn't exist
        if (!vote && validated.value === 0) {
          res.status(404).json({ error: 'Vote not found' });
          return;
        } else if (!vote) {
          // if no vote and value is not 0, create a vote accordingly
          vote = await db.postVote.create({
            data: {
              postId: validated.postId,
              username: user.username,
              value: validated.value,
            },
          });
        } else if (vote && validated.value === 0) {
          // if vote and value is 0, remove the vote
          await db.postVote.delete({
            where: {
              id: vote.id,
            },
          });
        } else if (vote.value !== validated.value) {
          // if vote and value is not 0, update the vote value
          vote = await db.postVote.update({
            where: {
              id: vote.id,
            },
            data: {
              value: validated.value,
            },
          });
        }

        const post = await fetchPost({ identifier: validated.postId });

        res.status(200).json(setUserVote(post, user));

        // if the vote is for a comment
      } else if (validated.commentId) {
        vote = await db.commentVote.findFirst({
          where: {
            username: user.username,
            commentId: validated.commentId,
          },
        });

        // if no vote and value is 0, invalid scenario since we can't reset the vote if it doesn't exist
        if (!vote && validated.value === 0) {
          res.status(404).json({ error: 'Vote not found' });
          return;
        } else if (!vote) {
          // if no vote and value is not 0, create a vote accordingly
          vote = await db.commentVote.create({
            data: {
              commentId: validated.commentId,
              username: user.username,
              value: validated.value,
            },
          });
        } else if (vote && validated.value === 0) {
          // if vote and value is 0, remove the vote
          await db.commentVote.delete({
            where: {
              id: vote.id,
            },
          });
        } else if (vote.value !== validated.value) {
          // if vote and value is not 0, update the vote value
          vote = await db.commentVote.update({
            where: {
              id: vote.id,
            },
            data: {
              value: validated.value,
            },
          });
        }

        const comment = await db.comment.findUniqueOrThrow({
          where: {
            id: validated.commentId,
          },
          include: {
            votes: true,
          },
        });

        const post = await fetchPost({ slug: comment.postSlug });

        res.status(200).json(setUserVote(post, user));
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: (err as Error).message });
    }
    return;
  }

  res.status(405).send({ error: 'Only POST requests allowed' });
}

const VotePayloadValidator = z
  .object({
    value: z
      .number()
      .max(1, { message: 'Value must be 1, 0 or -1' })
      .min(-1, { message: 'Value must be 1, 0 or -1' }),
    postId: z.string().optional(),
    commentId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.postId && !data.commentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['postId'],
        message: 'Either Post or Comment ID is required',
      });
    }
  });
