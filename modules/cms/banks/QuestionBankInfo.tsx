import Icon from "@edn/font-icons/icon";
import { ActionIcon, Space, Text } from "@mantine/core";
import Breadcrumbs from "@src/components/cms/core/Breadcrumbs";
import { resolveLanguage } from "@src/helpers/helper";
import TextOverflow from "components/cms/core/TextOverflow";
import { ViewTags } from "modules/cms/courses/view/ViewTags/ViewTags";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const QuestionBankInfo = (props: any) => {
  const { data, onEdit, isAllowToEdit } = props;
  const { tags } = data;
  const router = useRouter();
  const locale = router.locale;
  const { t } = useTranslation();

  const questionBankId: any = router.query.questionBankId;

  const title = resolveLanguage(data, locale)?.title;

  const getBreadCrumbs = () => {
    return [
      {
        href: "/cms/question-bank",
        title: t("Bank management"),
      },
      {
        href: `/cms/question-bank/${questionBankId}`,
        title: t("Bank"),
      },
    ];
  };

  return (
    <div className="relative">
      {/* <Can right={PERMISSION.COURSE_CREATE}> */}

      {/* </Can> */}
      <div className="hidden md:block">
        <Breadcrumbs className="items-baseline" data={getBreadCrumbs()} />
        <Space h="xl" />
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-6">
        <TextOverflow line={2} className="w-fit">
          <Text className="text-2xl filter">{title}</Text>
        </TextOverflow>
        {isAllowToEdit && (
          <ActionIcon onClick={onEdit} color="blue" radius={50} className="bg-theme-light z-50">
            <Icon name="edit" />
          </ActionIcon>
        )}
      </div>

      <Space h="sm" />
      <Text className="text-sm">
        <ViewTags size="lg" className="font-bold" gap={4} data={tags} uppercase />
      </Text>
    </div>
  );
};
