import React from "react";
import { createPlugin, Components } from "leva/plugin";
import styled from "styled-components";
import CharKey from "../components/CharKey";

const { Row } = Components;

const StyledRow = styled(Row)`
  display: block;
  width: fit-content;
  margin: 20px auto 6px;
`;

const isMobile = window.innerWidth <= 500;

function FooterPlugin() {
  return isMobile ? null : (
    <StyledRow>
      press <CharKey>h</CharKey> to hide
    </StyledRow>
  );
}

export const footerPlugin = createPlugin({
  component: FooterPlugin,
});
