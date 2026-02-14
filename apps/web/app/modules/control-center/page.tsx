'use client';

import { PetroSquareOS } from '@/src/os/PetroSquareOS';
import { ModeId } from '@/src/os/types';

export default function ControlCenterPage() {
  return (
    <PetroSquareOS initialMode={ModeId.CONTROL_CENTER} />
  );
}
