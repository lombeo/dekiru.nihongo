import { ActionIcon, Card, Checkbox, Collapse, Divider, Menu } from "@mantine/core";
import Link from "@src/components/Link";
import { AppIcon } from "@src/components/cms/core/Icons";
import UserRole from "@src/constants/roles";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage, useHasAnyRole } from "@src/helpers/helper";
import { selectProfile } from "@src/store/slices/authSlice";
import TextOverflow from "components/cms/core/TextOverflow";
import { Visible } from "components/cms/core/Visible";
import { QuizAnswerList } from "modules/cms/banks/quiz/QuizAnswersList";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Dots } from "tabler-icons-react";

export const QuestionBankListItem = (props: any) => {
  const {
    data,
    onClickDelete,
    onClickEdit,
    selectable,
    onSelectChange,
    isSelected,
    isCourseBank,
    collapse = true,
    isQuizForm,
  } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const profile = useSelector(selectProfile);

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);
  const editable = data?.ownerId === profile?.userId || isManagerContent;

  const isChecked = isSelected ? isSelected(data.id) : false;

  const [isCollapse, setIsCollapse] = useState(!collapse);

  const toggleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  const getSectionEffectNames = () => {
    if (!data?.sections) {
      return [];
    }
    return data?.sections.filter((x: any) => x).map((y: any) => (resolveLanguage(y, locale) || y)?.title);
  };

  return (
    <Card className="border rounded w-full flex flex-col gap-2 h-full p-5 mb-5">
      <div className="flex gap-5 justify-between">
        {selectable && (
          <Checkbox
            className="font-semibold cursor-pointer"
            checked={isChecked}
            label={
              <>
                <TextOverflow line={2}>{resolveLanguage(data, locale)?.title}</TextOverflow>
              </>
            }
            onChange={(event: any) => onSelectChange && onSelectChange(data, event.currentTarget.checked)}
          />
        )}

        {!selectable && (
          <>
            <div style={{ maxWidth: "calc(100% - 3rem)" }}>
              <Link href={`/cms/question-bank/${data?.id}`}>
                <TextOverflow line={2}>
                  <label className="font-semibold cursor-pointer">{resolveLanguage(data, locale)?.title}</label>
                </TextOverflow>
              </Link>
            </div>

            {editable ? (
              <Menu>
                <Menu.Target>
                  <ActionIcon>
                    <Dots width={20} height={20} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<AppIcon name="edit" />} onClick={() => onClickEdit && onClickEdit(data.id)}>
                    {t(LocaleKeys["Edit"])}
                  </Menu.Item>
                  <Divider />
                  <Menu.Item
                    color="red"
                    onClick={() => onClickDelete && onClickDelete(data.id)}
                    icon={<AppIcon name="delete" />}
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
                  <Menu.Item icon={<AppIcon name="eye" />} onClick={() => onClickEdit && onClickEdit(data.id)}>
                    {t(LocaleKeys["Preview"])}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </>
        )}
        <Visible visible={!!isQuizForm}>
          <ActionIcon onClick={toggleCollapse}>
            <AppIcon name={isCollapse ? "chevron_up" : "chevron_down"} />
          </ActionIcon>
        </Visible>
      </div>

      <Visible visible={!!isQuizForm}>
        <Collapse in={isCollapse}>
          {data?.questions?.map?.((q: any, idx: number) => {
            const currentLang = resolveLanguage(q, locale) || q;
            return (
              <div key={q.id}>
                <div className="flex pl-5 gap-2">
                  <div className="flex-0">{idx + 1}.</div>
                  <div className="flex-1 text-base" dangerouslySetInnerHTML={{ __html: currentLang.content }} />
                </div>
                <QuizAnswerList questionType={q.questionType} data={q.answers} isShowFullAnswer />
              </div>
            );
          })}
        </Collapse>
      </Visible>

      <Visible visible={!isCollapse}>
        <div className="text-sm text-gray-primary flex flex-col gap-1">
          <span>
            {t(LocaleKeys["Question"])}: {data?.questionCount}
          </span>
          <span>
            {t("Owner")}: {data?.ownerName}
          </span>
          <span>
            {t(LocaleKeys["Last modified"])}: {formatDateGMT(data?.modifiedOn)}
          </span>
          <Visible visible={isCourseBank && data?.courseId && getSectionEffectNames().length}>
            <div className="mt-2 space-y-3">
              <label className="font-semibold">{t("In sections")}: </label>
              <div className="inline gap-2 flex-wrap">{getSectionEffectNames().join(", ")}</div>
            </div>
          </Visible>
        </div>
      </Visible>
    </Card>
  );
};
