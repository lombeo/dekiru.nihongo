import { ACTIVITY_SUB_CHANEL } from "@src/constants/activity/activity.constant";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BoxContent from "./components/BoxContent";
import BoxSyllabus from "./components/BoxSyllabus";
import Toolbar from "./components/Toolbar";
import useFetchActivity from "./hooks/useFetchActivity";
import Split from "react-split";
import { useMediaQuery } from "@mantine/hooks";

const ActivityDetail = () => {
  const router = useRouter();
  const { permalink } = router.query as any;
  const locale = router.locale;
  const activityId = +useNextQueryParam("activityId");

  const profile = useSelector(selectProfile);

  const fetchActivity = useFetchActivity();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const queryKey = ["course-activity", activityId, profile?.userId, locale, permalink];

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchActivity(activityId, permalink),
    placeholderData: (previousData, previousQuery) => previousData,
  });

  useEffect(() => {
    const onMarkComplete = PubSub.subscribe(ACTIVITY_SUB_CHANEL.MARK_COMPLETE_ACTIVITY, (chanel, data) => {
      if (data?.activityId) {
        refetch();
      }
    });

    return () => {
      PubSub.unsubscribe(onMarkComplete);
    };
  }, []);

  console.log("isMobile", isMobile);

  return (
    <div className="border-b relative" id="activity-content">
      <Toolbar data={data} />

      <div>
        {isMobile ? (
          <BoxContent data={data} refetch={refetch} />
        ) : (
          <Split
            sizes={[15, 85]}
            minSize={60}
            expandToMin={false}
            gutterSize={5}
            gutterAlign="center"
            snapOffset={60}
            dragInterval={1}
            direction="horizontal"
            className="flex"
            cursor="col-resize"
          >
            <BoxSyllabus data={data} activeId={activityId} />
            <BoxContent data={data} refetch={refetch} />
          </Split>
        )}
      </div>
    </div>
  );
};

export default ActivityDetail;
