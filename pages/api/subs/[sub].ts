// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Sub, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '../../../prisma';
import { ArrayElement } from '../../../types';
import { fetchUserFromToken } from '../../../utils/fetch-user-from-token';
import { setUserVoteForPost } from '../../../utils/set-user-vote';
import { PostsWithVoteScore } from '../posts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Sub | { error: string }>
) {
  if (req.method !== 'GET') {
    res.status(405).send({ error: 'Only GET requests allowed' });
    return;
  }

  try {
    const { sub } = req.query;
    const user = await fetchUserFromToken(req);
    const subRes = await fetchSubs(sub as string, user as User);

    res.status(200).json(subRes);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

async function fetchSubs(sub: string, user: User) {
  const subRes = await db.sub.findUniqueOrThrow({
    where: {
      name: sub as string,
    },
    include: {
      posts: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          sub: true,
          votes: true,
          _count: {
            select: {
              comments: true,
              votes: true,
            },
          },
        },
      },
    },
  });

  // calculate the vote score for each post and remove votes data
  subRes.posts = subRes.posts.map((post) => {
    return setUserVoteForPost(post, user) as ArrayElement<PostsWithVoteScore>;
  });

  return subRes;
}

export type SubWithPosts = Awaited<ReturnType<typeof fetchSubs>>;
