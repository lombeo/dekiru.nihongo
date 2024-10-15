import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Badge, Button, Image } from "@mantine/core";
import Link from "@src/components/Link";
import { Bookmark, BookmarkFilled } from "@src/components/Svgr/components";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useGetStateLabel } from "@src/hooks/useCountries";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const JobItem = (props: any) => {
  const { data, refetch } = props;
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);

  const getStateLabel = useGetStateLabel();

  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const tags = _.uniq(data.workplaces?.map((e) => getStateLabel(e.stateId)) || []);

  const handleSaveJob = async (e) => {
    if (!profile) {
      dispatch(setOpenModalLogin(true));
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setLoadingBookmark(true);
    const res = await RecruitmentService.jobBookmark(data?.id, data?.isBookmarked);
    setLoadingBookmark(false);
    if (res.data?.success) {
      refetch();
    } else if (res.data?.message) {
      Notify.error(t(res.data?.message));
    }
  };

  tags.push(
    <span>
      {t("Deadline to apply")}: <strong>{formatDateGMT(data.submissionDeadline)}</strong>
    </span>
  );

  return (
    <Link key={data.id} className="hover:opacity-100" href={`/job/${data.permalink}`}>
      <div className="shadow-md relative border border-transparent hover:border-[#3F25D6] cursor-pointer rounded-md bg-white p-5 grid lg:grid-cols-[100px_auto_132px] gap-5">
        <Image
          className="border bg-white mx-auto border-[#e9eaec] rounded-md overflow-hidden"
          src={data.company?.logo}
          fit="contain"
          withPlaceholder
          width={100}
          height={100}
          alt=""
        />
        <div className="flex flex-col gap-2">
          <TextLineCamp line={2} className="font-semibold">
            {data.title}
          </TextLineCamp>
          <TextLineCamp className="text-sm text-[#424e5c]">{data.company?.name}</TextLineCamp>
          <div className="mt-auto flex-wrap flex gap-2 overflow-hidden">
            {tags?.map((tag: any) => (
              <Badge key={tag} className="text-[#3E4043] bg-[#F8F8F8]" color="gray" radius="3px">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:items-end">
          <div className="text-[#3F25D6] lg:text-sm font-semibold">
            {data.isNegotiateSalary ? (
              t("Negotiable")
            ) : data?.minSalary === 0 && data?.maxSalary === 0 ? (
              t("No salary")
            ) : (
              <span>
                {data?.minSalary} - {data?.maxSalary} {t("millions")}
              </span>
            )}
          </div>
          <div className="mt-auto gap-3 lg:flex hidden">
            <Button size="xs" disabled={data?.isApplied} classNames={{ root: "text-[13px]", icon: "mr-1" }}>
              {data?.isApplied ? t("Have applied") : t("RecruitmentPage.Apply")}
            </Button>
            <ActionIcon
              size="md"
              loading={loadingBookmark}
              className="h-[30px] w-[30px] bg-[#FAFAFF] text-[#2C31CF]"
              onClick={handleSaveJob}
              color="indigo"
            >
              {data?.isBookmarked ? <BookmarkFilled width={20} height={20} /> : <Bookmark width={20} height={20} />}
            </ActionIcon>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobItem;
