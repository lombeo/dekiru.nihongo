import { ActionIcon, Card, Checkbox, Divider, Menu, Space, Text } from "@mantine/core";
import { AppIcon } from "@src/components/cms/core/Icons";
import { COMMON_FORMAT } from "@src/config";
import UserRole from "@src/constants/roles";
import { useProfileContext } from "@src/context/Can";
import { ActivityHelper } from "@src/helpers/activity.helper";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage, useHasAnyRole } from "@src/helpers/helper";
import TextOverflow from "components/cms/core/TextOverflow";
import { ActivityTypeEnum, getActivityIcon } from "constants/cms/activity/activity.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";
import PubSub from "pubsub-js";
import { Dots } from "tabler-icons-react";

export const ActivityListItem = (props: {
  data: any;
  selectable: boolean;
  onClickEdit?: (activityData?: any) => void;
  onClickDelete?: (activityId?: number) => void;
  onClone?: (activityId?: number) => void;
  onSelectChange?: (item: any, checked: boolean) => void;
  isSelected?: (activityId: any) => boolean;
  isSelectedOld?: (activityId: any) => boolean;
}) => {
  const { data, selectable, onClickEdit, onSelectChange, onClickDelete, onClone, isSelected, isSelectedOld } = props;
  const { t } = useTranslation();
  const { profile } = useProfileContext();

  const router = useRouter();
  const locale = router.locale;

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);
  const editable = data?.ownerId === profile?.userId || isManagerContent;

  const onPreview = (activityId?: number) => {
    if (data?.type?.toString() !== ActivityTypeEnum.Code.toString()) {
      PubSub.publish("PREVIEW_ACTIVITY", data);
    } else {
      let codeType = data.activityCodeSubType ? data.activityCodeSubType : 0;
      router.push(`/cms/activity-code/${ActivityTypeEnum.Code}/edit/${data.id}?type=${codeType}`);
    }
  };

  const activityName = ActivityHelper.getActivityName(data.type as number);
  const activitySubTypeName = t(ActivityHelper.getActivityCodeSubTypeName(data.activityCodeSubType as number));
  const isChecked = isSelected ? isSelected(data.id) : false;
  const isCheckedOld = isSelectedOld ? isSelectedOld(data.id) : false;

  return (
    <Card
      className={`border ${selectable ? "cursor-pointer" : ""} ${isChecked ? "bg-blue-lighter" : ""}`}
      padding="sm"
      onClick={() => {
        if (!isCheckedOld) {
          selectable && onSelectChange && onSelectChange(data, !isChecked);
        }
      }}
    >
      <Card.Section>
        <div className="flex justify-between items-center w-full px-3 bg-smoke h-10">
          <div className="text-sm flex items-center gap-2">
            {data?.type && <AppIcon size="md" name={getActivityIcon(data?.type)} />}
            <span>
              {t(activityName ? activityName : "undefined")} {activitySubTypeName ? ` - ${activitySubTypeName}` : ""}
            </span>
          </div>
          <div className="flex gap-1">
            {selectable && (
              <Checkbox
                checked={isChecked}
                disabled={isCheckedOld}
                // onChange={(event: any) =>
                //   onSelectChange &&
                //   onSelectChange(data, event.currentTarget.checked)
                // }
              />
            )}
            {editable ? (
              <Menu>
                <Menu.Target>
                  <ActionIcon>
                    <Dots width={20} height={20} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>{t(LocaleKeys.Activity)}</Menu.Label>
                  <Menu.Item icon={<AppIcon name="edit" />} onClick={() => onClickEdit && onClickEdit(data)}>
                    {t(LocaleKeys["Edit"])}
                  </Menu.Item>
                  <Menu.Item icon={<AppIcon name="copy" />} onClick={() => onClone?.(data.id)}>
                    {t(LocaleKeys["Clone"])}
                  </Menu.Item>
                  <Divider />
                  <Menu.Item
                    color="red"
                    onClick={() => onClickDelete && onClickDelete(data.id)}
                    icon={<AppIcon name="delete" className="text-red-500" />}
                  >
                    {t(LocaleKeys["Delete"])}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Menu>
                <Menu.Target>
                  <ActionIcon>
                    <Dots width={20} height={20} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<AppIcon name="eye" />} onClick={() => onClickEdit && onClickEdit(data)}>
                    {t(LocaleKeys["View"])}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </div>
        </div>
      </Card.Section>
      <Space h="sm" />
      <div>
        <div
          className="w-full min-h-[50px] cursor-pointer hover:text-blue-hover"
          onClick={() => onPreview && onPreview()}
        >
          <Text weight={600}>
            <TextOverflow line={2}>{resolveLanguage(data, locale)?.title}</TextOverflow>
          </Text>
        </div>
        <div className="mt-1 flex gap-2 text-sm text-gray-primary">
          {t(LocaleKeys["Owner"])}: {data?.ownerName}
        </div>
        <div className="flex gap-2 text-sm text-gray-primary">
          {t(LocaleKeys["Last modified"])}: {formatDateGMT(data?.modifiedOn, COMMON_FORMAT.DATE)}
        </div>
      </div>
    </Card>
  );
};
