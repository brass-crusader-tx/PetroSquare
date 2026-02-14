'use client';

import { PetroSquareOS } from '@/src/os/PetroSquareOS';
import { ModeId } from '@/src/os/types';
import { useParams } from 'next/navigation';

export default function GenericModulePage() {
  // Fallback for unknown modules
  return (
    <PetroSquareOS initialMode={ModeId.CONTROL_CENTER} />
  );
}
