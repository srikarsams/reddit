/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { ArrayElement } from '../../../types';
import { PostsWithVoteScore } from '../../api/posts';
import { useAuthState } from '../../../components/context';
import { SideBar } from '../../../components/side-bar';
import { ActionButton } from '../../../components/action-button';

dayjs.extend(relativeTime);

export default function PostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { authenticated } = useAuthState();

  const { data: post, error } = useSWR<
    ArrayElement<PostsWithVoteScore> & { userVote: number }
  >(slug ? `/api/posts/${slug}` : null);
  const { mutate } = useSWRConfig();

  const postUrl = post ? `/r/${post.subName}/${post.slug}` : '';

  const voteHandler = async (id: string, value: number) => {
    try {
      if (!authenticated) router.push('/login');

      if (value === post?.userVote) {
        value = 0;
      }
      await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: id, value }),
      }).then((res) => res.json());
      mutate(`/api/posts/${slug}`);
    } catch (error) {}
  };

  if (error) {
    return (
      <h1 className="text-xl font-bold text-gray-800">Something went wrong</h1>
    );
  }

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <Link href={`/r/${post?.subName}`}>
        <a>
          <div className="flex h-20 w-full items-center bg-blue-500">
            <div className="container flex items-center">
              {post && (
                <div className="mr-2 flex items-center rounded-full">
                  <Image
                    src={post.sub.imageUrn as string}
                    alt={'Sub image'}
                    width={(8 * 16) / 3}
                    className="rounded-full"
                    height={(8 * 16) / 3}
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">
                /r/{post?.subName}
              </p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        <div className="w-160">
          <div className="rounded bg-white">
            {post && (
              <div className="flex">
                <div className="w-10 flex-shrink-0 rounded-l text-center">
                  <div
                    className={`mx-auto w-6 cursor-pointer rounded text-gray-400 hover:bg-gray-300 hover:text-red-500 ${
                      post.userVote === 1 ? `text-red-500` : ''
                    }`}
                    onClick={() => voteHandler(post.identifier, 1)}
                  >
                    <i className="icon-arrow-up"></i>
                  </div>
                  <p className="text-xs font-bold">{post._count.votes}</p>
                  <div
                    className={`mx-auto w-6 cursor-pointer rounded text-gray-400 hover:bg-gray-300 hover:text-blue-600 ${
                      post.userVote === -1 ? `text-blue-600` : ''
                    }`}
                    onClick={() => voteHandler(post.identifier, -1)}
                  >
                    <i className="icon-arrow-down"></i>
                  </div>
                </div>
                <div className="p-2">
                  <div className="flex items-center">
                    <p className="text-xs text-gray-500">
                      Posted by{' '}
                      <Link href={`/u/${post.authorName}`}>
                        <a className="hover:underline">/u/{post.authorName}</a>
                      </Link>
                      <Link href={postUrl}>
                        <a className="mx-1 hover:underline">
                          {dayjs(post.createdAt).fromNow()}
                        </a>
                      </Link>
                    </p>
                  </div>
                  <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                  <p className="my-3 text-sm">{post.body}</p>
                  <div className="flex items-center">
                    <ActionButton negativeMargin>
                      <i className="fas fa-comment-alt fa-xs"></i>
                      <span className="ml-1 text-sm font-semibold">
                        {post._count.comments}{' '}
                        {post._count.comments === 1 ? 'Comment' : 'Comments'}
                      </span>
                    </ActionButton>
                    <ActionButton>
                      <i className="fas fa-share fa-xs"></i>
                      <span className="ml-1 text-sm font-semibold">Share</span>
                    </ActionButton>
                    <ActionButton>
                      <i className="fas fa-bookmark fa-xs"></i>
                      <span className="ml-1 text-sm font-semibold">Save</span>
                    </ActionButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {post ? <SideBar sub={post.sub} /> : null}
      </div>
    </>
  );
}
