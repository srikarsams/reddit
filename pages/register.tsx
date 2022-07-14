import { ChangeEvent, FormEvent, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { APIError } from '../types';

import { Input } from '../components/input/index';
import { User } from '@prisma/client';
import { useAuthState } from '../components/context';

const Register: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errObject, setErrObject] = useState<APIError>();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const authState = useAuthState();

  if (authState.authenticated) {
    router.replace('/');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      const api_response: Partial<User> | APIError = await fetch(
        '/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username, password }),
        }
      ).then((res) => res.json());
      setIsLoading(false);

      if ((api_response as APIError)?.errors) {
        setErrObject(api_response as APIError);
      } else if ((api_response as User)?.email) {
        router.push('/login');
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
      </Head>

      <div className="h-screen w-20 bg-register-background bg-center md:w-36"></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs leading-4">
            By continuing, you are setting up a Reddiit account and agree to our
            User Agreement and Privacy Policy.
          </p>
          <form onSubmit={handleSubmit}>
            <Input
              name="email"
              type="email"
              value={email}
              placeholder="Email"
              handleOnChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              error={errObject?.errors?.email}
            />
            <Input
              name="username"
              type="text"
              value={username}
              placeholder="Username"
              handleOnChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              error={errObject?.errors?.username}
            />
            <Input
              name="password"
              type="password"
              value={password}
              placeholder="Password"
              handleOnChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              error={errObject?.errors?.password}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`my-4 w-full rounded bg-blue-500 py-3 text-xs font-bold uppercase text-white`}
            >
              Sign Up
            </button>
          </form>
          <small>
            Already a reddiitor?
            <Link href={'/login'}>
              <a className="ml-1 text-xs uppercase text-blue-500">Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
