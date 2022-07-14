import Link from 'next/link';
import { useRouter } from 'next/router';

import { ACTION_CONSTANTS, useAuthDispatch, useAuthState } from '../context';

/* eslint-disable @next/next/no-img-element */
const NavBar = () => {
  const authState = useAuthState();
  const dispatch = useAuthDispatch();
  const router = useRouter();

  async function logout() {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());

      if (res.success) {
        dispatch({ type: ACTION_CONSTANTS.LOGGED_OUT, payload: null });
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex h-12 items-center justify-center bg-white px-6">
      <div className="flex items-center">
        <Link href="/">
          <a>
            <img
              src="/images/reddit-logo.svg"
              alt="Reddiit Logo"
              className="mr-2 h-8 w-8 flex-shrink-0"
            />
          </a>
        </Link>
        <span>
          <Link href="/">
            <a className="text-2xl font-normal">reddiit</a>
          </Link>
        </span>
      </div>
      <div className="mx-auto flex items-center rounded border bg-gray-100 hover:border-blue-500 hover:bg-white">
        <i className="fas fa-search pl-4 pr-3 text-gray-500"></i>
        <input
          className="w-160 rounded bg-transparent py-1 pr-3 focus:outline-none"
          type="text"
          placeholder="Search Reddiit"
        />
      </div>
      {!authState.loading ? (
        <div className="flex">
          {!authState.authenticated ? (
            <>
              <Link href="/login">
                <a className="blue button mr-4 w-32 py-1 leading-5 outline">
                  Log in
                </a>
              </Link>
              <Link href="/register">
                <a className="blue button w-32 py-1 leading-5">Register</a>
              </Link>
            </>
          ) : (
            <button
              className="blue button mr-4 w-32 py-1 leading-5 outline"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
};

export { NavBar };
