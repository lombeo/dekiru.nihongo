import { ActionIcon } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import ModalUpdateAchievement from "@src/modules/profile/components/BoxLeft/components/ModalUpdateAchievement";
import DOMPurify from "isomorphic-dompurify";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Pencil } from "tabler-icons-react";

const BoxAchievement = (props: any) => {
  const { t } = useTranslation();
  const { userProfile, refetchUserProfile, isCurrentUser } = props;

  const [openModalAchievement, setOpenModalAchievement] = useState(false);

  return (
    <>
      {openModalAchievement && (
        <ModalUpdateAchievement
          data={{
            achievement: FunctionBase.htmlDecode(
              DOMPurify.sanitize(userProfile?.achievement, { ALLOWED_TAGS: ["#text"] })
            ),
          }}
          onClose={() => setOpenModalAchievement(false)}
          onSuccess={() => refetchUserProfile()}
        />
      )}
      <div className="flex justify-between gap-4 mt-5 items-center">
        <div className="font-semibold text-lg uppercase">{t("Achievement")}</div>
        {isCurrentUser && (
          <ActionIcon color="#2C31CF" variant="transparent" onClick={() => setOpenModalAchievement(true)}>
            <Pencil width={24} />
          </ActionIcon>
        )}
      </div>

      {userProfile?.achievement && (
        <div className="mt-2 text-[15px] flex flex-col gap-1 overflow-auto max-h-[400px] break-words">
          {userProfile?.achievement
            ?.split("\n")
            ?.filter((e) => !isEmpty(e))
            ?.map((item, index) => (
              <div key={index}>{FunctionBase.htmlDecode(item)}</div>
            ))}
        </div>
      )}
    </>
  );
};

export default BoxAchievement;
