import Image from 'next/image';
import * as React from 'react';

import BackgroundMusic from '@/components/BackgroundMusic';
import CenterSection from '@/components/layout/CenterSection';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';

import Badass from '~/images/Badass.gif';
import UhOh from '~/images/UhOh.png';

export default function HomePage() {
  return (
    <Layout>
      <Seo />
      <BackgroundMusic src='/audio/blue-jeans-shit-edition.ogg' />

      <CenterSection>
        {/* badass... */}
        <Image
          src={UhOh}
          alt='badass'
          width={200}
          style={{
            position: 'absolute',
            marginLeft: '50px',
            marginBottom: '570px',
            zIndex: 1,
          }}
        />
        <Image
          src={Badass}
          alt='badass'
          width={420}
          style={{
            position: 'relative',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
        {/* header */}
        <h1 className='mt-4 text-gray-100'>INDUSTRY SECRETS EXPOSED</h1>
        {/* description */}
        <p className='text-med mt-2 text-gray-100'>
          SUBSCRIBE TO MY TRUTH FORUM® SUBSCRIPTION BASED MAILING LIST™ FOR THE
          TRUTH
        </p>
        &nbsp;
        {/* lol */}
        <ButtonLink variant='light' href='https://youtu.be/2lEpY6hIg6w'>
          SUBSCRIBE ➔
        </ButtonLink>
      </CenterSection>
    </Layout>
  );
}
