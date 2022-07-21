import { Sub } from '@prisma/client';
import type { NextPage } from 'next';
import Head from 'next/head';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';

import {
  PostCard,
  PostWithVoteScoreAndUserVote,
} from '../components/post-card';
import { useAuthState } from '../components/context';

const Home: NextPage = () => {
  const { data: posts } = useSWR<{ posts: PostWithVoteScoreAndUserVote[] }>(
    '/api/posts'
  );
  const { data: topSubs } =
    useSWR<(Sub & { _count: { posts: number } })[]>('/api/subs/top');

  const { authenticated } = useAuthState();

  return (
    <>
      <Head>Reddiit: the front page of the internet</Head>
      <div className="container flex flex-col pt-4 md:flex-row">
        <div className="mx-auto basis-160 px-3 md:m-0 md:px-0">
          {posts?.posts?.map((post) => {
            return <PostCard post={post} key={post.id} />;
          })}
        </div>
        <div className="px-3 md:ml-6 md:basis-80 md:px-0">
          <div className="rounded bg-white">
            <div className="border-b-2 p-4">
              <p className="text-center text-lg font-semibold">
                Top Communities
              </p>
            </div>
            {topSubs?.map((sub) => (
              <div
                className="flex items-center border-b px-4 py-2 text-xs"
                key={sub.id}
              >
                <Link href={`/r/${sub.name}`}>
                  <a>
                    <Image
                      src={sub.imageUrn as string}
                      alt="Sub"
                      width={(6 * 16) / 4}
                      height={(6 * 16) / 4}
                      className="cursor-pointer rounded-full"
                    />
                  </a>
                </Link>
                <Link href={`/r/${sub.name}`}>
                  <a className="ml-2 font-bold">r/{sub.name}</a>
                </Link>
                <p className="font-med ml-auto">{sub?._count?.posts}</p>
              </div>
            ))}
            {authenticated ? (
              <div className="border-t-2 p-4">
                <Link href="/subs/create">
                  <a className="button blue w-full px-2 py-2">
                    Create community
                  </a>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

// export const getServerSideProps = async (context: AppContext) => {
//   try {
//     const api_res: { posts: Post[] } | { error: string } = await fetch(
//       'http://localhost:3000/api/posts'
//     ).then((res) => res.json());

//     if ((api_res as { posts: Post[] })?.posts) {
//       return { props: api_res as { posts: Post[] } };
//     }

//     return { props: { error: (api_res as { error: string })?.error } };
//   } catch (err) {
//     console.log(err);
//     return { props: { error: 'something went wrong' } };
//   }
// };
