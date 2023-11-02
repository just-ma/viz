import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CharKey from "../components/CharKey";

const PlaceholderLabel = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  line-height: 24px;
  font-size: 10px;

  animation: ${({ visible }) => (visible ? "slide-in" : "slide-out")} 0.2s
    ease-out forwards;

  @keyframes slide-out {
    from {
      opacity: 1;
      bottom: 0;
    }
    to {
      opacity: 0;
      bottom: -5px;
    }
  }
`;

const RecordedBpmLabelContainer = styled.div`
  position: absolute;
  top: 0;
  right: 6px;
  line-height: 24px;

  animation: slide-in 0.3s ease-out forwards;

  @keyframes slide-in {
    from {
      opacity: 0.5;
      top: 5px;
    }
    to {
      opacity: 1;
      top: 0;
    }
  }
`;

const RecordedBpmLabel = styled.div<{ confidence: number }>`
  color: ${({ confidence }) =>
    confidence > 0.5
      ? "rgb(0, 255, 140)"
      : `rgb(255, ${380 * confidence}, 90)`};
  opacity: ${({ confidence }) => (confidence > 0.5 ? 1 : confidence + 0.4)};

  animation: opacity-fade 1s ease 0.5s forwards;

  @keyframes opacity-fade {
    100% {
      opacity: 0;
    }
  }
`;

const BeatsRow = styled.div`
  display: flex;
  height: 24px;
`;

const BeatItemContainer = styled.div`
  width: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  animation: grow-in 0.3s ease;

  @keyframes grow-in {
    from {
      width: 0;
    }
    to {
      width: 10px;
    }
  }
`;

const BeatItem = styled.div<{ pop: boolean; fade: boolean }>`
  width: 6px;
  height: 6px;
  background-color: rgb(140, 146, 164);
  border-radius: 3px;

  animation: ${({ pop, fade }) =>
      pop ? "pop 2s" : fade ? "fade 0.2s" : "slow-fade 2s"}
    ease forwards;

  @keyframes pop {
    0% {
      width: 2px;
      height: 2px;
    }
    4% {
      width: 10px;
      height: 10px;
    }
    12% {
      width: 6px;
      height: 6px;
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes fade {
    from {
      width: 6px;
      height: 6px;
    }
    to {
      width: 0px;
      height: 0px;
    }
  }

  @keyframes slow-fade {
    0% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const BpmPluginTapper = ({ onBpmChange }) => {
  const prevTimestamp = useRef(null);
  const bpmArr = useRef([]);
  const resolveBpmTimoutId = useRef(null);

  const [queue, setQueue] = useState([]);
  const [recordedBpm, setRecordedBpm] = useState<null | number>(null);
  const [confidence, setConfidence] = useState(0);

  const resolveBpm = () => {
    setQueue([]);
    prevTimestamp.current = null;
    bpmArr.current = [];
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " ") {
      clearTimeout(resolveBpmTimoutId.current);
      const currTimestamp = performance.now();
      setQueue((prev) => [currTimestamp, ...prev].slice(0, 5));

      if (prevTimestamp.current) {
        const currBpm = 60000 / (currTimestamp - prevTimestamp.current);
        bpmArr.current = [currBpm, ...bpmArr.current].slice(0, 4);

        const avgBpm =
          bpmArr.current.reduce((acc, curr) => acc + curr, 0) /
          bpmArr.current.length;
        const roundedAvgBpm = Math.round(avgBpm * 10) / 10;
        setRecordedBpm(roundedAvgBpm);

        const countConfidence = bpmArr.current.length / 4;
        const varianceConfidence =
          bpmArr.current.length > 1
            ? bpmArr.current.reduce(
                (acc, curr) =>
                  acc + 1 - Math.min(Math.abs(roundedAvgBpm - curr) * 0.3, 1),
                0
              ) / bpmArr.current.length
            : 0;
        const weightedConfidence =
          countConfidence * 0.3 + varianceConfidence * 0.7;
        setConfidence(weightedConfidence);

        if (weightedConfidence > 0.5) {
          onBpmChange(roundedAvgBpm);
        }
      }

      prevTimestamp.current = currTimestamp;
      resolveBpmTimoutId.current = setTimeout(resolveBpm, 2000);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <PlaceholderLabel visible={!queue.length}>
        or tap <CharKey>space</CharKey> to the beat
      </PlaceholderLabel>
      <RecordedBpmLabelContainer key={recordedBpm}>
        <RecordedBpmLabel key={recordedBpm} confidence={confidence}>
          {recordedBpm}
        </RecordedBpmLabel>
      </RecordedBpmLabelContainer>
      <BeatsRow>
        {queue.map((e, i) => (
          <BeatItemContainer key={e}>
            <BeatItem key={queue[0]} pop={i === 0} fade={i === 4} />
          </BeatItemContainer>
        ))}
      </BeatsRow>
    </>
  );
};

export default BpmPluginTapper;
