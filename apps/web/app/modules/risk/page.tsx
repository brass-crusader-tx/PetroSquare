'use client';

import { PetroSquareOS } from '@/src/os/PetroSquareOS';
import { ModeId } from '@/src/os/types';

export default function RiskPage() {
  return (
    <PetroSquareOS initialMode={ModeId.RISK_REGULATORY} />
  );
}
