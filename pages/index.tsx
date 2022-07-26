import { Sub } from '@prisma/client';
import type { NextPage } from 'next';
import Head from 'next/head';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import {
  PostCard,
  PostWithVoteScoreAndUserVote,
} from '../components/post-card';
import { useAuthState } from '../components/context';
import { observeTargetElement } from '../utils/observer';
import { LinkButton } from '../components/button';
import { Loader } from '../components/loader';

const Home: NextPage = () => {
  const { data: topSubs } =
    useSWR<(Sub & { _count: { posts: number } })[]>('/api/subs/top');

  const {
    data,
    error,
    setSize: setPage,
    isValidating,
    mutate,
  } = useSWRInfinite<PostWithVoteScoreAndUserVote[]>(
    (index) => `/api/posts?page=${index}`
  );
  const posts = useMemo(
    () => (data ? ([] as PostWithVoteScoreAndUserVote[]).concat(...data) : []),
    [data]
  );
  const isInitialLoading = !data && !error;

  const { authenticated } = useAuthState();
  const [targetPost, setTargetPost] = useState('');
  const incrementPage = () => setPage((page) => page + 1);

  useEffect(() => {
    if (!posts || !posts.length) return;
    const id = posts[posts.length - 1].identifier;
    if (id !== targetPost) setTargetPost(id);
  }, [posts, targetPost]);

  useEffect(() => {
    const element = document.getElementById(targetPost);
    if (!element) return;
    observeTargetElement(element, incrementPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPage, targetPost]);

  return (
    <>
      <Head>
        <title>Reddiit: the front page of the internet</title>
      </Head>
      <div className="container flex flex-col pt-4 md:flex-row">
        <div className="mx-auto basis-160 px-3 md:m-0 md:px-0">
          {isInitialLoading ? <Loader /> : null}
          {posts?.map((post) => {
            return <PostCard post={post} key={post.id} mutate={mutate} />;
          })}
          {isValidating && posts.length ? <Loader /> : null}
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
                <p className="ml-auto font-medium">{sub?._count?.posts}</p>
              </div>
            ))}
            {authenticated ? (
              <div className="border-t-2 p-4">
                <Link href="/subs/create">
                  <LinkButton theme="primary" customClass="w-full p-2">
                    Create community
                  </LinkButton>
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
