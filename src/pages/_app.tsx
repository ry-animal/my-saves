import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import RootLayout from './layout/RootLayout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSEO />
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </>
  );
}
