/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Head from 'next/head';

import { PostCard } from '../components/post-card';
import { PostsWithVoteScore } from './api/posts';

const Home: NextPage = () => {
  const [posts, setPosts] = useState<PostsWithVoteScore>([]);
  const [error, setError] = useState<{ error: string } | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const api_res: { posts: PostsWithVoteScore } | { error: string } =
          await fetch('/api/posts').then((res) => res.json());
        if ((api_res as { posts: PostsWithVoteScore })?.posts) {
          setPosts((api_res as { posts: PostsWithVoteScore }).posts);
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
            return <PostCard post={post} key={post.id} />;
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
