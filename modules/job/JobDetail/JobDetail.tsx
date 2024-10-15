import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ActionIcon, Badge, Button, clsx, Container, Menu, Skeleton } from "@mantine/core";
import Link from "@src/components/Link";
import { Bookmark, BookmarkFilled } from "@src/components/Svgr/components";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { getCurrentLang } from "@src/helpers/helper";
import useCountries, { useGetStateLabel } from "@src/hooks/useCountries";
import useIsManagerRecruitment from "@src/hooks/useIsManagerRecruitment";
import BoxCompany from "@src/modules/job/JobDetail/components/BoxCompany";
import BoxDescription from "@src/modules/job/JobDetail/components/BoxDescription";
import BoxGeneralInfo from "@src/modules/job/JobDetail/components/BoxGeneralInfo";
import BoxRecommend from "@src/modules/job/JobDetail/components/BoxRecommend";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrandTelegram,
  Clock,
  Coin,
  Dots,
  ExternalLink as ExternalLinkIcon,
  InfoCircle,
  MapPin,
  Pencil,
  Trash,
} from "tabler-icons-react";
import ModalApplyJob from "./components/ModalApplyJob";

const JobDetail = () => {
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);

  const { isManager } = useIsManagerRecruitment();

  const dispatch = useDispatch();

  const router = useRouter();
  const locale = router.locale;
  const permalink = router.query?.permalink;

  const [openModalApply, setOpenModalApply] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);

  useCountries();
  const getStateLabel = useGetStateLabel();

  const { data, refetch, status } = useQuery({
    queryKey: ["jobGetDetail", permalink, profile?.userId],
    queryFn: async () => {
      const res = await RecruitmentService.jobGetDetail(permalink);
      const data = res?.data?.data;
      setIsBookmark(data?.isBookmarked);
      return data;
    },
  });

  const handleSaveJob = async () => {
    if (!profile) {
      dispatch(setOpenModalLogin(true));
      return;
    }
    setLoadingBookmark(true);
    const res = await RecruitmentService.jobBookmark(data?.id, isBookmark);
    setLoadingBookmark(false);
    if (res.data?.success) {
      setIsBookmark((prev) => !prev);
    } else if (res.data?.message) {
      Notify.error(t(res.data?.message));
    }
  };

  const handleDelete = () => {
    confirmAction({
      message: t("Are you sure you want to delete?"),
      onConfirm: async () => {
        const res = await RecruitmentService.jobDelete(data?.id);
        if (res.data?.success) {
          Notify.success(t("Delete successfully!"));
          router.push("/job");
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  return (
    <div className="pb-20">
      {openModalApply && (
        <ModalApplyJob onSuccess={() => refetch()} data={data} onClose={() => setOpenModalApply(false)} />
      )}
      <Container size="xl">
        <Breadcrumbs
          data={[
            {
              href: "/",
              title: t("Home"),
            },
            {
              href: "/job",
              title: t("Recruitment"),
            },
            {
              title: status === "success" ? data?.title : <Skeleton width={200} height={15} />,
            },
          ]}
        />
        <div className="grid lg:grid-cols-[auto_380px] gap-6">
          <div className="flex flex-col gap-6">
            <div className="rounded-md shadow-md bg-white p-5">
              <div className="flex flex-col">
                <div className="flex gap-4 justify-between">
                  {status === "success" ? (
                    <div className="text-[30px] font-semibold">{data?.title}</div>
                  ) : (
                    <Skeleton height={45} width={300} />
                  )}
                  {isManager && (
                    <div className="">
                      <Menu offset={0} zIndex={601} withArrow withinPortal shadow="md">
                        <Menu.Target>
                          <ActionIcon size="md" color="gray">
                            <Dots width={24} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            onClick={() => router.push(`/job/management/${data.id}/applied`)}
                            icon={<InfoCircle color="gray" size={14} />}
                          >
                            {t("List applied")}
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => router.push(`/job/management/${data?.id}`)}
                            icon={<Pencil color="blue" size={14} />}
                          >
                            {t("Edit")}
                          </Menu.Item>
                          <Menu.Item onClick={() => handleDelete()} icon={<Trash color="red" size={14} />}>
                            {t("Delete")}
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </div>
                  )}
                </div>

                <div className="mt-1">
                  {status === "success" ? (
                    <Link
                      target="_blank"
                      className="inline-flex items-center gap-2 text-[#51595C]"
                      href={`/company/${data?.company?.permalink}`}
                    >
                      <span>{data?.company?.name}</span>
                      <ExternalLinkIcon width={20} />
                    </Link>
                  ) : (
                    <Skeleton height={24} width={160} />
                  )}
                </div>

                <div className="flex flex-col gap-4 my-5 font-semibold">
                  <div className="flex items-center gap-2 font-[900] text-[#0ab305]">
                    <Coin height={24} width={24} />{" "}
                    {data?.isNegotiateSalary ? (
                      t("Negotiable")
                    ) : data?.minSalary === 0 && data?.maxSalary === 0 ? (
                      t("No salary")
                    ) : (
                      <span>
                        {data?.minSalary} - {data?.maxSalary} {t("millions")}
                      </span>
                    )}
                  </div>
                  {data?.workplaces?.map((workplace) => (
                    <div key={workplace.id} className="flex items-center gap-2">
                      <MapPin color="#a6a6a6" height={24} width={24} /> {workplace.address},{" "}
                      {getStateLabel(workplace.stateId)}
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Clock color="#a6a6a6" height={24} width={24} /> {t("Deadline to apply")} :{" "}
                    <span className="font-semibold">{formatDateGMT(data?.submissionDeadline)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    leftIcon={<BrandTelegram width={24} height={24} />}
                    className="w-full max-w-[520px] h-[46px] font-semibold"
                    size="md"
                    onClick={() => {
                      if (profile) {
                        setOpenModalApply(true);
                      } else {
                        dispatch(setOpenModalLogin(true));
                      }
                    }}
                    disabled={data?.isApplied}
                  >
                    {data?.isApplied ? t("Have applied") : t("RecruitmentPage.Apply")}
                  </Button>
                  <Button
                    size="md"
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content={isBookmark ? t("Un save") : t("Save")}
                    data-tooltip-place="top"
                    loading={loadingBookmark}
                    onClick={handleSaveJob}
                    variant={isBookmark ? "filled" : "outline"}
                    leftIcon={
                      isBookmark ? <BookmarkFilled width={24} height={24} /> : <Bookmark width={24} height={24} />
                    }
                    className={clsx("h-[46px]", {
                      "bg-[#DBDCFD]": !isBookmark,
                    })}
                  >
                    {data && <>{isBookmark ? t("Saved") : t("Save job")} </>}
                  </Button>
                </div>
              </div>
            </div>

            <BoxDescription data={data} status={status} />

            <BoxRecommend jobId={data?.id} />
          </div>

          <div className="flex flex-col gap-6">
            <BoxCompany data={data} />

            <BoxGeneralInfo data={data} />

            <div className="rounded-md shadow-md bg-white p-5">
              <div className="font-semibold text-xl text-[#FF4D00]">{t("Industry")}</div>
              <div className="mt-2 flex-wrap flex gap-2 overflow-hidden">
                {data?.industries?.map((item) => (
                  <Badge key={item.id} className="text-[#3E4043] bg-[#F8F8F8]" color="gray" radius="3px">
                    {getCurrentLang(item, locale)?.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default JobDetail;
