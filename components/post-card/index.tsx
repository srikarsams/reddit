/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Post } from '@prisma/client';

import { ActionButton } from '../action-button';

dayjs.extend(relativeTime);

export function PostCard({ post }: { post: Post }) {
  const postUrl = `/r/${post.subName}/${post.slug}`;
  return (
    <div className="mb-4 flex rounded bg-white">
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
              <ActionButton>
                <i className="fas fa-comment-alt fa-xs"></i>
                <span className="ml-1 text-sm font-semibold">120 Comments</span>
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
