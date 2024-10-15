import React, { memo, MouseEvent, ReactNode, useCallback } from "react";
import styled, { css } from "styled-components";
import { CheckBox } from "@edn/components";

export interface SelectItemProps {
  value?: any | null | undefined;
  selected?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  checkbox?: boolean;
  onSelect?: (event: MouseEvent<HTMLButtonElement>, value: any | null | undefined) => void;
  size?: "small" | "medium";
}

const SelectItem = memo(
  ({ value, disabled, children, onSelect, selected, checkbox, size = "medium" }: SelectItemProps) => {
    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onSelect?.(event, value);
      },
      [value, onSelect]
    );
    return (
      <StyledSelectItem
        data-selected={selected}
        disabled={disabled}
        role="option"
        data-event="true"
        data-value={value}
        onClick={handleClick}
        selected={selected}
        size={size}
      >
        {!!checkbox && <StyledCheckBox size="xs" checked={selected} />}
        {children}
      </StyledSelectItem>
    );
  }
);

SelectItem.displayName = "SelectItem";

const StyledCheckBox = styled(CheckBox)`
  margin-right: 8px;
  margin-top: 2px;
`;

const StyledSelectItem = styled.button<Pick<SelectItemProps, "disabled" | "selected" | "size">>`
  display: flex;
  flex: none;
  width: 100%;
  align-items: center;
  min-height: 32px;
  cursor: pointer;
  border: none;
  padding: ${({ size }) => (size === "small" ? "4px 8px" : "14px 16px")};
  border-radius: 3px;
  outline: none;
  background: transparent;
  box-sizing: border-box;
  text-align: left;
  word-break: break-word;
  font-size: ${({ size }) => (size === "small" ? "0.85rem" : "1rem")};

  &:focus-visible {
    outline: none;
  }

  margin: 0;

  &[data-selected="true"] {
    color: #fff;
    background: #045fbb;
  }

  ${({ disabled, selected }) =>
    disabled
      ? css`
          color: #a3a8af;
          pointer-events: none;
        `
      : selected
      ? null
      : css`
          &:hover,
          &.focused {
            background: #f3f4f5;
          }
        `};
`;

export default SelectItem;
