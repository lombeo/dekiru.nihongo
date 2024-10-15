import { Breadcrumbs } from "@edn/components";
import { Flex, Tabs } from "@mantine/core";
import { getAccessToken } from "@src/api/axiosInstance";
import { Container } from "@src/components";
import { useRouter } from "@src/hooks/useRouter";
import BoxActivity from "@src/modules/profile/components/BoxActivity";
import BoxContest from "@src/modules/profile/components/BoxContest";
import BoxCourse from "@src/modules/profile/components/BoxCourse";
import BoxDiscussion from "@src/modules/profile/components/BoxDiscussion";
import BoxLeft from "@src/modules/profile/components/BoxLeft/BoxLeft";
import BoxSharing from "@src/modules/profile/components/BoxSharing";
import BoxTraining from "@src/modules/profile/components/BoxTraining";
import { LearnCourseService } from "@src/services";
import CodingService from "@src/services/Coding/CodingService";
import SharingService from "@src/services/Sharing/SharingService";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const { id } = router.query;
  const parts = router.asPath.split("?");
  const params = parts ? new URLSearchParams(parts[1]) : new URLSearchParams();
  const activeTabKey = params.get("tab") || "learning";

  const isShowContributor = activeTabKey === "contributor";

  const profile = useSelector(selectProfile);

  const token = getAccessToken();

  const [userProfile, setUserProfile] = useState(null);
  const [userCertificates, setUserCertificates] = useState(null);
  const [userDiscussionStatistic, setUserDiscussionStatistic] = useState(null);
  const [userActivities, setUserActivities] = useState(null);

  const dispatch = useDispatch();

  const isContributor = userProfile?.isContributor;

  const fetchData = () => {
    if (!id || !profile) return;
    refetchUserProfile();
    refetchUserActivity();
    LearnCourseService.getCertificationOfUser({
      userId: id,
      progress: false,
    }).then((res) => {
      setUserCertificates(res?.data?.data);
    });
    SharingService.discussionGetUserDiscussionStatistic({
      userId: id,
      progress: false,
    }).then((res) => {
      setUserDiscussionStatistic(res?.data?.data);
    });
  };

  const refetchUserActivity = async () => {
    const res = await CodingService.getUserActivityStatistics({
      userId: id,
      progress: false,
    });
    setUserActivities(res?.data?.data);
  };

  const refetchUserProfile = async () => {
    const res = await CodingService.userViewUserProfile({
      userId: id,
      progress: false,
    });
    setUserProfile(res?.data?.data);
  };

  const handleTabChange = (tabKey: string) => {
    router.push(
      {
        pathname: `/profile/${id}`,
        query: {
          tab: tabKey,
        },
      },
      null,
      {
        shallow: true,
      }
    );
  };

  useEffect(() => {
    fetchData();
  }, [id, profile?.userId]);

  return (
    <div>
      <Container size="custom">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                title: t("Profile"),
              },
            ]}
          />
        </Flex>
        {!token && (
          <div
            className="text-[red] font-semibold cursor-pointer italic mb-4 hover:underline"
            onClick={() => {
              dispatch(setOpenModalLogin(true));
            }}
          >
            {t("Please login to view user profile")}
          </div>
        )}
        <div className="grid gap-5 lg:grid-cols-[312px_1fr] mb-20">
          <BoxLeft
            userId={id}
            refetchUserProfile={refetchUserProfile}
            userProfile={userProfile}
            userCertificates={userCertificates}
          />
          <div className="flex flex-col gap-5">
            {isContributor && (
              <Tabs
                classNames={{ tabLabel: "font-[700] text-xl", tab: "aria-selected:text-[#2C31CF]" }}
                value={activeTabKey}
                onTabChange={handleTabChange}
              >
                <Tabs.List>
                  <Tabs.Tab value="learning">{t("Learning")}</Tabs.Tab>
                  <Tabs.Tab value="contributor">{t("Contribute")}</Tabs.Tab>
                </Tabs.List>
              </Tabs>
            )}
            <BoxCourse userId={+id} isShowContributor={isShowContributor} />
            <BoxContest userId={+id} isShowContributor={isShowContributor} />
            <BoxTraining userId={+id} isShowContributor={isShowContributor} />
            {isShowContributor ? (
              <BoxSharing userId={+id} />
            ) : (
              <div className="grid lg:grid-cols-2 gap-5">
                <BoxDiscussion userDiscussionStatistic={userDiscussionStatistic} />
                <BoxActivity userActivities={userActivities} />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
