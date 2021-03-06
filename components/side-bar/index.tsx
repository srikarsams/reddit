import { Sub } from '@prisma/client';
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { LinkButton } from '../button';
import { useAuthState } from '../context';

interface SideBarProps {
  sub: Sub;
}

export function SideBar({ sub }: SideBarProps) {
  const { authenticated } = useAuthState();
  return (
    <div className="order-1 px-3 md:order-2 md:ml-6 md:basis-80 md:px-0">
      <div className="rounded bg-white">
        <div className="rounded-t bg-blue-500 p-3">
          <p className="font-semibold text-white">About Community</p>
        </div>
        <div className="p-3">
          <p className="text-md mb-3">{sub.description}</p>
          <div className="mb-3 flex text-sm font-medium">
            <div className="flex-grow">
              <p>100k</p>
              <p>members</p>
            </div>
            <div className="flex-grow">
              <p>1202</p>
              <p>online</p>
            </div>
          </div>

          <p className="mb-3">
            <i className="fas fa-birthday-cake mr-2"></i>
            Created {dayjs(sub.createdAt).format('D MMM YYYY')}
          </p>

          {authenticated && (
            <Link href={`/r/${sub.name}/submit`}>
              <LinkButton theme="primary" customClass="w-full text-sm">
                Create Post
              </LinkButton>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
