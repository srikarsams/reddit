// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@prisma/client';

import { z, ZodError } from 'zod';
import { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import { db } from '../../../prisma';
import { APIError } from '../../../types';

import { transformZodError } from '../../../utils/zod-error-transformer';

const LoginPayloadValidator = z.object({
  username: z.string().min(1, { message: 'Username is missing' }),
  password: z.string().min(1, { message: 'Password is missing' }),
});

function validateRequestBody(data: User) {
  return LoginPayloadValidator.parse(data);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<User> | APIError>
) {
  if (req.method !== 'POST') {
    res.status(405).send({ errors: { form: 'Only POST requests allowed' } });
    return;
  }

  try {
    const validated = validateRequestBody(req.body);

    let user: User | null = await db.user.findUnique({
      where: {
        username: validated.username,
      },
    });

    // if user is not found
    if (!user) {
      res.status(404).json({
        errors: {
          username: "Username doesn't exist",
        },
      });
      return;
    }

    // if the password doen't match with the one in DB
    if (!compareSync(validated.password, user.password)) {
      res.status(401).json({
        errors: {
          password: 'Invalid password',
        },
      });
      return;
    }

    // Generates the token and sets the token in the res object
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET || ''
    );
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      })
    );
    res.status(200).json({
      ...user,
      password: undefined,
    });
    return;
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(401).json(transformZodError(err));
      return;
    }
    res.status(500).json({ errors: { form: (err as Error).message } });
  }
}
