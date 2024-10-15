import { Breadcrumbs, Text } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ActionIcon, Badge, Button, Pagination } from "@mantine/core";
import { Container } from "@src/components";
import { getCurrentLang } from "@src/helpers/helper";
import CvItem from "@src/modules/user/ListCv/components/CvItem";
import BoxLeft from "@src/modules/user/components/BoxLeft";
import { RecruitmentService } from "@src/services/RecruitmentService";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Pencil } from "tabler-icons-react";
import ModalUpdateForeignLanguage from "./components/ModalUpdateForeignLanguage";

const ListCv = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { locale } = router;

  const profile = useSelector(selectProfile);

  const [openModalForeignLanguage, setOpenModalForeignLanguage] = useState(false);
  const [filter, setFilter] = useState({ pageIndex: 1, pageSize: 10 });

  const fetchData = async () => {
    const res = await RecruitmentService.cvList(filter);
    if (res?.data?.success) {
      return res?.data;
    }
    return null;
  };

  const { data, status, refetch } = useQuery({ queryKey: ["cvList", filter], queryFn: fetchData });

  const candidateDetail = useQuery({
    queryKey: ["candidateDetail"],
    queryFn: async () => {
      const res = await RecruitmentService.candidateDetail(profile?.userId);
      if (res?.data?.success) {
        return res?.data?.data;
      }
      return null;
    },
  });

  const foreignLanguages = candidateDetail.data?.foreignLanguages?.map((e) => getCurrentLang(e, locale)?.name);

  return (
    <div className="pb-20">
      {openModalForeignLanguage && (
        <ModalUpdateForeignLanguage
          onClose={() => setOpenModalForeignLanguage(false)}
          onSuccess={candidateDetail.refetch}
          data={candidateDetail.data}
        />
      )}
      <Container>
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("My CV"),
            },
          ]}
        />
        <div className="grid sm:grid-cols-[277px_auto] gap-7">
          <BoxLeft activeIndex={4} />
          <div className="flex flex-col gap-5">
            <div>
              <div className="font-semibold text-lg">
                <div className="flex gap-2 items-center">
                  {t("Foreign language")}{" "}
                  <ActionIcon onClick={() => setOpenModalForeignLanguage(true)}>
                    <Pencil width={20} height={20} />
                  </ActionIcon>
                </div>
                <div className="mt-2 flex-wrap flex gap-2 overflow-hidden">
                  {foreignLanguages?.map((data: any) => (
                    <Badge key={data} color="indigo" variant="dot" radius="3px">
                      {data}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="font-semibold text-lg uppercase">{t("My CV")}</div>
              <Button
                onClick={() => {
                  if (data && data.data && data.data.length >= 5) {
                    Notify.error(t("Recruitment_0025"));
                    return;
                  }
                  router.push(`/user/cv/create`);
                }}
              >
                {t("Create CV")}
              </Button>
            </div>
            {!!data?.data?.length && (
              <>
                <div className="flex flex-col gap-4">
                  {data?.data?.map((item) => (
                    <CvItem data={item} key={item.id} refetch={refetch} />
                  ))}
                </div>
                <div className="mt-8 pb-8 flex justify-center">
                  <Pagination
                    withEdges
                    value={filter.pageIndex}
                    total={data.metaData.pageTotal}
                    onChange={(page) => {
                      setFilter((prev) => ({
                        ...prev,
                        pageIndex: page,
                      }));
                    }}
                  />
                </div>
              </>
            )}
            {status === "success" && !data?.data?.length && (
              <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ListCv;
