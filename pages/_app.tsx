import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { PerformanceTrackerContext, usePerformanceTracker } from '../src/hooks/use-performance-tracker'

export default function App({ Component, pageProps }: AppProps) {
  const performanceTracker = usePerformanceTracker();

  return (
    <>
      <Head>
        <title>Reactway</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <PerformanceTrackerContext.Provider value={performanceTracker}>
        <Component {...pageProps} />
      </PerformanceTrackerContext.Provider>
    </>
  )
}
