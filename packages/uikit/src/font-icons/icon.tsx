import clsx from "clsx";
import getClipPath, { listIcons } from "./iconList";

type IconNames = keyof { [P in keyof typeof listIcons] };
interface IconProps {
  type?: "filled" | "stroke";
  name: IconNames | string;
  size?: string | number;
  className?: string;
}

const Icon = (props: IconProps) => {
  const { type = "filled", name, size = "md", className = "" } = props;

  let _size: string | number;
  switch (size) {
    case "sm":
      _size = 14;
      break;
    case "md":
      _size = 16;
      break;
    case "lg":
      _size = 18;
      break;
    case "xl":
      _size = 20;
      break;
    case "2xl":
      _size = 22;
      break;
    case "3xl":
      _size = 24;
      break;
    case "big":
      _size = 48;
      break;
    default:
      if (typeof size === "number") {
        _size = size;
      } else {
        _size = 16;
      }
  }

  return (
    <span
      className={clsx(className, "inline-flex items-center content-center leading-none")}
      style={{ width: _size + "px" }}
    >
      <svg
        width={_size}
        height={_size}
        viewBox="0 0 24 24"
        fill={type == "filled" ? "currentColor" : "none"}
        stroke={type == "stroke" ? "currentColor" : "none"}
        xmlns="http://www.w3.org/2000/svg"
      >
        {getClipPath(name)}
      </svg>
    </span>
  );
};

export default Icon;
