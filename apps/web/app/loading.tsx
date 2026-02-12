import Image from 'next/image';

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="relative animate-pulse">
        <Image
          src="/logo/petrosquare-mark.svg"
          alt="PetroSquare"
          width={64}
          height={64}
          priority
          className="animate-[pulse_2s_ease-in-out_infinite]"
        />
      </div>
      <div className="sr-only">Loading PetroSquare OS...</div>
    </div>
  );
}
