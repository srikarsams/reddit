/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NextRouter, useRouter } from 'next/router';

import { ActionButton } from '../action-button';
import { ArrayElement } from '../../types';
import { PostsWithVoteScore } from '../../pages/api/posts';
import { useAuthState } from '../context';
import { KeyedMutator } from 'swr';

dayjs.extend(relativeTime);

const voteHandler = async (
  id: string,
  value: number,
  authenticated: boolean,
  router: NextRouter,
  mutate?: KeyedMutator<PostWithVoteScoreAndUserVote[][]>
) => {
  if (!authenticated) router.push('/login');
  try {
    await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId: id, value }),
    });
    if (mutate) mutate();
  } catch (error) {
    console.log(error);
  }
};

export type PostWithVoteScoreAndUserVote = ArrayElement<PostsWithVoteScore> & {
  userVote: number;
};

export function PostCard({
  post,
  mutate,
}: {
  post: PostWithVoteScoreAndUserVote;
  mutate?: KeyedMutator<PostWithVoteScoreAndUserVote[][]>;
}) {
  const { authenticated } = useAuthState();
  const router = useRouter();
  const postUrl = `/r/${post.subName}/${post.slug}`;

  return (
    <div className="mb-4 flex rounded bg-white" id={post.identifier}>
      <div className="w-10 flex-shrink-0 rounded-l bg-gray-200 text-center">
        <div
          className={`mx-auto w-6 cursor-pointer rounded text-gray-400 hover:bg-gray-300 hover:text-red-500 ${
            post.userVote === 1 ? `text-red-500` : ''
          }`}
          onClick={() =>
            voteHandler(
              post.identifier,
              1 === post.userVote ? 0 : 1,
              authenticated,
              router,
              mutate
            )
          }
        >
          <i className="icon-arrow-up"></i>
        </div>
        <p className="text-xs font-bold">{post._count.votes}</p>
        <div
          className={`mx-auto w-6 cursor-pointer rounded text-gray-400 hover:bg-gray-300 hover:text-blue-600 ${
            post.userVote === -1 ? `text-blue-600` : ''
          }`}
          onClick={() =>
            voteHandler(
              post.identifier,
              -1 === post.userVote ? 0 : -1,
              authenticated,
              router,
              mutate
            )
          }
        >
          <i className="icon-arrow-down"></i>
        </div>
      </div>

      <div className="flex flex-grow flex-col p-2">
        <div className="flex items-center">
          {!router.pathname.includes('/r/') ? (
            <>
              <Link href={`/r/${post.subName}`}>
                <img
                  src={post.sub.imageUrn || ''}
                  alt="avatar"
                  className="mr-1 h-4 w-4 cursor-pointer rounded-full"
                />
              </Link>
              <Link href={`/r/${post.subName}`}>
                <a className="text-xs font-bold hover:underline">
                  /r/{post.subName}
                </a>
              </Link>
            </>
          ) : null}
          <p className="text-xs text-gray-500">
            {!router.pathname.includes('/r/') ? (
              <span className="mx-1">•</span>
            ) : null}
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
        <Link href={postUrl}>
          <a className="my-1 text-lg font-medium text-black">{post.title}</a>
        </Link>
        {post.body ? (
          <p className="my-1 text-sm text-gray-500">{post.body}</p>
        ) : null}
        <div className="flex items-center">
          <Link href={postUrl}>
            <a>
              <ActionButton negativeMargin>
                <i className="fas fa-comment-alt fa-xs"></i>
                <span className="ml-1 text-sm font-semibold">
                  {post._count.comments}{' '}
                  {post._count.comments === 1 ? 'Comment' : 'Comments'}
                </span>
              </ActionButton>
            </a>
          </Link>
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
  );
}
