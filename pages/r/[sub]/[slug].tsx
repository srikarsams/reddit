/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Comment, CommentVote } from '@prisma/client';
import { FormEvent, useState } from 'react';

import { ArrayElement } from '../../../types';
import { PostsWithVoteScore } from '../../api/posts';
import { useAuthState } from '../../../components/context';
import { SideBar } from '../../../components/side-bar';
import { ActionButton } from '../../../components/action-button';

dayjs.extend(relativeTime);

export default function PostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { authenticated, user } = useAuthState();
  const [commentText, setCommentText] = useState('');

  const { data: post, error } = useSWR<
    ArrayElement<PostsWithVoteScore> & {
      userVote: number;
      comments: (Comment & {
        userVote: number;
        votes: CommentVote[];
        _count: {
          votes: number;
        };
      })[];
    }
  >(slug ? `/api/posts/${slug}` : null);
  const { mutate } = useSWRConfig();

  const postUrl = post ? `/r/${post.subName}/${post.slug}` : '';

  const voteHandler = async (
    id: string,
    value: number,
    comment?: { userVote: number }
  ) => {
    try {
      if (!authenticated) router.push('/login');

      if (
        (!comment && value === post?.userVote) ||
        (comment && value === comment?.userVote)
      ) {
        value = 0;
      }
      await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: !comment ? id : undefined,
          value,
          commentId: comment ? id : undefined,
        }),
      }).then((res) => res.json());
      mutate(`/api/posts/${slug}`);
    } catch (error) {}
  };

  async function submitComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await fetch(`/api/posts/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postSlug: slug, body: commentText }),
      });
      setCommentText('');
      mutate(`/api/posts/${slug}`);
    } catch (error) {
      console.log(error);
    }
  }
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
          <div className="flex h-20 w-full items-center bg-blue-500 pl-2 sm:pl-0">
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
      <div className="container flex flex-col pt-5 md:flex-row">
        <div className="order-2 mx-auto mt-4 basis-160 px-3 md:order-1 md:m-0 md:mt-0 md:px-0">
          <div className="rounded bg-white">
            {post && (
              <>
                <div className="flex">
                  {/* Post Vote section */}
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
                  {/* Post Meta data */}
                  <div className="py-2 pr-2">
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500">
                        Posted by{' '}
                        <Link href={`/u/${post.authorName}`}>
                          <a className="hover:underline">
                            /u/{post.authorName}
                          </a>
                        </Link>
                        <Link href={postUrl}>
                          <a className="mx-1 hover:underline">
                            {dayjs(post.createdAt).fromNow()}
                          </a>
                        </Link>
                      </p>
                    </div>
                    {/* Post Title */}
                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                    {/* Post Description */}
                    <p className="my-3 text-sm">{post.body}</p>
                    {/* Action Buttons */}
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
                        <span className="ml-1 text-sm font-semibold">
                          Share
                        </span>
                      </ActionButton>
                      <ActionButton>
                        <i className="fas fa-bookmark fa-xs"></i>
                        <span className="ml-1 text-sm font-semibold">Save</span>
                      </ActionButton>
                    </div>
                  </div>
                </div>
                {/* Comment Input */}
                <div className="mb-4 pl-10 pr-6">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        Comment as{' '}
                        <Link href={`/u/${user?.username}`}>
                          <a className="font-semibold text-blue-500 ">
                            u/{user?.username}
                          </a>
                        </Link>
                      </p>
                      <form onSubmit={submitComment}>
                        <textarea
                          className="w-full rounded border border-gray-300 p-3 focus:border-gray-600 focus:outline-none"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <div className="flex justify-end">
                          <button
                            className="blue button px-3 py-2"
                            disabled={!commentText}
                          >
                            Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between rounded border border-gray-300 px-2 py-4">
                      <p className="font-semibold text-gray-400">
                        Login or Signup to leave a comment
                      </p>
                      <div className="mx-auto mt-2 lg:m-0">
                        <Link href="/login">
                          <a className="blue button mr-4 px-4 py-1 outline">
                            Login
                          </a>
                        </Link>
                        <Link href="/register">
                          <a className="blue button px-4 py-1">Sign Up</a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <hr />
                {/* Comments Section */}
                {post.comments.length ? (
                  <div className="">
                    {post.comments.map((comment) => {
                      return (
                        <div className="flex" key={comment.id}>
                          {/* Vote section */}
                          <div className="w-10 flex-shrink-0 rounded-l py-2 text-center">
                            <div
                              className={`mx-auto w-6 cursor-pointer rounded text-gray-400 hover:bg-gray-300 hover:text-red-500 ${
                                comment.userVote === 1 ? `text-red-500` : ''
                              }`}
                              onClick={() =>
                                voteHandler(comment.id, 1, comment)
                              }
                            >
                              <i className="icon-arrow-up"></i>
                            </div>
                            <p className="text-xs font-bold">
                              {comment._count.votes}
                            </p>
                            <div
                              className={`mx-auto w-6 cursor-pointer rounded text-gray-400 hover:bg-gray-300 hover:text-blue-600 ${
                                comment.userVote === -1 ? `text-blue-600` : ''
                              }`}
                              onClick={() =>
                                voteHandler(comment.id, -1, comment)
                              }
                            >
                              <i className="icon-arrow-down"></i>
                            </div>
                          </div>
                          <div className="py-2 pr-2">
                            <p className="mb-1 text-xs leading-none">
                              <Link href={`/u/${comment.authorName}`}>
                                <a className="mr-1 font-bold hover:underline">
                                  u/{comment.authorName}
                                </a>
                              </Link>
                              <span className="text-gray-600">{`
                                ${comment._count.votes}
                                points • 
                                ${dayjs(comment.createdAt).fromNow()}
                              `}</span>
                            </p>
                            <p>{comment.body}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
        {post ? <SideBar sub={post.sub} /> : null}
      </div>
    </>
  );
}
