import { Breadcrumbs } from "@edn/components";
import { Container, Flex } from "@mantine/core";
import TabEvaluating from "@src/modules/mentor/MentorDetail/components/TabEvaluating";
import TabInfo from "@src/modules/mentor/MentorDetail/components/TabInfo";
import TabMentee from "@src/modules/mentor/MentorDetail/components/TabMentee";
import { LearnMentorService } from "@src/services/LearnMentor";
import { useQuery } from "@tanstack/react-query";
import BoxTop from "modules/mentor/MentorDetail/components/BoxTop";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ModalRegisterMentor from "../MentorIndex/components/ModalRegisterMentor/ModalRegisterMentor";

interface MentorDetailProps {}

const MentorDetail = (props: MentorDetailProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query?.id as any;

  const [tab, setTab] = useState("introduce");
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [mentors, setMentors] = useState();

  const fetchMentors = async () => {
    const res = await LearnMentorService.getUserMentors({
      pageIndex: 1,
      pageSize: 100,
    });
    if (res?.data?.data) {
      setMentors(res.data.data?.results);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const { data, refetch } = useQuery({
    queryKey: ["LearnMentorService.getMentorDetail", id],
    queryFn: async () => {
      if (!id) return;
      const res = await LearnMentorService.getMentorDetail({
        userId: +id,
      });
      return res?.data?.data;
    },
  });

  return (
    <div>
      {openModalEdit && (
        <ModalRegisterMentor isUpdate onSuccess={() => refetch()} onClose={() => setOpenModalEdit(false)} data={data} />
      )}
      <Container size="xl">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                href: "/mentor",
                title: t("Mentors"),
              },
              {
                title: t("Detail"),
              },
            ]}
          />
        </Flex>
        <div className="flex flex-col gap-5 mb-20">
          <BoxTop
            onClickEdit={() => setOpenModalEdit(true)}
            data={data}
            fetchMentors={fetchMentors}
            mentors={mentors}
            tab={tab}
            onTabChange={setTab}
          />
          {tab === "introduce" && <TabInfo data={data} />}
          {tab === "evaluate" && <TabEvaluating mentors={mentors} refetchDetail={refetch} />}
          {tab === "mentees" && <TabMentee onAddRejectMentee={refetch} />}
        </div>
      </Container>
    </div>
  );
};

export default MentorDetail;
