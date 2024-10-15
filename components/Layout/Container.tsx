import { MantineSize } from "@mantine/core";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import styles from "./Container.module.css";

interface ContainerProps extends PropsWithChildren {
  size?: MantineSize | "full" | "custom";
  className?: string;
}

const Container = (props: ContainerProps) => {
  const { size = "lg", children, className, ...remainProps } = props;

  return (
    <div className={`${clsx(styles[size])} ${className}`} {...remainProps}>
      {children}
    </div>
  );
};

export default Container;
/* Do not remove here. It used for tailwindcss loader
// max-w-screen-xs max-w-screen-sm max-w-screen-md max-w-screen-lg max-w-screen-xl max-w-screen-2xl
*/
