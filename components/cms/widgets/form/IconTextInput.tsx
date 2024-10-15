import { Input } from "components/cms/core";
import { AppIcon } from "../../core/Icons";

export interface InputWithIconProps {
  name: string;
  value?: string;
  placeholder?: string;
  icon?: string;
  onChange?: any;
  onKeyUp?: any;
  className?: string;
  classNames?: any;
}

export const IconTextInput = (props: any) => {
  const { name, placeholder, icon, onChange, onKeyUp, register } = props;

  return (
    <>
      <Input
        placeholder={placeholder}
        icon={<AppIcon size="md" name={icon} />}
        onChange={onChange}
        onKeyUp={onKeyUp}
        classNames={{
          ...props.classNames,
          input: "h-10 text-base rounded pl-12 " + (props.classNames ? props.classNames.input ?? "" : ""),
        }}
        className={props.className ?? ""}
        styles={{
          icon: {
            width: "48px",
          },
        }}
        autoComplete="off"
        {...register(name)}
      />
    </>
  );
};
