'use client';

import { PetroSquareOS } from '@/src/os/PetroSquareOS';
import { ModeId } from '@/src/os/types';

export default function ProductionPage() {
  return (
    <PetroSquareOS initialMode={ModeId.PRODUCTION_RESERVES} />
  );
}
