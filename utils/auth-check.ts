import type { User } from '@prisma/client';

import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import { db } from '../prisma';

export const authCheck = async (req: NextApiRequest, res: NextApiResponse) => {
  const { cookies } = req;
  if (!cookies.token) {
    res.status(401).json({ error: 'Unauthenticated' });
    return;
  }

  const jwtPayload: any = jwt.verify(
    cookies.token,
    process.env.JWT_SECRET || ''
  );

  if (!jwtPayload?.username) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  const user = await db.user.findUnique({
    where: {
      username: jwtPayload.username,
    },
  });

  if (!user) {
    res.status(401).json({ error: 'user not found' });
    return;
  }

  return user;
};
