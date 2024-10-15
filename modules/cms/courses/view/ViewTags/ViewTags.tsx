import { BadgeVariant, MantineSize } from "@mantine/core";
import { Badge } from "components/cms";

interface ViewTagsProps {
  data: string[] | string;
  size?: MantineSize;
  gap?: number;
  variant?: BadgeVariant | "white";
  label?: string;
  className?: string;
  uppercase?: boolean;
  onClick?: any;
}
export const ViewTags = ({
  variant,
  size = "md",
  data,
  gap = 1,
  label,
  className,
  uppercase,
  onClick,
}: ViewTagsProps) => {
  const getStyles = () => {
    switch (variant) {
      case "white":
        return "bg-white p-0";
      default:
        return "";
    }
  };
  const styles = getStyles();

  if (typeof data === "string") {
    return (
      <>
        <span>
          <Badge
            size={size}
            radius={"md"}
            className={`text-blue-500 font-normal text-${size == "md" ? "base" : size} rounded ${
              onClick ? "cursor-pointer" : ""
            } ${!uppercase ? "normal-case" : ""} 
          ${styles} 
          ${className}`}
            onClick={() => onClick && onClick(data)}
          >
            #{data}
          </Badge>
        </span>
      </>
    );
  }

  return (
    <div className={`flex ${gap ? "gap-" + gap : ""} flex-wrap overflow-auto`}>
      {label && <span className="mr-2">Tag:</span>}
      {data.map((tag: any, idx: any) => (
        <Badge
          size={size}
          radius={"md"}
          key={idx}
          className={`text-blue-500 font-normal text-${size == "md" ? "base" : size} rounded ${
            onClick ? "cursor-pointer" : ""
          } ${!uppercase ? "normal-case" : ""} 
          ${styles} 
          ${className}`}
          onClick={() => onClick && onClick(tag)}
        >
          #{tag}
        </Badge>
      ))}
    </div>
  );
};
