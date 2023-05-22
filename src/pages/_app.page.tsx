import '@lib/dayjs';

import { queryClient } from '@lib/react-query';
import { globalStyles } from '@styles/global';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { Roboto } from 'next/font/google';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  style: ['normal'],
  subsets: ['latin'],
});

globalStyles();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
        <Head>
          <title>Ignite Call</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/Ignite-simbol.svg" />
        </Head>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
