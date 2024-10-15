import { Breadcrumbs } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Flex } from "@mantine/core";
import { Container } from "@src/components";
import BoxPoster from "@src/modules/challenge/ChallengeIndex/components/BoxPoster";
import LeaderBoard from "@src/modules/challenge/ChallengeIndex/components/LeaderBoard";
import OtherChallenge from "@src/modules/challenge/ChallengeIndex/components/OtherChallenge/OtherChallenge";
import CodingService from "@src/services/Coding/CodingService";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";

const ChallengeIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;

  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const { data, refetch, status } = useQuery({
    queryKey: ["challengeDetailChallenge", locale, filter],
    queryFn: async () => {
      const res = await CodingService.challengeDetailChallenge({
        ...filter,
      });
      if (!res?.data?.success) {
        Notify.error(t(res?.data?.message));
      }
      return res?.data?.data;
    },
  });

  return (
    <div className="pb-20">
      <Container>
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                title: t("Challenge"),
              },
            ]}
          />
        </Flex>
        <BoxPoster data={data} refetch={refetch} />
        <LeaderBoard data={data} setFilter={setFilter} filter={filter} />
        <OtherChallenge challenge={data} />
      </Container>
    </div>
  );
};

export default ChallengeIndex;
