/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import Head from 'next/head';
import useSWR from 'swr';

import {
  PostCard,
  PostWithVoteScoreAndUserVote,
} from '../components/post-card';

const Home: NextPage = () => {
  const { data: posts } = useSWR<{ posts: PostWithVoteScoreAndUserVote[] }>(
    '/api/posts'
  );

  return (
    <>
      <Head>Reddiit: the front page of the internet</Head>
      <div className="container flex pt-4">
        <div className="w-160">
          {posts?.posts?.map((post) => {
            return <PostCard post={post} key={post.id} />;
          })}
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
