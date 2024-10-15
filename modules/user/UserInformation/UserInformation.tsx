import React from "react";
import { Breadcrumbs } from "@edn/components";
import { useTranslation } from "next-i18next";
import { Container } from "@src/components";
import BoxLeft from "@src/modules/user/components/BoxLeft";
import BoxExperience from "@src/modules/profile/components/BoxLeft/components/BoxExperience";
import BoxEducation from "@src/modules/profile/components/BoxLeft/components/BoxEducation";
import { useSelector } from "react-redux";
import { selectProfile } from "@src/store/slices/authSlice";
import BoxInformation from "@src/modules/user/UserInformation/components/BoxInformation";
import SocialInfomation from "./components/SocialInfomation";
import SummaryInfomation from "./components/SummaryInfomation";

const UserInformation = () => {
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);

  return (
    <div>
      <Container>
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("My information"),
            },
          ]}
        />
        <div className="grid sm:grid-cols-[277px_auto] gap-5 mb-20 ">
          <BoxLeft activeIndex={0} />
          <div className="flex flex-col gap-5">
            <BoxInformation />
            <BoxExperience isCurrentUser userId={profile?.userId} />
            <BoxEducation isCurrentUser userId={profile?.userId} />
            <SocialInfomation isCurrentUser userProfile={profile} />
            <SummaryInfomation isCurrentUser userProfile={profile} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UserInformation;
