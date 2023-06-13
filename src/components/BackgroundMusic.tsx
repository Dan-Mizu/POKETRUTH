import Script from 'next/script';
import React from 'react';

export default function BackgroundMusic(props: { src: string }) {
  return (
    <>
      <Script id='show-banner' strategy='afterInteractive'>
        {`document.getElementById("backgroundMusic").play().catch((error) => {
    document.addEventListener('click', () => {
      document.getElementById("backgroundMusic").play()
    }, { once: true } )})`}
      </Script>
      <audio id='backgroundMusic' loop autoPlay defaultValue={0.25}>
        <source src={props.src} type='audio/ogg' />
      </audio>
    </>
  );
}
