import UnderlineLink from '@/components/links/UnderlineLink';

export default function Footer() {
  return (
    <footer className='fixed bottom-0 left-0 z-20 w-full md:flex md:items-center md:justify-between md:p-6'>
      <span className='Footer layout container relative flex flex-col items-center justify-center text-sm text-gray-700'>
        © {new Date().getFullYear()}
        <UnderlineLink href='https://twitter.com/Pokediger1'>
          the REAL pokilawls
        </UnderlineLink>
      </span>
    </footer>
  );
}
