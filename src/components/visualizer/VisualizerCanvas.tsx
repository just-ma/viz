import React from "react";
import { Canvas } from "@react-three/fiber";
import Visualizer from "./Visualizer";
import {
  OrbitControls,
  PerspectiveCamera,
  TrackballControls,
} from "@react-three/drei";
import { AppControls } from "../../useVisualizerControls";
import { isMobile } from "../../constants";

type ComponentProps = {
  video: MediaStream;
  controls: AppControls;
  flipped: boolean;
};

const VisualizerCanvas = ({ video, controls, flipped }: ComponentProps) => {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 3 : 2]} />
      <Visualizer video={video} controls={controls} flipped={flipped} />
      <OrbitControls enableZoom={false} enableDamping dampingFactor={0.07} />
      <TrackballControls noPan noRotate zoomSpeed={0.6} />
    </Canvas>
  );
};

export default VisualizerCanvas;
