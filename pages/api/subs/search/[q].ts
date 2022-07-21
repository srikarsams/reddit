import { Sub } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '../../../../prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<Sub>[] | { error: string }>
) {
  if (req.method !== 'GET') {
    res.status(405).send({ error: 'Only GET requests allowed' });
    return;
  }

  try {
    const { q } = req.query;
    const subs = await fetchSubs(q as string);

    res.status(200).json(subs);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

async function fetchSubs(sub: string) {
  const subRes = await db.sub.findMany({
    where: {
      name: {
        startsWith: sub,
      },
    },
    select: {
      name: true,
    },
    take: 5,
  });
  return subRes;
}
