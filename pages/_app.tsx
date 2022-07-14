import '../styles/globals.css';
import '../styles/icons.css';
import type { AppProps } from 'next/app';

import { NavBar } from '../components/nav-bar';
import { useRouter } from 'next/router';
import { AuthContextProvider } from '../components/context';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const authRoute =
    router.pathname === '/register' || router.pathname === '/login';
  return (
    <AuthContextProvider>
      {!authRoute && <NavBar />}
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp;
