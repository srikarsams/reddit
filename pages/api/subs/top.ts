import { Sub } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '../../../prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Sub[] | { error: string }>
) {
  if (req.method !== 'GET') {
    res.status(405).send({ error: 'Only GET requests allowed' });
    return;
  }

  try {
    const { sub } = req.query;
    const subs = await fetchSubs(sub as string);

    subs.forEach((subRes) => {
      subRes.imageUrn = subRes.imageUrn
        ? `${process.env.APP_URL}/sub-images/${subRes.imageUrn}`
        : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    });

    res.status(200).json(subs);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

async function fetchSubs(sub: string) {
  const subRes = await db.sub.findMany({
    where: {
      name: sub as string,
    },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    take: 5,
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
  });
  return subRes;
}
