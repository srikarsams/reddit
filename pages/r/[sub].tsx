import { Sub } from '@prisma/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import { ChangeEvent, createRef, useEffect, useState } from 'react';
import Image from 'next/image';

import {
  PostCard,
  PostWithVoteScoreAndUserVote,
} from '../../components/post-card';
import { SideBar } from '../../components/side-bar';
import { useAuthState } from '../../components/context';

export default function SubPage() {
  const router = useRouter();
  const fileRef = createRef<HTMLInputElement>();
  const { user } = useAuthState();
  const [isOwner, setIsOwner] = useState(false);

  const subName = router.query.sub;
  const { data } = useSWR<Sub & { posts: PostWithVoteScoreAndUserVote[] }>(
    subName ? `/api/subs/${subName}` : null
  );
  const { mutate } = useSWRConfig();

  function openFileInput(type: string) {
    if (!isOwner || !fileRef || !fileRef.current) return;

    fileRef.current.name = type;
    fileRef.current.click();
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.length ? event.target.files[0] : undefined;
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileRef.current?.name || '');

    try {
      const res = await fetch(`/api/subs/${data?.name}/image`, {
        method: 'POST',
        body: formData,
      });
      mutate(`/api/subs/${data?.name}`);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (data?.creatorName === user?.username) {
      setIsOwner(true);
    }
  }, [data, setIsOwner, user]);

  if (data && !data?.posts) {
    return <div className="text-center text-lg">No posts...</div>;
  }

  return (
    <>
      <div>
        <Head>
          <title>{data?.title}</title>
        </Head>
      </div>
      {data ? (
        <>
          <input type={'file'} hidden ref={fileRef} onChange={uploadImage} />
          <div>
            {/* Banner Image */}
            <div
              className={`bg-blue-500 ${isOwner ? 'cursor-pointer' : ''}`}
              onClick={() => openFileInput('banner')}
            >
              {data.bannerUrn ? (
                <div
                  className="h-56 bg-blue-500"
                  style={{
                    backgroundImage: `url(${data.bannerUrn})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-blue-500"></div>
              )}
            </div>
            {/* Sub Meta Data */}
            <div className="h-20 bg-white">
              <div className="container relative flex">
                <div className="-mt-4 pl-2 sm:pl-0">
                  <Image
                    src={data.imageUrn as string}
                    alt="Sub"
                    className={`rounded-full ${
                      isOwner ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => openFileInput('image')}
                    width={80}
                    height={80}
                  />
                </div>
                <div className="pt-2 pl-6">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">{data.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-600">
                    r/{data.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="container flex flex-col pt-5 md:flex-row">
            {data && (
              <div className="order-2 mx-auto mt-4 basis-160 px-3 md:order-1 md:m-0 md:mt-0 md:px-0">
                {data.posts.map((post: PostWithVoteScoreAndUserVote) => (
                  <PostCard post={post} key={post.id} />
                ))}
              </div>
            )}
            <SideBar sub={data} />
          </div>
        </>
      ) : null}
    </>
  );
}
