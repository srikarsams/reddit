// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@prisma/client';

import { authCheck } from '../../../utils/auth-check';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<User> | { error: string }>
) {
  if (req.method !== 'GET') {
    res.status(405).send({ error: 'Only GET requests allowed' });
    return;
  }

  try {
    const user = await authCheck(req, res);

    if (!user) {
      return;
    }

    res.status(200).json({ ...user, password: undefined });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
