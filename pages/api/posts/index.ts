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
    let posts = await db.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        votes: true,
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
    });

    // calculate the vote score for each post and remove votes data
    posts = posts.map((post) => {
      post._count.votes = post.votes.reduce(
        (acc, initial) => acc + initial.value,
        0
      );
      return {
        ...post,
        votes: [],
      };
    });

    res.status(200).json({ posts });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
