export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="relative animate-pulse">
        <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" fill="#0F172A" stroke="#3B82F6" strokeWidth="2" className="animate-[pulse_2s_ease-in-out_infinite]"/>
            <path d="M16 8L8 12V20L16 24L24 20V12L16 8Z" fill="#1E293B" stroke="#3B82F6" strokeWidth="1" className="animate-[pulse_1s_ease-in-out_infinite]"/>
        </svg>
      </div>
      <div className="sr-only">Loading PetroSquare OS...</div>
    </div>
  );
}
