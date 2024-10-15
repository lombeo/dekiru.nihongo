import { InputAdditionFileSetting } from "../../components/assginment/InputAdditionFileSetting";

interface AttachmentFormSettingProps {
  data: any;
  register: any;
  errors: any;
  control: any;
  onChange: any;
}

export const AssignmentFormSetting = (props: AttachmentFormSettingProps) => {
  const { data, onChange } = props;
  return (
    <>
      <InputAdditionFileSetting data={data} onChange={onChange} />
    </>
  );
};
