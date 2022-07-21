// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Post } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '../../../prisma';
import { ArrayElement } from '../../../types';
import { fetchUserFromToken } from '../../../utils/fetch-user-from-token';
import { setUserVoteForPost } from '../../../utils/set-user-vote';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[] | { error: string }>
) {
  if (req.method !== 'GET') {
    res.status(405).send({ error: 'Only GET requests allowed' });
    return;
  }

  try {
    const page = parseInt((req.query.page || 0) as string);
    const count = parseInt((req.query.count || 8) as string);
    const user = await fetchUserFromToken(req);
    let posts = await fetchPosts(page, count);

    // calculate the vote score for each post and remove votes data
    posts = posts.map((post) => {
      const newPost = setUserVoteForPost(
        post,
        user
      ) as ArrayElement<PostsWithVoteScore>;
      newPost.sub.imageUrn = newPost.sub.imageUrn
        ? `${process.env.APP_URL}/sub-images/${newPost.sub.imageUrn}`
        : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
      return newPost;
    });

    res.status(200).json(posts);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

async function fetchPosts(page: number, count: number) {
  return await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    skip: count * page,
    take: count,
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
