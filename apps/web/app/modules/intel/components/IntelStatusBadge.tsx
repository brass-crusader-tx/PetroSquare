import React from 'react';
import { Badge } from '@petrosquare/ui';
import { IntelItemStatus } from '@petrosquare/types';

export function IntelStatusBadge({ status }: { status: IntelItemStatus }) {
  let badgeStatus: 'live' | 'declared' | 'beta' | 'inactive' = 'inactive';
  if (status === 'PUBLISHED') badgeStatus = 'live';
  else if (status === 'IN_REVIEW') badgeStatus = 'declared';
  else if (status === 'DRAFT') badgeStatus = 'beta';

  return <Badge status={badgeStatus}>{status}</Badge>;
}
