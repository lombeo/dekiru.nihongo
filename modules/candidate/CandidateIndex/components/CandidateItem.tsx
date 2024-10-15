import React, { Fragment } from "react";
import clsx from "clsx";
import Link from "@src/components/Link";
import { ActionIcon, Badge, Group, Menu } from "@mantine/core";
import { getCurrentLang } from "@src/helpers/helper";
import { Dots, Users } from "tabler-icons-react";
import _ from "lodash";
import { useGetStateLabel } from "@src/hooks/useCountries";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { TextLineCamp } from "@edn/components/TextLineCamp";

const CandidateItem = (props: any) => {
  const { data, index, onAddToGroup, onUpdateForeignLanguage } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const getStateLabel = useGetStateLabel();

  const workplaces = _.uniq(data.workplaces?.map((e) => getStateLabel(e.stateId)) || []);

  return (
    <Fragment key={data.id}>
      <tr className={clsx({ nthRow: index % 2 === 0 })}>
        <td className="text-center">{index}</td>
        <td>
          <Link className="text-blue-primary hover:underline" href={`/profile/${data.userId}`}>
            <div className="break-words max-w-[250px]">{data.userName}</div>
          </Link>
        </td>
        <td>
          <a className="text-blue-primary hover:underline" target="_blank" href={data.cvUrl} rel="noreferrer">
            {data.name}
          </a>
        </td>
        <td>
          <div className="flex-wrap flex gap-2 overflow-hidden">
            {data.industries?.map((item) => (
              <Badge key={item.id} variant="dot" color="orange" radius="3px">
                {getCurrentLang(item, locale)?.name}
              </Badge>
            ))}
          </div>
        </td>
        <td>{getCurrentLang(data.experience, locale)?.name}</td>
        <td className="text-right">{data.expectSalary}</td>
        <td>
          <div className="mt-auto flex-wrap flex gap-2 overflow-hidden">{workplaces?.join(", ")}</div>
        </td>
        <td>
          <Group spacing="md" position="center">
            <Menu offset={0} zIndex={601} withArrow withinPortal shadow="md">
              <Menu.Target>
                <ActionIcon size="md" color="gray">
                  <Dots width={24} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={onAddToGroup} icon={<Users color="blue" size={14} />}>
                  {t("Add to group")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </td>
      </tr>
      <tr className={clsx("border-b-4", { nthRow: index % 2 === 0 })}>
        <td colSpan={4} className="align-top">
          <div className="flex flex-col gap-1">
            {data.isOpen && (
              <Badge color="green" className="bg-[#2D7C14] w-fit text-white" radius="xs">
                {t("Open for work")}
              </Badge>
            )}
            <div>
              {t("Current level")}:&nbsp;
              <strong>{getCurrentLang(data.currentLevel, locale)?.name}</strong>
            </div>
            <div>
              {t("Expected job level")}:&nbsp;
              <strong>{getCurrentLang(data.expectLevel, locale)?.name}</strong>
            </div>
            {!!data.groups && data.groups.length > 0 && (
              <div className="flex-wrap flex gap-2 overflow-hidden">
                <span>{t("Group")}:</span>{" "}
                {data.groups.map((data: any) => (
                  <Badge key={data.id} color="blue" variant="dot" radius="3px">
                    {data.name}
                  </Badge>
                ))}
              </div>
            )}
            {!!data.skills && data.skills.length > 0 && (
              <div className="mt-1 flex-wrap flex gap-x-2 gap-y-1 overflow-hidden">
                <span>{t("Skills")}:</span>{" "}
                {data.skills.map((data: any) => (
                  <Badge key={data} color="green" variant="dot" radius="3px">
                    {data}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </td>
        <td colSpan={4} className="align-top">
          <div className="flex flex-col gap-1">
            <div>
              {t("Type of employment")}:&nbsp;
              <strong>{getCurrentLang(data.workingType, locale)?.name}</strong>
            </div>
            <div>
              {t("Education")}:&nbsp;
              <strong>{getCurrentLang(data.literacy, locale)?.name}</strong>
            </div>
            {!!data.foreignLanguages && data.foreignLanguages.length > 0 && (
              <div className="flex-wrap flex gap-x-2 gap-y-1 overflow-hidden">
                <span>{t("Foreign language")}:</span>{" "}
                <strong>
                  {data.foreignLanguages.map((data: any) => getCurrentLang(data, locale)?.name).join(", ")}
                </strong>
              </div>
            )}
            <TextLineCamp line={5}>
              {t("Career Objective")}:&nbsp;
              <strong className="whitespace-pre-line">{data.careerObjective}</strong>
            </TextLineCamp>
          </div>
        </td>
      </tr>
    </Fragment>
  );
};

export default CandidateItem;
