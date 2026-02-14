'use client';

import { PetroSquareOS } from '@/src/os/PetroSquareOS';
import { ModeId } from '@/src/os/types';

export default function EconomicsPage() {
  return (
    <PetroSquareOS initialMode={ModeId.ECONOMICS} />
  );
}
