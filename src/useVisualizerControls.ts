import { useControls } from "leva";
import { bpmPlugin } from "./leva-plugins/bpmPlugin";
import { footerPlugin } from "./leva-plugins/footerPlugin";
import { getRandomBgColor } from "./utils";
import { useMemo } from "react";

export type AppControls = {
  bpm: number;
  backgroundColor: string;
  maxAmp: number;
  ampRadius: number;
  threshold: number;
  saturation: number;
};

const useVisualizerControls = (): AppControls => {
  const { bpm, backgroundColor, maxAmp, ampRadius, threshold, saturation } =
    useControls({
      bpm: bpmPlugin(),
      backgroundColor: {
        value: getRandomBgColor(),
        label: "background",
      },
      maxAmp: {
        label: "volume",
        value: Math.random() * 60,
        min: 0,
        max: 100,
      },
      ampRadius: {
        label: "wobble",
        value: Math.random() * 100,
        min: 0,
        max: 100,
      },
      threshold: {
        label: "filter",
        value: Math.random() * 50,
        min: 0,
        max: 100,
      },
      saturation: {
        value: (Math.random() > 0.5 ? 0 : 70) + Math.random() * 20,
        min: 0,
        max: 100,
      },
      footer: footerPlugin(),
    });

  return useMemo(() => {
    const controlss = {
      bpm,
      backgroundColor,
      maxAmp: maxAmp * 0.03 + 0.5, // 0.5 - 3.5
      ampRadius: ampRadius * 0.008 + 0.2, // 0.2 - 1
      threshold: threshold / 100, // 0 - 1,
      saturation: saturation / 100, // 0 - 1
    };

    console.log({ controlss });

    return controlss;
  }, [bpm, backgroundColor, maxAmp, ampRadius, threshold, saturation]);
};

export default useVisualizerControls;
