import { Sub } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import {
  PostCard,
  PostWithVoteScoreAndUserVote,
} from '../../components/post-card';

export default function SubPage() {
  const router = useRouter();

  const subName = router.query.sub;
  const { data } = useSWR(subName ? `/api/subs/${subName}` : null);

  if (!data.posts) {
    return <div className="text-center text-lg">No posts...</div>;
  }

  return (
    <div className="container flex pt-5">
      {data && (
        <div className="w-160">
          {data.posts.map((post: PostWithVoteScoreAndUserVote) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      )}
    </div>
  );
}
