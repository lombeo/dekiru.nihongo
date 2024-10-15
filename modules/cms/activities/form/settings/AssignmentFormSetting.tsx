import { InputAssignmentCompletionSetting } from "../../components/assginment/InputAssignmentCompletionSetting";
import { InputAssignmentSubmissionSetting } from "../../components/assginment/InputAssignmentSubmissionSetting";

interface AssignmentFormSettingProps {
  data: any;
  register: any;
  errors: any;
  control: any;
  onChange: any;
}

export const AssignmentFormSetting = (props: AssignmentFormSettingProps) => {
  const { data, register, errors, control, onChange } = props;
  return (
    <>
      <InputAssignmentSubmissionSetting errors={errors} register={register} />

      {/* <InputAssignmentGradeSetting data={data} onChange={onChange} register={register} control={control} /> */}

      <InputAssignmentCompletionSetting register={register} />
    </>
  );
};
