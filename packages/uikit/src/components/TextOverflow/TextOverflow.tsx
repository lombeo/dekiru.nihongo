import { Tooltip } from "@mantine/core";
import Link from "components/Link";
import { default as React } from "react";
import styles from "./TextOverflow.module.scss";

interface TextOverflowProps {
  className?: string;
  style?: any;
  line?: number;
  children: any;
  title?: string;
  href?: any;
  color?: any;
  maxWidth?: string;
  position?: "top" | "left" | "right" | "bottom";
  placement?: "center" | "start" | "end";
}
const TextOverflow = (props: TextOverflowProps) => {
  const { line = 1, style, className, children, title, href, color, maxWidth, position, placement } = props;

  const content = () => {
    const wrapStyle = {
      WebkitLineClamp: line,
      maxWidth: maxWidth,
      ...style,
    };

    return (
      <div
        className={`${styles["line-clamp"]} ${className ?? ""} ${href ? "cursor-pointer" : ""} 
        ${line === 1 ? styles["line-one"] : ""}`}
        style={wrapStyle}
      >
        <Tooltip
          //wrapLines
          withArrow
          position={position}
          withinPortal
          //placement={placement}
          className="inline break-words"
          classNames={
            {
              // root: "your-root-class",
              // arrow: "your-arrow-class",
              // body: "break-words w-auto max-w-screen-sm",
            }
          }
          label={title ? title : children}
          zIndex={1000}
        >
          <span>{children}</span>
        </Tooltip>
      </div>
    );
  };
  return <>{href && href.trim().length > 0 ? <Link href={href}>{content()}</Link> : content()}</>;
};

export default TextOverflow;
