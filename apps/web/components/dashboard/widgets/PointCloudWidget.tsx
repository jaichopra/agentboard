"use client";

import { useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Widget } from "@/lib/schemas";
import WidgetShell from "../WidgetShell";

interface PointCloudWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

function PointCloud({ points, color, size }: { points: number[][]; color: string; size: number }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      positions[i * 3] = points[i][0] || 0;
      positions[i * 3 + 1] = points[i][1] || 0;
      positions[i * 3 + 2] = points[i][2] || 0;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [points]);

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

export default function PointCloudWidget({ widget, data }: PointCloudWidgetProps) {
  const config = widget.config as {
    points?: number[][];
    color?: string;
    pointSize?: number;
    backgroundColor?: string;
  };

  const points = config.points || data.map((d) => [
    Number(d.x || 0),
    Number(d.y || 0),
    Number(d.z || 0),
  ]);
  const color = config.color || "#06b6d4";
  const pointSize = config.pointSize || 0.05;
  const backgroundColor = config.backgroundColor || "#09090b";

  return (
    <WidgetShell title={widget.title} description={widget.description}>
      <div className="min-h-0 flex-1 overflow-hidden rounded-lg" style={{ backgroundColor }}>
        {points.length > 0 ? (
          <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <PointCloud points={points} color={color} size={pointSize} />
            <OrbitControls enableDamping dampingFactor={0.1} />
            <gridHelper args={[10, 10, "#27272a", "#27272a"]} />
          </Canvas>
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            No point data
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
