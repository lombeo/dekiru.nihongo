import { CSSProperties } from "react";
import styles from "./RawText.module.scss";
/**
 * RawText - Return HTML from string with style follow system (style guide).
 * @param props RawTextProps - a string variable include html tag.
 * @returns a HTML content.
 */
interface RawTextProps {
  content?: string;
  style?: CSSProperties;
  className?: string;
}
const RawText = (props: RawTextProps) => {
  const { content = "", style, className = "" } = props;
  return (
    <div
      style={style}
      className={`${className} ${styles["raw_text"]} ${styles["quiz_text"]}`}
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );
};

export default RawText;
