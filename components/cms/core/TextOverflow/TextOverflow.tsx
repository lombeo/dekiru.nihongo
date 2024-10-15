import { Tooltip } from "@mantine/core";
import Link from "components/Link";
import styles from "./TextOverflow.module.scss";

interface TextOverflowProps {
  className?: string;
  style?: any;
  line?: number;
  children: any;
  title?: string;
  href?: any;
}
const TextOverflow = (props: TextOverflowProps) => {
  const { line = 1, style, className, children, title, href } = props;

  const content = () => {
    const wrapStyle = {
      WebkitLineClamp: line,
      ...style,
    };
    return (
      <div className={`${styles["line-clamp"]} ${className ?? ""} ${href ? "cursor-pointer" : ""}`} style={wrapStyle}>
        <Tooltip
          // wrapLines
          withArrow
          // transition="fade"
          className="inline break-words"
          // transitionDuration={200}
          // classNames={{
          //   body: "break-words w-auto max-w-screen-sm",
          // }}
          label={title ? title : children}
        >
          <div>{children}</div>
        </Tooltip>
      </div>
    );
  };
  return <>{href ? <Link href={href}>{content()}</Link> : content()}</>;
};

export default TextOverflow;
