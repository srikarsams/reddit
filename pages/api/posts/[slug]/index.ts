import { Post, Sub } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PostsWithVoteScore } from '..';

import { db } from '../../../../prisma';
import { ArrayElement } from '../../../../types';
import { fetchUserFromToken } from '../../../../utils/fetch-user-from-token';
import { setUserVoteForPost } from '../../../../utils/set-user-vote';

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
    const user = await fetchUserFromToken(req);
    const post = await db.post.findUniqueOrThrow({
      where: {
        slug: slug as string,
      },
      include: {
        sub: true,
        votes: true,
        comments: true,
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
      },
    });

    post.sub.imageUrn = post.sub.imageUrn
      ? `${process.env.APP_URL}/sub-images/${post.sub.imageUrn}`
      : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    post.sub.bannerUrn = post.sub.bannerUrn
      ? `${process.env.APP_URL}/sub-images/${post.sub.bannerUrn}`
      : post.sub.bannerUrn;

    const postWithVote = setUserVoteForPost(post, user);

    res.status(200).json(postWithVote);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Post not found' });
  }
}
