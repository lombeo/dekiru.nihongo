import { Visible } from "components/cms/core/Visible";
import { CourseBankSectionInput } from "./CourseBankSectionInput";

export const CourseBankConfigInput = (props: any) => {
  const { isSelected, onSelectFeature, watch, courseId, sessionData, onRemoveFeature, disabled } = props;

  if (!courseId) return <></>;
  const checkIsSelectedSection = (data: any) => {
    return isSelected(data, "section");
  };

  const onSelectSection = (data: any) => {
    return onSelectFeature(data, "section");
  };

  const onRemoveSection = (data: any) => {
    return onRemoveFeature(data, "section");
  };

  return (
    <>
      <Visible visible={courseId}>
        <CourseBankSectionInput
          courseId={courseId}
          watch={watch}
          isSelected={checkIsSelectedSection}
          onSubmit={onSelectSection}
          onRemove={onRemoveSection}
          disabled={disabled}
        />
      </Visible>
    </>
  );
};
