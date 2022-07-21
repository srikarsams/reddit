// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Sub } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z, ZodError } from 'zod';

import { db } from '../../../prisma';
import { APIError, SubKeys } from '../../../types';
import { authCheck } from '../../../utils/auth-check';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Sub | { error: string } | APIError<typeof SubKeys>>
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

    const validated = SubPayloadValidator.parse(req.body);

    // if the incoming name already exists in other mixed small/uppercase, fail the request by
    // saying sub already exists
    const subByName: Sub[] =
      await db.$queryRaw`SELECT name FROM sub WHERE LOWER(name) = LOWER(${validated.name.toLowerCase()})`;

    if (
      subByName?.length &&
      subByName[0].name?.toLowerCase() === validated.name.toLowerCase()
    ) {
      res.status(400).json({ fieldErrors: { name: 'Sub already exists' } });
      return;
    }

    const sub = await db.sub.create({
      data: {
        ...validated,
        creator: {
          connect: {
            username: user.username,
          },
        },
      },
    });

    res.status(200).json(sub);
    return;
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(401).json(err.flatten());
      return;
    }
    res.status(500).json({ error: (err as Error).message });
  }
}

const SubPayloadValidator = z.object({
  name: z.string().min(1, { message: 'Sub name is missing' }),
  description: z.string().optional(),
  imageUrn: z.string().optional(),
  bannerUrn: z.string().optional(),
  title: z.string().min(1, { message: 'Title is missing' }),
});
