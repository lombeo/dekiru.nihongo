import React, { memo, MutableRefObject, PropsWithChildren, useEffect, useMemo, useState } from "react";
import ClickAwayListener from "./ClickAwayListener";
import { usePopper } from "react-popper";
import { Options, State } from "@popperjs/core/lib/types";
import styled, { CSSObject } from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { Placement } from "@popperjs/core/lib/enums";

export interface PopoverProps {
  reference: HTMLElement | MutableRefObject<any> | null | undefined;
  open: boolean;
  onClose: () => void;
  ignoreCloseInside?: boolean;
  option?: Partial<Options>;
  width?: CSSObject["width"];
  placement?: Placement;
}

export interface PopoverRef {
  update: (() => Promise<Partial<State>>) | null;
}

const Popover = React.forwardRef<PopoverRef, PropsWithChildren<PopoverProps>>(
  ({ children, open, onClose, reference, option, placement, ...props }, ref) => {
    const uid = useMemo(() => `Popover-${uuidv4()}`, []);
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
    const current = ((reference as any)?.current || reference) as any;

    const modifiers: any[] = [
      {
        name: "offset",
        options: {
          offset: [0, 4],
        },
      },
      {
        name: "flip",
        options: {
          allowedAutoPlacements: ["bottom"],
          altBoundary: true,
        },
      },
      {
        name: "preventOverflow",
        options: {
          mainAxis: true,
        },
      },
    ];

    const { styles, attributes, update } = usePopper(current, popperElement, {
      modifiers: modifiers,
      placement: placement || "bottom-start",
      ...option,
    });

    React.useImperativeHandle(ref, () => ({
      update: update,
    }));

    useEffect(() => {
      update?.();
    }, [open]);

    return (
      <ClickAwayListener
        onClickAway={(e: { target: any }) => {
          if (!current?.contains(e.target as any)) {
            onClose();
          }
        }}
        outside={document.getElementById(uid)}
      >
        <StyledPopper
          {...attributes.popper}
          style={{ ...styles.popper }}
          open={open}
          id={uid}
          ref={setPopperElement}
          {...props}
        >
          {children}
        </StyledPopper>
      </ClickAwayListener>
    );
  }
);

const StyledPopper = styled.div<{ open: boolean; width: any }>`
  opacity: ${({ open }) => !open && 0};
  visibility: ${({ open }) => !open && "hidden"};
  pointer-events: ${({ open }) => !open && "none"};
  z-index: 1200;
  border: 1px solid #d3d4d5;
  box-shadow: 0 8px 16px rgba(168, 168, 168, 0.25);
  border-radius: 3px;
  background: #fff;
  box-sizing: border-box;
  width: ${({ width }) => width};
`;

Popover.displayName = "Popover";
export default memo(Popover);
