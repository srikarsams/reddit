import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';

import { db } from '../prisma';

export const fetchUserFromToken = async (req: NextApiRequest) => {
  const { cookies } = req;

  if (!cookies.token) {
    return null;
  }

  const jwtPayload: any = jwt.verify(
    cookies.token,
    process.env.JWT_SECRET || ''
  );

  if (!jwtPayload?.username) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      username: jwtPayload.username,
    },
  });

  return user;
};
