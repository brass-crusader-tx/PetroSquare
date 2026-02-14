'use client';

import { PetroSquareOS } from '@/src/os/PetroSquareOS';
import { ModeId } from '@/src/os/types';

export default function GisPage() {
  return (
    <PetroSquareOS initialMode={ModeId.GIS_INTELLIGENCE} />
  );
}
