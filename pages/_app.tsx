import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { PerformanceTrackerContext, usePerformanceTracker } from '../src/hooks/use-performance-tracker';
import { SettingsContext, useSettings } from '../src/settings/settings';

export default function App({ Component, pageProps }: AppProps) {
  const performanceTracker = usePerformanceTracker();
  const [settings, dispatchSettings] = useSettings();

  return (
    <>
      <Head>
        <title>Reactway</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <PerformanceTrackerContext.Provider value={performanceTracker}>
        <SettingsContext.Provider value={[settings, dispatchSettings]} >
          <Component {...pageProps} />
        </SettingsContext.Provider>
      </PerformanceTrackerContext.Provider>
    </>
  );
}
