import Script from 'next/script';
import * as React from 'react';

import Layout from '@/components/layout/Blank';
import Seo from '@/components/Seo';

export default function ChromeGame() {
  return (
    <Layout>
      <Seo templateTitle='Life... is Roblox' />
      <Script src='scripts/chrome_game.js' />
      <div className='h-[30vh] px-5' id='game'></div>

      <div className='px-10'>
        <h1 className='text-2m md:text-3m mt-8 text-black'>
          This pokelawls stream is not yet available
        </h1>
      </div>
    </Layout>
  );
}
