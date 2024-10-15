import React, { PropsWithChildren } from "react";

interface TextLineCampProps extends PropsWithChildren<any> {
  line?: number;
  className?: string;
}

const TextLineCamp = (props: TextLineCampProps) => {
  const { line = 1, children, ...remainProps } = props;
  return (
    <span
      {...remainProps}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: line,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        wordBreak: "break-word",
        ...remainProps.style,
      }}
    >
      {children}
    </span>
  );
};

export default TextLineCamp;
