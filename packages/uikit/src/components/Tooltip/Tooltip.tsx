import { Tooltip as TootipMantine } from "@mantine/core";

interface TooltipProps {
  label?: string;
  opened?: true | false;
  withArrow?: true | false;
  children?: any;
  className?: any;
}

function Tooltip(props: TooltipProps) {
  const { label, children, opened, withArrow = true, className = "" } = { ...props };
  return (
    <TootipMantine
      className={className + " inline break-words"}
      classNames={{
        tooltip: "break-words w-auto max-w-screen-sm",
      }}
      label={label}
      opened={opened}
      withArrow={withArrow}
    >
      {children}
    </TootipMantine>
  );
}

export default Tooltip;
