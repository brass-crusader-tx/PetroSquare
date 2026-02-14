'use client';

import { useModeStore } from './stores/modeStore';
import { MODE_COMPONENTS } from './modeRegistry';
import { ModeId } from './types';

export const ModeLayerManager = () => {
  const activeMode = useModeStore((state) => state.activeMode);

  return (
    <group>
      {(Object.keys(MODE_COMPONENTS) as ModeId[]).map((modeId) => {
        const Component = MODE_COMPONENTS[modeId];
        return (
          <Component
            key={modeId}
            visible={activeMode === modeId}
          />
        );
      })}
    </group>
  );
};
