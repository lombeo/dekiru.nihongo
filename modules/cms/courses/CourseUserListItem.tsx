import Icon from "@edn/font-icons/icon";
import { ActionIcon } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { Visible } from "components/cms/core/Visible";

export const CourseUserListItem = (props: any) => {
  const { data, onRemove, onOpenSetting, canDelete, isCourseOwner } = props;
  const { hovered, ref } = useHover();

  return (
    <div ref={ref}>
      <div key={data.id} className="flex items-center gap-1">
        <div className="flex flex-col">
          <label className="text-sm text-blue-500 font-semibold">
            {data?.fullName ? data?.fullName : data?.userName}
          </label>
          <label className="text-xxs text-gray-primary">{data?.email ? data?.email : data?.userName}</label>
        </div>
        <div className="flex-grow"></div>
        {hovered && (
          <>
            <Visible visible={canDelete}>
              <ActionIcon onClick={() => onOpenSetting(data)} variant="hover" hidden={!isCourseOwner}>
                <Icon name="edit" />
              </ActionIcon>
            </Visible>
            <Visible visible={canDelete}>
              <ActionIcon onClick={() => onRemove(data)} variant="hover" hidden={!isCourseOwner}>
                <Icon name="delete" />
              </ActionIcon>
            </Visible>
          </>
        )}
      </div>
    </div>
  );
};
