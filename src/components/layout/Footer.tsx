import UnderlineLink from '@/components/links/UnderlineLink';

export default function Footer() {
  return (
    <div className='Footer container absolute bottom-4 mx-auto flex flex-col items-center text-center text-sm text-gray-700'>
      © {new Date().getFullYear()}
      <UnderlineLink href='https://twitter.com/Pokediger1'>
        the REAL pokilawls
      </UnderlineLink>
    </div>
  );
}
