import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";
import { ReactComponent as Logo } from "../assets/nitsuj.svg";
import { isColorDark } from "../utils";

const Container = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  box-sizing: border-box;
  z-index: 1001;
  user-select: none;
`;

const LogoContainer = styled.div<{ dark: boolean }>`
  position: absolute;
  background-color: ${({ dark }) => (dark ? "black" : "white")};
  width: 50px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
  z-index: 1;
  transition: background-color 0.5s;
`;

const StyledLogo = styled(Logo)<{ logoColor: string }>`
  width: 120%;
  height: 120%;
  fill: ${({ logoColor }) => logoColor};
  transition: fill 0.5s;
`;

const Content = styled.div<{ animate: boolean }>`
  position: absolute;
  padding: 50px 10px 16px;
  background-color: rgb(24, 28, 32);
  border-radius: 10px;
  width: 225px;
  height: fit-content;
  color: rgb(140, 146, 164);
  white-space: pre-wrap;
  box-shadow: rgba(0, 0, 0, 0.533) 0px 0px 9px 0px;

  ${({ animate }) =>
    animate &&
    css`
      animation: flicker 0.1s ease infinite;
    `}

  @keyframes flicker {
    0% {
      opacity: 0.5;
    }
    30% {
      opacity: 0.3;
    }
    60% {
      opacity: 0.6;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

const Link = styled.a`
  color: rgb(180, 186, 204);
`;

type ComponentProps = { logoColor: string };

const Info = ({ logoColor }: ComponentProps) => {
  const animateRef = useRef(null);

  const [expand, setExpand] = useState(false);
  const [animate, setAnimate] = useState(false);

  const animateIn = () => {
    if (expand) {
      return;
    }

    clearTimeout(animateRef.current);
    setAnimate(true);
    setExpand(true);
    animateRef.current = setTimeout(() => {
      setAnimate(false);
    }, 200);
  };

  const animateOut = () => {
    if (!expand) {
      return;
    }

    clearTimeout(animateRef.current);
    setAnimate(true);
    setExpand(true);
    animateRef.current = setTimeout(() => {
      setExpand(false);
      setAnimate(false);
    }, 200);
  };

  return (
    <Container
      onClick={expand ? animateOut : animateIn}
      onMouseLeave={animateOut}
    >
      <LogoContainer onMouseEnter={animateIn} dark={!isColorDark(logoColor)}>
        <StyledLogo logoColor={logoColor} />
      </LogoContainer>
      {expand && (
        <Content animate={animate}>
          NIT SU J. visualizer!
          {`\n\n`}a visualizer for all ur DJ needs. set a bpm, tweak some
          parameters, and let that bad boy run.
          {`\n\n\n\n`}
          FAQ{`\n\n`}
          <Link
            href="https://www.instagram.com/nit.su.j/"
            target="_blank"
            rel="noreferrer"
          >
            what is NIT SU J. anyways?
          </Link>
          {`\n\n`}
          <Link
            href="https://github.com/just-ma/visualizer"
            target="_blank"
            rel="noreferrer"
          >
            can i play around with the code?
          </Link>
        </Content>
      )}
    </Container>
  );
};

export default Info;
