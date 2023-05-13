/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// const image = fetch(String(new URL('~/images/og.png', import.meta.url))).then(
//   (res) => res.arrayBuffer()
// );

export default async function handler() {
  // const imageData = String(await image);
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: 'black',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <img src={imageData} /> */}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
