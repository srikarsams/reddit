// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Post } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import slugify from 'slugify';
import { z } from 'zod';

import { db } from '../../../prisma';
import { authCheck } from '../../../utils/auth-check';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | { error: string }>
) {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Only POST requests allowed' });
    return;
  }

  try {
    const user = await authCheck(req, res);
    if (!user) {
      return;
    }

    const validated = PostPayloadValidator.parse(req.body);
    const slug = slugify(validated.title, {
      lower: true,
    });

    const post = await db.post.create({
      data: {
        title: validated.title,
        body: validated.body,
        slug,
        author: {
          connect: {
            username: user.username,
          },
        },
        sub: {
          connect: {
            name: validated.subName,
          },
        },
      },
    });

    res.status(200).json(post);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

const PostPayloadValidator = z.object({
  title: z.string().min(1, { message: 'Title is missing' }),
  body: z.string().optional(),
  subName: z.string().min(1, { message: 'subname is missing' }),
});
