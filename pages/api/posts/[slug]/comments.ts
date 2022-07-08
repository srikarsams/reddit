// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Comment } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { db } from '../../../../prisma';
import { authCheck } from '../../../../utils/auth-check';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    Comment | { comments: Comment[] } | { error: string } | { message: string }
  >
) {
  const user = await authCheck(req, res);
  if (!user) {
    return;
  }

  const { slug } = req.query;

  if (req.method === 'POST') {
    try {
      const validated = CommentPayloadValidator.parse(req.body);

      const comment = await db.comment.create({
        data: {
          body: validated.body,
          authorName: user.username,
          postSlug: slug as string,
        },
      });

      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
    return;
  } else if (req.method === 'GET') {
    try {
      const comments = await db.comment.findMany({
        where: {
          postSlug: slug as string,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).send({ comments });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
    return;
  }

  res.status(405).send({ message: 'Only POST requests allowed' });
}

const CommentPayloadValidator = z.object({
  body: z.string().min(1, { message: 'Comment body is missing' }),
});
