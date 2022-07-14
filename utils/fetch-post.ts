import { db } from '../prisma';

export async function fetchPost(whereObj: {
  identifier?: string;
  slug?: string;
}) {
  return await db.post.findUniqueOrThrow({
    where: whereObj,
    include: {
      votes: true,
      comments: {
        include: {
          votes: true,
          _count: {
            select: {
              votes: true,
            },
          },
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });
}
