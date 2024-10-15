import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Button, Container, Image, Menu, Skeleton } from "@mantine/core";
import { Bookmark, BookmarkFilled } from "@src/components/Svgr/components";
import { getCurrentLang } from "@src/helpers/helper";
import useCountries, { useGetStateLabel } from "@src/hooks/useCountries";
import useIsManagerRecruitment from "@src/hooks/useIsManagerRecruitment";
import BoxDescription from "@src/modules/company/CompanyDetail/components/BoxDescription";
import BoxRecommend from "@src/modules/company/CompanyDetail/components/BoxRecommend";
import BoxSameIndustry from "@src/modules/company/CompanyDetail/components/BoxSameIndustry";
import { RecruitmentService } from "@src/services/RecruitmentService";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import _, { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Building, Dots, MapPin, Pencil, Trash, Users } from "tabler-icons-react";

const CompanyDetail = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const permalink = router.query.permalink;

  const dispatch = useDispatch();

  const profile = useSelector(selectProfile);

  const { isManager } = useIsManagerRecruitment();

  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);

  useCountries();
  const getStateLabel = useGetStateLabel();

  const { data, status } = useQuery({
    queryKey: ["companyDetail", permalink],
    queryFn: async () => {
      const res = await RecruitmentService.companyDetail(permalink);
      const data = res?.data?.data;
      setIsBookmark(data?.isFollowed);
      return data;
    },
  });

  const handleDelete = () => {
    confirmAction({
      message: t("Are you sure you want to delete?"),
      onConfirm: async () => {
        const res = await RecruitmentService.companyDelete(data?.id);
        if (res.data?.success) {
          Notify.success(t("Delete successfully!"));
          router.push("/company");
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };
  const handleSave = async (e: any) => {
    if (!profile) {
      dispatch(setOpenModalLogin(true));
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setLoadingBookmark(true);
    const res = await RecruitmentService.candidateFollowCompany(data?.id, isBookmark);
    setLoadingBookmark(false);
    if (res.data?.success) {
      setIsBookmark((prev) => !prev);
    } else if (res.data?.message) {
      Notify.error(t(res.data?.message));
    }
  };

  return (
    <div className="pb-20">
      <Container size="xl">
        <Breadcrumbs
          data={[
            {
              href: "/company",
              title: t("List company"),
            },
            {
              title: status === "success" ? data?.name : <Skeleton width={200} height={15} />,
            },
          ]}
        />
        <div className="flex flex-col gap-6">
          <div className="rounded-md bg-white">
            <div className="relative">
              <img
                src={isNil(data?.banner) ? "/images/bg-company.png" : data.banner}
                width="100%"
                className="aspect-[1920/400] object-cover rounded-t-md overflow-hidden"
              />
              {isManager && (
                <div className="absolute right-4 top-4 z-10">
                  <Menu offset={0} zIndex={601} withArrow withinPortal shadow="md">
                    <Menu.Target>
                      <ActionIcon size="md" className="text-white hover:text-[#ccc] hover:bg-[#442A79] bg-[#442A79]">
                        <Dots width={24} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => router.push(`/company/management/${data?.id}`)}
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
              <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[40px] z-10">
                <Image
                  className="border bg-white h-min border-[#e9eaec] rounded-md overflow-hidden"
                  src={data?.logo}
                  withPlaceholder
                  fit="contain"
                  width={100}
                  height={100}
                  alt=""
                />
              </div>
            </div>
            <div className="lg:pl-[164px] px-5 lg:mt-2 mt-20 pb-6">
              {status === "success" ? (
                <div className="text-[30px] font-semibold">{data?.name}</div>
              ) : (
                <Skeleton height={45} width={300} />
              )}
              <div className="flex gap-4 items-center my-1">
                <Button
                  variant="transparent"
                  className={clsx("font-semibold px-0", {
                    "text-[#2C31CF]": isBookmark,
                  })}
                  classNames={{ leftIcon: "w-[24px] flex justify-center" }}
                  loading={loadingBookmark}
                  onClick={handleSave}
                  leftIcon={
                    isBookmark ? <BookmarkFilled width={24} height={24} /> : <Bookmark width={24} height={24} />
                  }
                >
                  {t("Save")}
                </Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-4 text-sm mt-2 border-t pt-3">
                <div className="grid gap-4 grid-cols-[44px_auto] items-center">
                  <div className="bg-[#FAFAFF] flex items-center justify-center h-[44px] w-[44px] rounded-full">
                    <MapPin width={20} height={20} color="#2C31CF" />
                  </div>
                  <div className="flex flex-col gap-1 justify-between">
                    <div>{t("Address")}</div>
                    <TextLineCamp className="font-semibold">
                      {_.uniq(data?.addresses?.map((e) => getStateLabel(e.stateId))).join(", ")}
                    </TextLineCamp>
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-[44px_auto] items-center">
                  <div className="bg-[#FAFAFF] flex items-center justify-center h-[44px] w-[44px] rounded-full">
                    <Building width={20} height={20} color="#2C31CF" />
                  </div>
                  <div className="flex flex-col gap-1 justify-between">
                    <div>{t("Company type")}</div>
                    <TextLineCamp className="font-semibold">
                      {getCurrentLang(data?.businessArea, locale)?.name}
                    </TextLineCamp>
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-[44px_auto] items-center">
                  <div className="bg-[#FAFAFF] flex items-center justify-center h-[44px] w-[44px] rounded-full">
                    <Users width={20} height={20} color="#2C31CF" />
                  </div>
                  <div className="flex flex-col gap-1 justify-between">
                    <div>{t("Company size")}</div>
                    <TextLineCamp className="font-semibold">
                      {getCurrentLang(data?.companySize, locale)?.name}
                    </TextLineCamp>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[auto_380px] gap-6">
            <div className="flex flex-col gap-6">
              <BoxDescription data={data} status={status} />
              <BoxRecommend companyId={data?.id} />
            </div>

            <div className="flex flex-col gap-6">
              {/*<BoxContact data={data} />*/}
              <BoxSameIndustry data={data} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CompanyDetail;
