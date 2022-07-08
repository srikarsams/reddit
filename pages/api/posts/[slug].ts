// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Post } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '../../../prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | { error: string } | { message: string }>
) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' });
    return;
  }

  try {
    const { slug } = req.query;
    const post = await db.post.findUniqueOrThrow({
      where: {
        slug: slug as string,
      },
      include: {
        sub: {
          select: {
            description: true,
            name: true,
            bannerUrn: true,
            imageUrn: true,
            creatorName: true,
          },
        },
      },
    });

    res.status(200).json(post);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Post not found' });
  }
}
