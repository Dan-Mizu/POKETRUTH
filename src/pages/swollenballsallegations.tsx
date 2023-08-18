import Script from 'next/script';
import * as React from 'react';

import { LayoutWhite as Layout } from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';

export default function ChromeGame() {
  return (
    <Layout>
      <Seo templateTitle='Life... is Roblox' />
      <Script src='scripts/chrome_game.js' />
      <div className='h-[30vh] px-5' id='game'></div>

      <div className='layout-l mt-5 text-left'>
        <h1
          style={{
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
          }}
          className='text-xl text-red-600 md:text-4xl'
        >
          ⚠️ THIS PAGE HAS BEEN SEIZED
        </h1>
        <h2
          style={{
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            color: '#535353',
          }}
          className='mt-4 text-base md:text-2xl'
        >
          <span className='text-black'>Pokelawls, Inc.™</span> has ordered an
          immediate shutdown of this page, by court order.
        </h2>
      </div>
      <div className='layout-l mt-5 text-right'>
        <ArrowLink
          style={{
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            color: '#969696',
          }}
          className='mt-md:text-base'
          href='https://www.youtube.com/watch?v=eRsvduJh3Lo'
        >
          Details
        </ArrowLink>
      </div>
    </Layout>
  );
}
