import { Button as MantineButton } from "@mantine/core";
import styles from "./AppButton.module.scss";

export const Button = (props: any) => {
  let { isSquare, ...rest } = props;
  const { preset } = props;
  isSquare = props.isSquare ?? false;
  let btnVariant: any = "default",
    size = props.size,
    color = props.color,
    className = props.className ?? "";

  if (preset !== undefined) {
    className +=
      " " +
      styles["app-button"] +
      " rounded " +
      styles[preset + "-button"] +
      " " +
      (size ? styles[size] : "") +
      " " +
      (color ? styles[color] : "");
  }
  if (isSquare) {
    className += " " + styles["square-style"];
  }
  if (preset === "primary") {
    btnVariant = "filled";
  } else if (preset === "secondary") {
    btnVariant = "outline";
  } else if (preset === "tetiary" || preset === "subtle") {
    btnVariant = "subtle";
  }
  return (
    <MantineButton
      {...rest}
      component={props.component ?? undefined}
      href={props.href ?? undefined}
      target={props.target ?? undefined}
      title={props.title}
      hidden={props.hidden}
      variant={btnVariant ?? undefined}
      onClick={props.onClick}
      disabled={props.disabled}
      className={className}
    >
      {props.children}
    </MantineButton>
  );
};
