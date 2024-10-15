import { NextPage } from "next";
import BoxLogin from "./components/BoxLogin";
import BoxReason from "./components/BoxReason";
import BoxTopReason from "./components/BoxTopReason";
import BoxFeature from "./components/BoxFeature";
import BoxStatistics from "./components/BoxStatistics";
import BoxReward from "./components/BoxReward";
import BoxEvent from "./components/BoxEvent";
import BoxComment from "./components/BoxComment";
import { useRouter } from "next/router";
import BoxLoginEn from "./components/BoxLoginEn";
import BoxReasonEn from "./components/BoxReasonEn";
import BoxTopReasonEn from "./components/BoxTopReasonEn";
import BoxFeatureEn from "./components/BoxFeatureEn";
import BoxStatisticsEn from "./components/BoxStatisticsEn";
import BoxRewardEn from "./components/BoxRewardEn";
import BoxEventEn from "./components/BoxEventEn";
import BoxCommentEn from "./components/BoxCommentEn";
import BoxRunningEvent from "./components/BoxRunningEvent";
import RunningEventModal from "./components/RunningEventModal";
import { getIsShowRunningEventModal, setIsShowRunningEventModal } from "@src/store/slices/eventSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

const IndexView: NextPage = () => {
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";
  //mt-[100px]

  const dispatch = useDispatch();

  const isShow = useSelector(getIsShowRunningEventModal);

  useEffect(() => {
    return () => {
      dispatch(setIsShowRunningEventModal(false));
    };
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {keyLocale === "en" ? (
        <>
          <BoxLoginEn />
          <BoxRunningEvent />
          <BoxReasonEn />
          <BoxTopReasonEn />
          <BoxFeatureEn />
          <BoxStatisticsEn />
          <BoxRewardEn />
          <BoxEventEn />
          <BoxCommentEn />
        </>
      ) : (
        <>
          <BoxLogin />
          <BoxRunningEvent />
          <BoxReason />
          <BoxTopReason />
          <BoxFeature />
          <BoxStatistics />
          <BoxReward />
          <BoxEvent />
          <BoxComment />
        </>
      )}

      {isShow && <RunningEventModal onClose={() => dispatch(setIsShowRunningEventModal(false))} />}
    </div>
  );
};

export default IndexView;
