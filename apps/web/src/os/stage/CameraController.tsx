import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { useModeStore } from '../stores/modeStore';

export const CameraController = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const selection = useModeStore((state) => state.selection);

  // Semantic Zoom Levels
  // Z1: Global (Region) -> y=100
  // Z2: Site (Facility) -> y=20
  // Z3: Asset (Equipment) -> y=5

  useEffect(() => {
    if (selection && controlsRef.current) {
      // Mock logic: move camera based on selection type
      // In a real app, we would look up the position of the entity
      const target = new Vector3(0, 0, 0); // Default center
      let zoomY = 100;

      if (selection.type === 'Region') {
        zoomY = 100;
      } else if (selection.type === 'Site') {
        zoomY = 20;
        target.set(10, 0, 10); // Mock position for Site-1
      } else if (selection.type === 'AssetNode') {
        zoomY = 5;
      }

      // Animate transition (simplified)
      const currentPos = camera.position.clone();
      const targetPos = new Vector3(target.x, zoomY, target.z + zoomY * 0.5); // Isometric-ish offset

      // We'll just snap for now, or use a tween library in a real app
      // Implementing a simple lerp in useFrame would be better, but for now strict snap:
      camera.position.copy(targetPos);
      controlsRef.current.target.copy(target);
      controlsRef.current.update();
    }
  }, [selection, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2.1} // Prevent going below ground
      dampingFactor={0.1}
    />
  );
};
