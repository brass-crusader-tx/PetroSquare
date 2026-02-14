import { SceneNode } from '../../scene/types';

export const buildSceneGraph = (): SceneNode[] => {
  // Placeholder: In a real app, this would query a backend or local store
  return [
    {
      id: 'region-1',
      type: 'Region',
      position: [0, 0, 0],
      visible: true,
      metadata: { name: 'Permian Basin' },
    },
    {
      id: 'site-1',
      type: 'Site',
      parentId: 'region-1',
      position: [10, 0, 10],
      visible: true,
      metadata: { name: 'Alpha Site' },
    },
  ];
};
