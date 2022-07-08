// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Post } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '../../../prisma';
import { authCheck } from '../../../utils/auth-check';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { posts: Post[] } | { error: string } | { message: string }
  >
) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' });
    return;
  }

  try {
    const user = await authCheck(req, res);
    if (!user) {
      return;
    }

    const posts = await db.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ posts });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
