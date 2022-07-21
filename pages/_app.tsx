import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

import { NavBar } from '../components/nav-bar';
import { useRouter } from 'next/router';
import { AuthContextProvider } from '../components/context';

import '../styles/globals.css';
import '../styles/icons.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const authRoute =
    router.pathname === '/register' ||
    router.pathname === '/login' ||
    router.pathname === '/subs/create';
  return (
    <SWRConfig
      value={{
        fetcher: (url, obj = {}) => fetch(url, obj).then((res) => res.json()),
        dedupingInterval: 10000,
      }}
    >
      <AuthContextProvider>
        {!authRoute && <NavBar />}
        <div className={`${!authRoute ? 'pt-12' : ''}`}>
          <Component {...pageProps} />
        </div>
      </AuthContextProvider>
    </SWRConfig>
  );
}

export default MyApp;
