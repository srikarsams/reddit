import { Post, Sub } from '@prisma/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import useSWR from 'swr';

import { SideBar } from '../../../components/side-bar';

export default function SubmitPage() {
  const router = useRouter();
  const subName = router.query.sub;
  const { data: sub, error } = useSWR<Sub>(
    subName ? `/api/subs/${subName}` : null
  );

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  async function submitHandler(e: FormEvent) {
    e.preventDefault();

    if (!title || title.trim() === '') return;

    try {
      const res: Post = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          subName: sub?.name,
        }),
      }).then((res) => res.json());
      if (res.id) router.push(`/r/${subName}/${res.slug}`);
    } catch (error) {
      console.log(error);
    }
  }
  if (!sub) return null;
  if (error) {
    return (
      <h1 className="text-xl font-bold text-gray-800">Something went wrong</h1>
    );
  }
  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to Reddiit</title>
      </Head>
      <div className="w-160">
        <div className="rounded bg-white p-4">
          <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>

          <form onSubmit={submitHandler}>
            <div className="relative mb-2">
              <input
                type="text"
                maxLength={300}
                placeholder="Post title"
                className="w-full rounded border border-gray-300 px-3 py-2 pr-16 focus:border-gray-600 focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p
                className="absolute mb-2 select-none text-sm text-gray-500"
                style={{ top: '11px', right: '10px' }}
              >
                {title.trim().length}/300
              </p>
            </div>
            <textarea
              placeholder="Post body (Optional)"
              className="mt-4 w-full rounded border border-gray-300 px-3 py-2 focus:border-gray-600 focus:outline-none"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="blue button mt-2 px-3 py-1 text-sm"
                type={'submit'}
                disabled={title.trim().length === 0}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <SideBar sub={sub as Sub} />
    </div>
  );
}
