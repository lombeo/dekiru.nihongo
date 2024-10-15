import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import FormChallenge from "@src/modules/challenge/ChallengeCreate/components/FormChallenge";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ChallengeCreate = () => {
  const router = useRouter();

  const isContentManager = useHasAnyRole([UserRole.ManagerContent]);

  useEffect(() => {
    if (!isContentManager) {
      router.push("/403");
    }
  }, []);

  if (!isContentManager) return null;

  return <FormChallenge />;
};

export default ChallengeCreate;
