// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Post } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '../../../prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ posts: Post[] } | { error: string }>
) {
  if (req.method !== 'GET') {
    res.status(405).send({ error: 'Only GET requests allowed' });
    return;
  }

  try {
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
