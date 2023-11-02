import React from "react";
import {
  createPlugin,
  useInputContext,
  LevaInputProps,
  Components,
  InternalNumberSettings,
} from "leva/plugin";
import styled from "styled-components";
import BpmPluginTapper from "./BpmPluginTapper";
import { isMobile } from "../constants";

const { Row, Label, Number: NumberComponent } = Components;

const TapperContainer = styled.div`
  position: relative;
  height: 30px;
  width: 160px;
  margin: 3px 0 0 auto;
  user-select: none;
`;

type BpmPluginProps = LevaInputProps<number, InternalNumberSettings>;

const initialBpm = Math.round(Math.random() * 150 + 1200) / 10;

function BpmPlugin() {
  const props = useInputContext<BpmPluginProps>();
  const {
    displayValue = initialBpm,
    value,
    label,
    onChange,
    onUpdate,
    settings,
  } = props;

  const handleUpdate = (v: number) => {
    if (Number.isNaN(v)) {
      onUpdate(initialBpm);
      return;
    }

    const formattedValue = Math.round(Math.min(Math.abs(v), 400) * 10) / 10;
    onUpdate(formattedValue);
  };

  return (
    <>
      <Row input>
        <Label>{label}</Label>
        <NumberComponent
          displayValue={displayValue}
          value={value}
          onChange={onChange}
          onUpdate={handleUpdate}
          label="value"
          settings={settings}
          innerLabelTrim={0}
        />
      </Row>
      {!isMobile && (
        <Row>
          <TapperContainer>
            <BpmPluginTapper onBpmChange={handleUpdate} />
          </TapperContainer>
        </Row>
      )}
    </>
  );
}

export const bpmPlugin = createPlugin<number, number, {}>({
  component: BpmPlugin,
});
