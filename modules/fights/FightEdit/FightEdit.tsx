import { Notify } from "@edn/components/Notify/AppNotification";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FormFight from "../FightCreate/components/FormFight";

const FightEdit = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const contestId = router.query?.id;

  const [data, setData] = useState(null);

  const fetch = async () => {
    if (!contestId) return;
    const res = await CodingService.contestDetail({
      contestId: contestId,
    });
    const data = res?.data?.data;
    if (res?.data?.success && data) {
      if (!data.isAdmin) {
        router.push("/403");
        return;
      }
      setData(data);
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
  };

  useEffect(() => {
    fetch();
  }, [contestId]);

  if (!data) return null;

  return <FormFight isUpdate data={data} contestId={contestId} />;
};

export default FightEdit;
