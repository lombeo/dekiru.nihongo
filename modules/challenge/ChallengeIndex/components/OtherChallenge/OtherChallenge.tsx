import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "@src/components/Link";
import CodingService from "@src/services/Coding/CodingService";
import OtherChallengeItem from "@src/modules/challenge/ChallengeIndex/components/OtherChallenge/components/OtherChallengeItem";
import _ from "lodash";

const OtherChallenge = (props: any) => {
  const { challenge } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetch = async () => {
    const res = await CodingService.challengeList({
      pageIndex: 1,
      pageSize: 7,
      status: 0,
    });
    if (res?.data?.success) {
      const data = res.data?.data?.results;
      setData(
        _.slice(
          data?.filter((e) => e.id !== challenge.id),
          0,
          6
        )
      );
    } else {
      setData(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!challenge) return;
    fetch();
  }, [challenge]);

  return (
    <div>
      <div className="flex gap-5 justify-between items-center mt-6">
        <h2 className="text-[26px] text-[#1e266d]"> {t("Other Challenges")}</h2>
        <Link href="/challenge/list" className="text-[#2c31cf]">
          {t("View all")}
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 md:gap-6 gap-4">
        {data?.map((item) => (
          <OtherChallengeItem key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default OtherChallenge;
