// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Post } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '../../../prisma';
import { ArrayElement } from '../../../types';
import { fetchUserFromToken } from '../../../utils/fetch-user-from-token';
import { setUserVoteForPost } from '../../../utils/set-user-vote';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ posts: Post[] } | { error: string }>
) {
  if (req.method !== 'GET') {
    res.status(405).send({ error: 'Only GET requests allowed' });
    return;
  }

  try {
    const user = await fetchUserFromToken(req);
    let posts = await fetchPosts();

    // calculate the vote score for each post and remove votes data
    posts = posts.map((post) => {
      return setUserVoteForPost(post, user) as ArrayElement<PostsWithVoteScore>;
    });

    res.status(200).json({ posts });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

async function fetchPosts() {
  return await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      sub: true,
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
    },
  });
}

export type PostsWithVoteScore = Awaited<ReturnType<typeof fetchPosts>>;
