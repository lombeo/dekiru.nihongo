import { Select as SelectMantine, SelectProps } from "@mantine/core";

interface SelectPropsApp extends SelectProps {
  width?: any;
}
function Select(props: SelectPropsApp) {
  const { width, size } = props;
  let style = {};
  if (size == "md" || !size) {
    style = {
      input: {
        height: "42px",
        background: "transparent",
      },
    };
  }

  return (
    <SelectMantine
      classNames={{
        wrapper: `bg-white ${!!width && "w-" + width}`,
        //selected: "font-semibold",
        input: "z-10 relative bg-transparent",
      }}
      {...props}
      styles={style}
    />
  );
}

export default Select;
