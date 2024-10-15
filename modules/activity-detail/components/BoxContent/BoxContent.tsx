import { Container } from "@src/components";
import Comment from "@src/components/Comment/Comment";
import { ActivityTypeEnum } from "@src/constants/common.constant";
import { useNextQueryParam } from "@src/helpers/query-utils";
import useIsLgScreen from "@src/hooks/useIsLgScreen";
import ModalCompleteActivity from "@src/modules/activities/components/ActivityHeader/ModalCompleteActivity";
import { CommentContextType } from "@src/services/CommentService/types";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BoxSyllabus from "../BoxSyllabus";
import AssignmentActivity from "./components/AssignmentActivity";
import AttachmentActivity from "./components/AttachmentActivity/AttachmentActivity";
import BoxTab from "./components/BoxTab";
import QuizActivity from "./components/QuizActivity";
import ReadingActivity from "./components/ReadingActivity/ReadingActivity";
import ScormActivity from "./components/ScormActivity";
import ScratchActivity from "./components/ScratchActivity/ScratchActivity";

interface BoxContentProps {
  data: any;
  refetch: () => void;
}

const BoxContent = (props: BoxContentProps) => {
  const activityId = +useNextQueryParam("activityId");
  const { data, refetch } = props;

  const router = useRouter();

  const [activeTab, setActiveTab] = useState("comment");

  const isLgScreen = useIsLgScreen();

  useEffect(() => {
    if (isLgScreen && activeTab == "syllabus") {
      setActiveTab("comment");
    }
  }, [isLgScreen, activeTab]);

  return (
    // <div className="lg:max-w-[calc(100vw_-_367px)] max-w-[100vw]">
    <div className="flex-grow">
      <ModalCompleteActivity data={data} permalink={data?.permalink} />
      <ActivityRender data={data} refetch={refetch} />
      <BoxTab data={data} value={activeTab} onChange={setActiveTab} />
      <div className="pt-6 pb-20 bg-white">
        <Container>
          {activeTab === "syllabus" && (
            <div className="block lg:hidden">
              <BoxSyllabus data={data} activeId={activityId} />
            </div>
          )}
          {activeTab === "comment" && (
            <Comment
              title={data?.title}
              detailedLink={router.asPath}
              isManager={data?.isAdminContext}
              contextId={activityId}
              contextType={CommentContextType.CourseActivity}
            />
          )}
        </Container>
      </div>
    </div>
  );
};

export default BoxContent;

interface PropsActivityRender {
  data: any;
  refetch: () => void;
}

const VideoActivity = dynamic(() => import("./components/VideoActivity/VideoActivity"), {
  loading: () => <span>loading...</span>,
});

const ActivityRender = (props: PropsActivityRender) => {
  const { data, refetch } = props;

  const activityType = data?.activityType;
  const permalink = data?.permalink;
  const isExpired =
    (data?.userEnrollDeadlineTime && moment(data.userEnrollDeadlineTime, "YYYY-MM-DDTHH:mm:ss").isBefore(new Date())) ||
    (data?.userEnrollStartedTime && moment(data.userEnrollStartedTime, "YYYY-MM-DDTHH:mm:ss").isAfter(new Date()));

  if (data && activityType == ActivityTypeEnum.Reading) {
    return <ReadingActivity key={data?.activityId} isExpired={isExpired} data={data} permalink={permalink} />;
  } else if (data && activityType == ActivityTypeEnum.Video) {
    return <VideoActivity key={data?.activityId} isExpired={isExpired} data={data} />;
  } else if (data && activityType == ActivityTypeEnum.Quiz) {
    return <QuizActivity key={data?.activityId} isExpired={isExpired} permalink={permalink} data={data} />;
  } else if (data && activityType == ActivityTypeEnum.File) {
    return <AttachmentActivity key={data?.activityId} isExpired={isExpired} data={data} permalink={permalink} />;
  } else if (data && activityType == ActivityTypeEnum.Scorm) {
    return <ScormActivity key={data?.activityId} isExpired={isExpired} data={data} permalink={permalink} />;
  } else if (data && activityType == ActivityTypeEnum.Assignment) {
    return (
      <AssignmentActivity
        key={data?.activityId}
        isExpired={isExpired}
        refetch={refetch}
        permalink={permalink}
        data={data}
      />
    );
  } else if (data && activityType == ActivityTypeEnum.Scratch) {
    return (
      <ScratchActivity
        key={data?.activityId}
        refetch={refetch}
        permalink={permalink}
        data={data}
        isExpired={isExpired}
      />
    );
  }
  return <></>;
};
