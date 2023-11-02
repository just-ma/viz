import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Leva } from "leva";
import Info from "./components/Info";
import useVisualizerControls from "./useVisualizerControls";
import { isMobile } from "./constants";
import LandingAnimation from "./components/LandingAnimation";
import VisualizerCanvas from "./components/visualizer/VisualizerCanvas";

const Container = styled.div<{
  backgroundColor: string;
  idle: boolean;
  init: boolean;
}>`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: ${({ backgroundColor }) => backgroundColor};
  transition: background-color 0.5s;
  cursor: ${({ idle }) => (idle ? "none" : "pointer")};

  ${({ init }) =>
    !init &&
    css`
      animation: background-init 0.6s ease forwards;
    `};

  @keyframes background-init {
    from {
      background-color: white;
    }
    to {
      background-color: ${({ backgroundColor }) => backgroundColor};
    }
  }
`;

const StyledVideo = styled.video`
  display: none;
`;

const App = () => {
  const videoRef = useRef(null);
  const idleTimeoutRef = useRef(null);

  const [init, setInit] = useState(false);
  const [idle, setIdle] = useState(false);
  const [hideUi, setHideUi] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState(
    isMobile ? null : "user"
  );

  const controls = useVisualizerControls();
  const { backgroundColor } = controls;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "h") {
      clearTimeout(idleTimeoutRef.current);
      setHideUi((prev) => {
        setIdle(!prev);
        return !prev;
      });
    } else {
      resetIdleTimeout();
    }
  };

  useEffect(() => {
    if (cameraFacingMode) {
      getVideo();
    }
  }, [cameraFacingMode]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 2160 },
          height: { ideal: 2160 },
          facingMode: cameraFacingMode,
        },
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
        setInit(true);
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const resetIdleTimeout = () => {
    if (!hideUi) {
      return;
    }

    setIdle(false);
    clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => {
      setIdle(true);
    }, 4000);
  };

  return (
    <Container
      backgroundColor={backgroundColor}
      onMouseMove={resetIdleTimeout}
      idle={idle}
      init={init}
    >
      <LandingAnimation
        init={init}
        onCameraFacingModeChange={setCameraFacingMode}
        backgroundColor={backgroundColor}
      />
      {!hideUi && <Info logoColor={backgroundColor} />}
      {init && (
        <VisualizerCanvas
          video={videoRef.current.srcObject}
          controls={controls}
          flipped={cameraFacingMode === "user"}
        />
      )}
      <StyledVideo ref={videoRef} muted playsInline />
      <Leva
        hideCopyButton
        hidden={!init || hideUi}
        titleBar={{ filter: false }}
        collapsed={isMobile}
      />
    </Container>
  );
};

export default App;
