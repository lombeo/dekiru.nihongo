import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Button, Menu } from "@mantine/core";
import Link from "@src/components/Link";
import UserRole from "@src/constants/roles";
import { convertDate, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { useRouter } from "@src/hooks/useRouter";
import CodingService from "@src/services/Coding/CodingService";
import { isEmpty } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { Dots, Edit, FileText, Heart, Trash, Users } from "tabler-icons-react";

const BoxPoster = (props: any) => {
  const { data, refetch } = props;

  const { t } = useTranslation();

  const isContentManager = useHasAnyRole([UserRole.SiteOwner, UserRole.ManagerContent]);

  const router = useRouter();
  const { locale } = router;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const multiLang = data?.multiLang;
  const currentMultiLang = multiLang?.find((e) => e.key === keyLocale) || multiLang?.[0];

  const permalink = currentMultiLang?.permaLink;

  const tags = data?.challengeActivity?.tags?.split(",")?.filter((e) => !isEmpty(e));

  const now = moment();
  const isInTimeContest =
    data &&
    now.isSameOrAfter(convertDate(data.startTime)) &&
    (!data.endTime || now.isBefore(convertDate(data.endTime)));

  const handleDelete = () => {
    confirmAction({
      message: t("Are you sure you want delete this challenge?"),
      onConfirm: async () => {
        const res = await CodingService.challengeDelete(data?.id);
        if (res?.data?.success) {
          refetch();
          Notify.success(t("Delete successfully!"));
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  return (
    <div className="py-5 px-5 bg-[url('/images/bg-challenge.png')] bg-no-repeat bg-cover grid gap-4 grid-cols-1 lg:grid-cols-[342px_auto]">
      <div className="flex flex-col gap-1 items-center justify-center">
        <div>
          <Image src="/images/vector-challenge.png" width={304} height={187} alt="vector-challenge" />
        </div>
        <span className="text-sm font-semibold text-[#fff41b]">
          {t("Submit at most {{count}} time a day", {
            count: data?.maxAllowedDailySubmittedCount || 0,
          })}
        </span>
      </div>

      <div className="relative flex flex-col pb-2 justify-end gap-1">
        {isContentManager && (
          <Menu>
            <Menu.Target>
              <ActionIcon variant="transparent" className="absolute top-[-8px] right-0 lg:top-[44px]">
                <Dots color="#fff" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                icon={<Edit height={20} width={20} />}
                onClick={() => router.push(`/challenge/edit/${permalink}`)}
              >
                {t("Edit")}
              </Menu.Item>
              <Menu.Item color="red" onClick={handleDelete} icon={<Trash height={20} width={20} color="red" />}>
                {t("Delete")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}

        <div className="text-white font-semibold text-sm">
          {formatDateGMT(data?.startTime)} - {formatDateGMT(data?.endTime)}
        </div>
        <TextLineCamp
          line={5}
          className="lg:text-xl text-xl mt-2 leading-[33px] lg:max-w-[calc(100%_-_90px)] font-semibold text-[#fff41b]"
        >
          {currentMultiLang?.name}
        </TextLineCamp>
        <div className="flex gap-1 py-4 flex-wrap">
          {tags?.map((item) => (
            <div
              key={item}
              className="rounded-md text-white text-xs bg-[#020006] flex items-center justify-center p-[5px_8px]"
            >
              {item}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-8 text-white text-[15px]">
          <div className="flex items-center gap-1">
            <Users width={16} height={16} />
            <span>{data?.challengeActivity?.totalSubmit}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart width={16} height={16} />
            <span>{data?.challengeActivity?.point}</span>
          </div>
        </div>
        <div className="grid gap-5 items-center md:grid-cols-[auto_132px]">
          <div className="text-white flex gap-2 text-sm items-start">
            <FileText width={16} height={16} className="flex-none" />
            <TextLineCamp line={2}>{currentMultiLang?.description}</TextLineCamp>
          </div>
          {data && (
            <Link href={`/challenge/${permalink}?activityId=${data?.challengeActivity?.contextId}&activityType=12`}>
              <Button
                color="green"
                className="h-[45px] border border-[rgba(255,255,255,0.3)] font-semibold text-[16px] w-full lg:max-w-[132px] bg-gradient-to-r from-[#21B257] to-[#0C887F]"
              >
                {isInTimeContest ? t("Code now") : t("View details")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoxPoster;
