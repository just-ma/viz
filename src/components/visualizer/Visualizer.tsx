import React, { useEffect, useMemo, useRef } from "react";
import { useVideoTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { AppControls } from "../../useVisualizerControls";
import { fragmentShader, vertexShader } from "./shaders";

type ComponentProps = {
  video: MediaStream;
  controls: AppControls;
  flipped: boolean;
};

const Visualizer = ({
  video,
  controls: {
    maxAmp: optimisticMaxAmp,
    ampRadius: optimisticAmpRadius,
    bpm: optimisticBpm,
    threshold: optimisticThreshold,
    saturation: optimisticSaturation,
  },
  flipped,
}: ComponentProps) => {
  const materialRef = useRef(null);
  const ampPosRef = useRef([0, 0]);
  const maxAmpRef = useRef(1);
  const ampRadiusRef = useRef(1);
  const bpmRef = useRef(120);
  const thresholdRef = useRef(2);
  const saturationRef = useRef(0);
  const initRef = useRef(false);

  const texture = useVideoTexture(video);

  useFrame(() => {
    const now = performance.now() / 1000;
    const rotVal = (now * Math.PI * bpmRef.current) / 60;

    if (optimisticMaxAmp !== maxAmpRef.current) {
      const newMaxAmp =
        maxAmpRef.current + 0.01 * (optimisticMaxAmp - maxAmpRef.current);
      materialRef.current.uniforms.uMaxAmp.value = newMaxAmp;
      maxAmpRef.current = newMaxAmp;
    }

    if (optimisticAmpRadius !== ampRadiusRef.current) {
      const newAmpRadius =
        ampRadiusRef.current +
        0.01 * (optimisticAmpRadius - ampRadiusRef.current);
      materialRef.current.uniforms.uAmpRadius.value = newAmpRadius;
      ampRadiusRef.current = newAmpRadius;
    }

    if (optimisticThreshold !== thresholdRef.current) {
      const newThreshold =
        thresholdRef.current +
        (initRef.current ? 0.05 : 0.01) *
          (optimisticThreshold - thresholdRef.current);
      materialRef.current.uniforms.uThreshold.value = newThreshold;
      thresholdRef.current = newThreshold;
    }

    if (optimisticSaturation !== saturationRef.current) {
      const newSaturation =
        saturationRef.current +
        0.04 * (optimisticSaturation - saturationRef.current);
      materialRef.current.uniforms.uSaturation.value = newSaturation;
      saturationRef.current = newSaturation;
    }

    if (optimisticBpm !== bpmRef.current) {
      const optimisticRotVal = (now * Math.PI * optimisticBpm) / 60;

      if (
        Math.abs(Math.cos(rotVal) - Math.cos(optimisticRotVal)) < 0.1 &&
        Math.abs(Math.sin(rotVal) - Math.sin(optimisticRotVal)) < 0.1
      ) {
        bpmRef.current = optimisticBpm;
      }
    }

    const newAmpPos = [
      Math.cos(rotVal) * ampRadiusRef.current,
      Math.sin(rotVal) * ampRadiusRef.current,
    ];
    materialRef.current.uniforms.uAmpPos.value = newAmpPos;
    ampPosRef.current = newAmpPos;
  });

  const uniforms = useMemo(() => {
    return {
      uTexture: {
        value: texture,
      },
      uAmpPos: {
        value: ampPosRef.current,
      },
      uMaxAmp: {
        value: maxAmpRef.current,
      },
      uAmpRadius: {
        value: ampRadiusRef.current,
      },
      uThreshold: {
        value: thresholdRef.current,
      },
      uSaturation: {
        value: saturationRef.current,
      },
      uFlipped: {
        value: flipped,
      },
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initRef.current = true;
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <mesh>
      <planeGeometry args={[2, 2, 500, 500]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

export default Visualizer;
