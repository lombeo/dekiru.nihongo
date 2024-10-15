import { Notify } from "@edn/components/Notify/AppNotification";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import { useRouter } from "@src/hooks/useRouter";
import FormChallenge from "@src/modules/challenge/ChallengeCreate/components/FormChallenge";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

const ChallengeEdit = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const permalink = router.query?.permalink as any;

  const [data, setData] = useState(null);

  const isContentManager = useHasAnyRole([UserRole.ManagerContent]);

  const fetch = async () => {
    if (!permalink) return;
    const res = await CodingService.challengeDetailChallenge({
      permalink: permalink,
    });
    if (res?.data?.success) {
      const data = res?.data?.data;
      setData(data);
    } else {
      Notify.error(t(res?.data?.message));
    }
  };

  useEffect(() => {
    if (!isContentManager) {
      router.push("/403");
    } else {
      fetch();
    }
  }, [permalink]);

  if (!isContentManager || !data) return null;

  return <FormChallenge isUpdate data={data} />;
};

export default ChallengeEdit;
