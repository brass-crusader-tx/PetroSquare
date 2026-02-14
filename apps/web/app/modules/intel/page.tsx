'use client';

import { PetroSquareOS } from '@/src/os/PetroSquareOS';
import { ModeId } from '@/src/os/types';

export default function IntelPage() {
  return (
    <PetroSquareOS initialMode={ModeId.MARKET_INTELLIGENCE} />
  );
}
