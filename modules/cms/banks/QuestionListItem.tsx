import { ActionIcon, Card, Divider, Group, Menu, Space } from "@mantine/core";
import { AppIcon } from "@src/components/cms/core/Icons";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import TextOverflow from "components/cms/core/TextOverflow";
import { Visible } from "components/cms/core/Visible";
import { COMMON_FORMAT } from "constants/cms/common-format";
import { QuestionHelper } from "helpers/question.helper";
import { ViewTags } from "modules/cms/courses/view/ViewTags/ViewTags";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { Dots } from "tabler-icons-react";

export const QuestionListItem = (props: any) => {
  const { data, onClickEditQuestion, onDelete, isAllowToEdit } = props;
  const { t } = useTranslation();
  const questionType: any = QuestionHelper.getQuestionByType(data?.questionType);

  return (
    <Card className={`border `} padding="sm">
      <Card.Section>
        <div className="flex justify-between items-center w-full px-3 bg-smoke h-10">
          <div className="text-xs flex items-center gap-2">
            <span>{t(questionType ? questionType?.label : "undefined")}</span>
          </div>
          <Visible visible={isAllowToEdit}>
            <Menu>
              <Menu.Target>
                <ActionIcon>
                  <Dots width={20} height={20} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{t(LocaleKeys.Activity)}</Menu.Label>
                <Menu.Item
                  icon={<AppIcon name="edit" />}
                  onClick={() => onClickEditQuestion && onClickEditQuestion(data.id)}
                >
                  {t(LocaleKeys["Edit"])}
                </Menu.Item>
                <Divider />
                <Menu.Item color="red" onClick={() => onDelete && onDelete(data)} icon={<AppIcon name="delete" />}>
                  {t(LocaleKeys["Delete"])}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Visible>
        </div>
      </Card.Section>
      <Space h="sm" />
      <Group>
        <div className="w-full flex flex-col text-sm gap-2">
          <div className="flex gap-5 justify-between">
            <TextOverflow>
              <label onClick={() => onClickEditQuestion && onClickEditQuestion(data.id)}>
                <label className="font-semibold cursor-pointer">{data?.title}</label>
              </label>
            </TextOverflow>
          </div>
          {questionType?.label == "Essay" ? (
            ""
          ) : (
            <span className="text-gray-primary">
              {t(LocaleKeys["Answers"])}: {data?.answers.length}
            </span>
          )}
          <span className="text-gray-primary">
            {t(LocaleKeys["Last modified"])}: {formatDateGMT(data?.modifiedOn, COMMON_FORMAT.DATE)}
          </span>
          <div>
            <ViewTags size="sm" variant="white" data={data?.tags} />
          </div>
        </div>
      </Group>
    </Card>
  );
};
