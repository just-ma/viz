import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { getRandomColor, isColorDark } from "../utils";
import { isMobile } from "../constants";

const AURA_DURATION = 5000;

const Aura = styled.div<{ color1: string; color2: string; dark: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    ${({ color1, color2, dark }) =>
        `${color1}, ${color2}, ${dark ? "#303030" : "white"}`}
      40%
  );
  pointer-events: none;

  animation: glow ${AURA_DURATION}ms ease forwards;

  @keyframes glow {
    0% {
      transform: scale(1);
      opacity: 0;
    }
    25% {
      transform: scale(1.5);
      opacity: 0.6;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;

const PlaceholderMessage = styled.div<{ fadeOut?: boolean; dark: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${({ dark }) => (dark ? "black" : "white")};
  font-size: 12px;
  z-index: 1;
  ${({ fadeOut }) =>
    fadeOut &&
    css`
      animation: fade 1s ease forwards;
      pointer-events: none;
    `}

  @keyframes fade {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

type ComponentProps = {
  init: boolean;
  onCameraFacingModeChange: (mode: string) => void;
  backgroundColor: string;
};

const LandingAnimation = ({
  init,
  onCameraFacingModeChange,
  backgroundColor,
}: ComponentProps) => {
  const initRef = useRef(init);
  const timeoutRef = useRef(null);

  const [auraColors, setAuraColors] = useState([
    getRandomColor(),
    getRandomColor(),
  ]);

  useEffect(() => {
    initRef.current = init;
  }, [init]);

  const animateAura = () => {
    clearTimeout(timeoutRef.current);

    if (!initRef.current) {
      setAuraColors((prev) => {
        if (prev.length) {
          timeoutRef.current = setTimeout(animateAura, 500);
          return [];
        } else {
          timeoutRef.current = setTimeout(animateAura, AURA_DURATION);
          return [getRandomColor(), getRandomColor()];
        }
      });
    }
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(animateAura, AURA_DURATION);
  }, []);

  const isBackgroundDark = isColorDark(backgroundColor);

  return (
    <>
      <PlaceholderMessage fadeOut={init} dark={!isBackgroundDark}>
        {isMobile ? (
          <>
            what do u wish to see?
            <br />
            <br />
            <button onClick={() => onCameraFacingModeChange("environment")}>
              the world around me
            </button>
            <br />
            <br />
            <button onClick={() => onCameraFacingModeChange("user")}>
              myself
            </button>
          </>
        ) : (
          "kindly requesting webcam access..."
        )}
      </PlaceholderMessage>
      {!!auraColors.length && (
        <Aura
          color1={auraColors[0]}
          color2={auraColors[1]}
          dark={isBackgroundDark}
        />
      )}
    </>
  );
};

export default LandingAnimation;
