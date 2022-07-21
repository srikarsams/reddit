import { Sub } from '@prisma/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

import { useAuthState } from '../../components/context';
import { APIError, SubKeys } from '../../types';

export default function CreateSubPage() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [{ fieldErrors }, setErrors] = useState<APIError<typeof SubKeys>>({
    fieldErrors: {},
  });

  const router = useRouter();
  const { authenticated, loading } = useAuthState();

  async function formHandler(e: FormEvent) {
    e.preventDefault();

    try {
      const res: Sub | APIError<typeof SubKeys> = await fetch(
        '/api/subs/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, title, description }),
        }
      ).then((res) => res.json());

      if ((res as Sub).name) {
        router.push(`/r/${(res as Sub).name}`);
      } else {
        setErrors(res as APIError<typeof SubKeys>);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!authenticated && !loading) {
      router.replace('/login');
    }
  }, [authenticated, router, loading]);

  return (
    <div className="flex bg-white">
      <Head>
        <title>Create a Community</title>
      </Head>
      <div className="h-screen w-20 bg-register-background bg-center md:w-36"></div>
      <div className="flex flex-col justify-center p-2 sm:pl-6 sm:pr-0">
        <div className="w-98">
          <h1 className="mb-2 text-lg font-medium">Create a Community</h1>
          <hr />
          <form onSubmit={formHandler}>
            <div className="my-6">
              <p className="font-medium">Name</p>
              <p className="mb-2 text-xs text-gray-500">
                Community names including capitalization cannot be changed
              </p>
              <input
                type="text"
                className={`w-full rounded border border-gray-300 p-3 hover:border-gray-500 ${
                  fieldErrors?.name ? 'border-red-600' : ''
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {fieldErrors?.name ? (
                <small className="font-medium text-red-600">
                  {fieldErrors.name}
                </small>
              ) : null}
            </div>

            <div className="my-6">
              <p className="font-medium">Title</p>
              <p className="mb-2 text-xs text-gray-500">
                Community title representing the topic of the community
              </p>
              <input
                type="text"
                className={`w-full rounded border border-gray-300 p-3 hover:border-gray-500 ${
                  fieldErrors?.title ? 'border-red-600' : ''
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {fieldErrors?.title ? (
                <small className="font-medium text-red-600">
                  {fieldErrors.title}
                </small>
              ) : null}
            </div>

            <div className="my-6">
              <p className="font-medium">Description</p>
              <p className="mb-2 text-xs text-gray-500">
                This is how members come to understand your community
              </p>
              <textarea
                className={`w-full rounded border border-gray-300 p-3 hover:border-gray-500 ${
                  fieldErrors?.description ? 'border-red-600' : ''
                }`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {fieldErrors?.description ? (
                <small className="font-medium text-red-600">
                  {fieldErrors.description}
                </small>
              ) : null}
            </div>

            <div className="flex justify-end">
              <button className="blue button px-4 py-2" type="submit">
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
