import { User } from '@prisma/client';
import dayjs from 'dayjs';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  PostCard,
  PostWithVoteScoreAndUserVote,
} from '../../components/post-card';

export default function UserPage() {
  const router = useRouter();
  const username = router.query.username;

  const { data, error } = useSWR<
    | { posts: PostWithVoteScoreAndUserVote[]; user: Partial<User> }
    | { error: string }
  >(username ? `/api/user/${username}` : null);

  if (error || (data as { error: string })?.error) {
    return (
      <h1 className="mt-8 text-center text-xl font-bold text-gray-800">
        Something went wrong
      </h1>
    );
  }

  if (
    !data ||
    !(data as { posts: PostWithVoteScoreAndUserVote[] }).posts ||
    !(data as { posts: PostWithVoteScoreAndUserVote[] }).posts.length
  )
    return <h1 className="mt-8 text-xl font-bold text-gray-800">No posts</h1>;

  return (
    <div className="container flex flex-col pt-5 md:flex-row">
      <Head>
        <title>{username}</title>
      </Head>
      <div className="order-2 mx-auto mt-4 basis-160 px-3 md:order-1 md:m-0 md:mt-0 md:px-0">
        {(data as { posts: PostWithVoteScoreAndUserVote[] }).posts.map(
          (post) => (
            <PostCard post={post} key={post.id} />
          )
        )}
      </div>
      <div className="order-1 px-3 md:order-2 md:ml-6 md:basis-80 md:px-0">
        <div className="rounded bg-white">
          <div className="flex justify-center rounded-t bg-blue-500 p-3">
            <Image
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              alt={'user profile image'}
              width={64}
              height={64}
              className="inline-block rounded-full border border-white"
            />
          </div>
          <div className="p-3 text-center">
            <h1 className="mb-4 text-xl">{username}</h1>
            <hr />
            <p className="mt-3">
              Joined{' '}
              {dayjs((data as { user: User })?.user.createdAt).format(
                'MMM YYYY'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
