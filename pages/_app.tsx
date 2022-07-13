import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { NavBar } from '../components/nav-bar/NavBar';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const authRoute =
    router.pathname === '/register' || router.pathname === '/login';
  return (
    <>
      {!authRoute && <NavBar />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
