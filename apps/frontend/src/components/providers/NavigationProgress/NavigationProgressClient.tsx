'use client';

import dynamic from 'next/dynamic';


const NavigationProgressBar = dynamic(
  () => import('./NavigationProgress').then((m) => m.NavigationProgress),
  { ssr: false },
);


export const NavigationProgressClient = () => <NavigationProgressBar />;
