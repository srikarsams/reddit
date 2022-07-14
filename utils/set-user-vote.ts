import { User } from '@prisma/client';
import { PostsWithVoteScore } from '../pages/api/posts';
import { ArrayElement } from '../types';

import { fetchPost } from './fetch-post';

// sets userVote for post and it's associated comments
export function setUserVote(
  post: Awaited<ReturnType<typeof fetchPost>>,
  user: User | null
) {
  const newPost = setUserVoteForPost(post, user);

  // calculate the vote score for each comment and remove votes data from each comment
  const comments = post.comments.map((comment) => {
    comment._count.votes = comment.votes.reduce(
      (acc, initial) => acc + initial.value,
      0
    );

    // check whether this user has voted the comment
    const commentUserVoteIndex = user
      ? comment.votes.findIndex((vote) => vote.username === user.username)
      : -2;

    const commentUserVote =
      commentUserVoteIndex > -1 ? comment.votes[commentUserVoteIndex].value : 0;
    comment.votes = [];
    return { ...comment, userVote: commentUserVote };
  });

  post.votes = [];
  return { ...newPost, comments };
}

export function setUserVoteForPost(
  post:
    | Awaited<ReturnType<typeof fetchPost>>
    | ArrayElement<PostsWithVoteScore>,
  user: User | null
) {
  // calculate the vote score for each post and remove votes data for post
  post._count.votes = post.votes.reduce(
    (acc, initial) => acc + initial.value,
    0
  );

  // check whether this user has voted the post
  const userVoteIndex = user
    ? post.votes.findIndex((vote) => vote.username === user.username)
    : -2;
  const userVote = userVoteIndex > -1 ? post.votes[userVoteIndex].value : 0;
  return { ...post, userVote };
}
