import { Breadcrumbs } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Flex } from "@mantine/core";
import { Container } from "@src/components";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { getCurrentLang } from "@src/helpers/helper";
import { useRouter } from "@src/hooks/useRouter";
import BoxPoster from "@src/modules/challenge/ChallengeIndex/components/BoxPoster";
import LeaderBoard from "@src/modules/challenge/ChallengeIndex/components/LeaderBoard";
import OtherChallenge from "@src/modules/challenge/ChallengeIndex/components/OtherChallenge";
import CodingService from "@src/services/Coding/CodingService";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const ChallengeDetail = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const permalink = router.query?.permalink as any;

  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const { data } = useQuery({
    queryKey: ["challengeDetailChallenge", permalink, filter],
    queryFn: async () => {
      const res = await CodingService.challengeDetailChallenge({
        ...filter,
        permalink: permalink,
      });
      if (!res?.data?.success) {
        Notify.error(t(res?.data?.message));
      }
      return res?.data?.data;
    },
  });

  return (
    <div className="pb-20">
      <HeadSEO title={getCurrentLang(data, locale)?.name} description={getCurrentLang(data, locale)?.description} />
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
        <BoxPoster
          data={data}
          refetch={() => {
            router.push("/challenge");
          }}
        />
        <LeaderBoard data={data} setFilter={setFilter} filter={filter} />
        <OtherChallenge challenge={data} />
      </Container>
    </div>
  );
};

export default ChallengeDetail;
