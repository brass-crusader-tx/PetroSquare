import { Vector3 } from 'three';

export type NodeType =
  | 'Region'
  | 'Site'
  | 'PipelineSegment'
  | 'FacilityCluster'
  | 'AssetNode'
  | 'TelemetryPoint'
  | 'InsightNode'
  | 'Proposal'
  | 'Annotation';

export interface SceneNode {
  id: string;
  type: NodeType;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  parentId?: string;
  metadata?: Record<string, any>;
  visible?: boolean;
}

export interface LayerConfig {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  interactive: boolean;
  minZoom?: number;
  maxZoom?: number;
}
