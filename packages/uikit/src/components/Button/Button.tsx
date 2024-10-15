import { Button as ButtonMantine, ButtonProps, MantineSize } from "@mantine/core";
import { useTranslation } from "next-i18next";
import React from "react";

interface AppButtonProps extends ButtonProps {
  colorType?: "blue" | "blue-light" | "yellow" | "red";
  color?: any;
  title?: React.ReactNode;
  children?: any;
  className?: any;
  onClick?: any;
  component?: any;
  target?: any;
  href?: any;
  variant?: any;
  size?: MantineSize;
}
/**
 * Button - Accept all props follow Mantine Button except sx style case colorType is setted.
 * @param AppButtonProps extends SharedButtonProps
 * @returns Button with style follow base.
 */
const Button = (props: AppButtonProps) => {
  const { t } = useTranslation();
  const { children, variant, onClick, title, colorType, size = "md" } = props;
  //Define base color
  const styleObj = ColorObj(colorType, variant);
  return (
    <ButtonMantine
      {...props}
      variant={variant}
      title={t(title as any)}
      onClick={onClick}
      size={size}
      sx={colorType && (() => styleObj)}
      component={props.component ?? undefined}
      href={props.href ?? undefined}
      target={props.target ?? undefined}
    >
      {children}
    </ButtonMantine>
  );
};
export default Button;

const ColorObj = (colorType, variant) => {
  let colorPreset = {};
  if (variant == "outline") {
    //Need more improve.
    switch (colorType) {
      case "blue-light":
        colorPreset = {
          background: "transparent",
          backgroundHover: "var(--color-blue)",
          backgroundFocus: "var(--color-blue)",
          color: "var(--color-blue)",
          colorHover: "var(--color-white)",
          colorFocus: "var(--color-white)",
        };
        break;
      default:
        colorPreset = {
          background: "var(--color-blue)",
          backgroundHover: "var(--color-blue-hover)",
          backgroundFocus: "var(--color-blue-pressed)",
          color: "var(--color-white)",
          colorHover: "var(--color-white)",
          colorFocus: "var(--color-white)",
        };
        break;
    }
  } else {
    //Add More color???
    switch (colorType) {
      case "blue-light":
        colorPreset = {
          background: "var(--color-blue-light)",
          backgroundHover: "var(--color-blue)",
          backgroundFocus: "var(--color-blue)",
          color: "var(--color-blue)",
          colorHover: "var(--color-white)",
          colorFocus: "var(--color-white)",
        };
        break;
      default:
        colorPreset = {
          background: "var(--color-blue)",
          backgroundHover: "var(--color-blue-hover)",
          backgroundFocus: "var(--color-blue-pressed)",
          color: "var(--color-white)",
          colorHover: "var(--color-white)",
          colorFocus: "var(--color-white)",
        };
        break;
    }
  }
  //Assign color to sx of Mantine for override color, style;
  return {
    backgroundColor: colorPreset["background"],
    color: colorPreset["color"],
    transition: "all 300ms",
    "&:hover": {
      backgroundColor: colorPreset["backgroundHover"],
      color: colorPreset["colorHover"],
    },
    "&:focus, &:focus-visible": {
      backgroundColor: colorPreset["backgroundFocus"],
      color: colorPreset["colorFocus"],
      outline: "1px dotted var(--color-black)",
    },
  };
};
