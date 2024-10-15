import React, { Fragment, PropsWithChildren, useCallback, useEffect } from "react";

export interface ClickAwayListenerProps {
  onClickAway: (e: MouseEvent) => void;
  outside?: Element;
}

const ClickAwayListener = ({ onClickAway, children, outside }: ClickAwayListenerProps & PropsWithChildren<any>) => {
  const activatedRef = React.useRef(false);

  useEffect(function () {
    setTimeout(function () {
      activatedRef.current = true;
    }, 0);
    return function () {
      activatedRef.current = false;
    };
  }, []);

  const handleClickAway = useCallback(
    (event: MouseEvent) => {
      if (!activatedRef.current || outside?.contains(event.target)) return;
      onClickAway(event);
    },
    [onClickAway, outside]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickAway);
    return () => {
      document.removeEventListener("mousedown", handleClickAway);
    };
  }, [handleClickAway]);

  return <Fragment>{children}</Fragment>;
};

export default ClickAwayListener;
