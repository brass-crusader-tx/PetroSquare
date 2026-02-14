'use client';

import { PetroSquareOS } from '@/src/os/PetroSquareOS';
import { ModeId } from '@/src/os/types';

export default function MarketsPage() {
  return (
    <PetroSquareOS initialMode={ModeId.MARKETS_TRADING} />
  );
}
