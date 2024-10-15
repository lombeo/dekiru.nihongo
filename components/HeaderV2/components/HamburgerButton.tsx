import React from "react";
import styled from "styled-components";
import clsx from "clsx";

interface HamburgerButtonProps {
  opened: boolean;
  onClick: () => void;
}

const HamburgerButton = (props: HamburgerButtonProps) => {
  const { opened, onClick } = props;
  return (
    <StyledHamburgerButton className="lg:hidden" onClick={onClick}>
      <HamburgerIcon
        id="hamburger-icon-header"
        className={clsx({
          opened: opened,
        })}
      />
    </StyledHamburgerButton>
  );
};

export default HamburgerButton;

const StyledHamburgerButton = styled.div<any>`
  position: relative;
  width: 24px;
  height: 24px;
  transition: 0.5s ease-in-out;
  cursor: pointer;
  order: 99;
`;

const HamburgerIcon = styled.div<any>`
  width: 100%;
  top: calc(50% - 1px);
  left: 50%;
  height: 2px;
  //background: #3b3c54;
  transform-origin: center;
  transition: 0.5s ease-in-out;
  display: block;
  position: absolute;
  transform: translateX(-50%);

  &.opened {
    transform: translateX(-50%) rotate(45deg);
    &:before {
      transform: rotate(90deg);
      top: 0;
    }
    &:after {
      transform: rotate(90deg);
      bottom: 0;
    }
  }

  &:before,
  &:after {
    transition: 0.5s ease-in-out;
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    //background: #3b3c54;
  }
  &:before {
    top: -8px;
  }
  &:after {
    bottom: -8px;
  }
`;
