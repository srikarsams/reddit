// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@prisma/client';

import { z, ZodError } from 'zod';
import { hashSync } from 'bcrypt';

import { db } from '../../../prisma';

const saltRounds = 10;

const UserValidator = z.object({
  username: z
    .string()
    .min(3, { message: 'username must be min. 3 characters long' }),
  lastname: z
    .string()
    .min(3, { message: 'lastname must be min. 3 characters long' })
    .optional()
    .nullable(),
  firstname: z
    .string()
    .min(3, { message: 'firstname must be 3 characters long' })
    .optional()
    .nullable(),
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(6, { message: 'password must be 6 characters long' })
    .max(24, { message: 'Password crossed 24 characters' }),
});

function validateRequestBody(data: User) {
  return UserValidator.parse(data);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | Partial<User>
    | { message: string; path?: string[] }
    | { error: ZodError | string }
  >
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  try {
    const validated = validateRequestBody(req.body);

    let userByUsername: User | null = await db.user.findUnique({
      where: {
        username: validated.username,
      },
    });

    if (userByUsername) {
      res.status(401).json({
        message: 'Username already exists',
        path: ['username'],
      });
      return;
    }

    let userByEmail: User | null = await db.user.findUnique({
      where: {
        email: validated.email,
      },
    });

    if (userByEmail) {
      res
        .status(401)
        .json({ message: 'Email already exists', path: ['email'] });
      return;
    }

    validated.password = hashSync(validated.password, saltRounds);

    const user = await db.user.create({
      data: validated,
      select: {
        username: true,
        firstname: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        id: true,
      },
    });

    res.status(200).json(user);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(401).json({ error: err });
      return;
    }
    res.status(500).json({ error: (err as Error).message });
  }
}
