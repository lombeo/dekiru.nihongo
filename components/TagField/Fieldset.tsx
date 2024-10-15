import React, { memo } from "react";
import styled from "styled-components";

const Fieldset = memo((props: any) => {
  return <StyledFieldset {...props} />;
});
Fieldset.displayName = "Fieldset";
export default Fieldset;

const StyledFieldset = styled.fieldset<any>`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  padding: 0;
  margin: 0;
  border-radius: ${({ variant }) => (variant === "standard" ? "none" : "3px")};
  border: 1px solid  ${({disabled}) => disabled ? "#E2E5E9" : "#CED4DA"};
  overflow: hidden;
  box-sizing: border-box;
  border-top: ${({ variant }) => (variant === "standard" ? "none" : undefined)};
  border-left: ${({ variant }) => (variant === "standard" ? "none" : undefined)};
  border-right: ${({ variant }) => (variant === "standard" ? "none" : undefined)};

  border-color: ${({ theme, error, focused }) =>
    error ? "#FA5252" : focused ? "#045fbb" : undefined} !important;
`;
