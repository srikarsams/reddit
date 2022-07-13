/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Post } from '@prisma/client';

dayjs.extend(relativeTime);

const Home: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<{ error: string } | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const api_res: { posts: Post[] } | { error: string } = await fetch(
          '/api/posts'
        ).then((res) => res.json());
        if ((api_res as { posts: Post[] })?.posts) {
          setPosts((api_res as { posts: Post[] }).posts);
        } else {
          setError(api_res as { error: string });
        }
      } catch (err) {
        console.log('something went wrong');
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="pt-12">
      <Head>Reddiit: the front page of the internet</Head>
      <div className="container flex pt-4">
        <div className="w-160">
          {posts.map((post) => {
            return (
              <div className="mb-4 flex rounded bg-white" key={post.id}>
                <div className="w-10 rounded-l bg-gray-200 text-center">
                  <p>V</p>
                </div>

                <div className="flex flex-grow flex-col p-2">
                  <div className="flex items-center">
                    <Link href={`/r/${post.subName}`}>
                      <img
                        src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                        alt="avatar"
                        className="mr-1 h-4 w-4 cursor-pointer rounded-full"
                      />
                    </Link>
                    <Link href={`/r/${post.subName}`}>
                      <a className="text-xs font-bold hover:underline">
                        /r/{post.subName}
                      </a>
                    </Link>
                    <p className="text-xs text-gray-500">
                      <span className="mx-1">•</span>Posted by{' '}
                      <Link href={`/u/${post.authorName}`}>
                        <a className="hover:underline">/u/{post.authorName}</a>
                      </Link>
                      <Link href={`/r/${post.subName}/${post.slug}`}>
                        <a className="mx-1 hover:underline">
                          {dayjs(post.createdAt).fromNow()}
                        </a>
                      </Link>
                    </p>
                  </div>
                  <Link href={`/r/${post.subName}/${post.slug}`}>
                    <a className="my-1 text-lg font-medium text-black">
                      {post.title}
                    </a>
                  </Link>
                  {post.body ? (
                    <p className="my-1 text-sm text-gray-500">{post.body}</p>
                  ) : null}
                  <div className="flex items-center">
                    <Link href={`/r/${post.subName}/${post.slug}`}>
                      <a>
                        <div className="mr-1 flex cursor-pointer items-center rounded p-1 px-2 text-gray-500 hover:bg-gray-200">
                          <i className="fas fa-comment-alt fa-xs"></i>
                          <span className="ml-1 text-sm font-semibold">
                            120 Comments
                          </span>
                        </div>
                      </a>
                    </Link>
                    <div className="mr-1 flex cursor-pointer items-center rounded p-1 px-2 text-gray-500 hover:bg-gray-200">
                      <i className="fas fa-share fa-xs"></i>
                      <span className="ml-1 text-sm font-semibold">Share</span>
                    </div>
                    <div className="mr-1 flex cursor-pointer items-center rounded p-1 px-2 text-gray-500 hover:bg-gray-200">
                      <i className="fas fa-bookmark fa-xs"></i>
                      <span className="ml-1 text-sm font-semibold">Save</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
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
