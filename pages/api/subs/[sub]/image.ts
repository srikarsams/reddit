// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import cuid from 'cuid';
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';

import { db } from '../../../../prisma';
import { authCheck } from '../../../../utils/auth-check';
import { Sub } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Sub | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }
  try {
    const user = await authCheck(req, res);
    const subName = req.query.sub;
    const sub = await db.sub.findUniqueOrThrow({
      where: {
        name: subName as string,
      },
    });

    if (sub?.creatorName !== user?.username) {
      res.status(400).json({ error: 'You are not the owner of the repo' });
      return;
    }

    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      try {
        const subRes = await saveFile(
          files.file as formidable.File,
          fields,
          subName as string
        );

        // Delete older image if already exists
        if (fields.type === 'image' && sub.imageUrn) {
          fs.unlinkSync(`./public/sub-images/${sub.imageUrn}`);
        } else if (fields.type === 'banner' && sub.bannerUrn) {
          fs.unlinkSync(`./public/sub-images/${sub.bannerUrn}`);
        }

        return res.status(201).json(subRes);
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

const saveFile = async (
  file: formidable.File,
  fields: formidable.Fields,
  subName: string
) => {
  if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
    throw new Error(
      'Unsupported file format. Only jpegs and pngs are allowed.'
    );
  }

  if (fields.type !== 'image' && fields.type !== 'banner') {
    throw new Error('Invalid Type');
  }

  const data = fs.readFileSync(file.filepath);
  const extension = path.extname(file.originalFilename as string);
  const fileName = cuid() + extension;
  fs.writeFileSync(`./public/sub-images/${fileName}`, data);
  let sub: Sub;
  if (fields.type === 'image') {
    sub = await db.sub.update({
      where: {
        name: subName,
      },
      data: {
        imageUrn: fileName,
      },
    });
  } else {
    sub = await db.sub.update({
      where: {
        name: subName,
      },
      data: {
        bannerUrn: fileName,
      },
    });
  }

  await fs.unlinkSync(file.filepath);
  return sub;
};

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
