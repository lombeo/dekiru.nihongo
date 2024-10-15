import Comment from "@src/components/Comment/Comment";
import { useProfileContext } from "@src/context/Can";
import { useRouter } from "@src/hooks/useRouter";
import { CommentContextType } from "@src/services/CommentService/types";

interface ActivitiesLikeShareProps {
  activityId: number;
  isManager?: boolean;
  title: string;
}

const ActivitiesLikeShare = (props: ActivitiesLikeShareProps) => {
  const { title, activityId, isManager } = props;
  const { profile } = useProfileContext();
  const router = useRouter();

  return (
    <div className="px-5">
      {!!profile && (
        <Comment
          title={title}
          detailedLink={router.asPath}
          isManager={isManager}
          contextId={activityId}
          contextType={CommentContextType.CourseActivity}
        />
      )}
    </div>
  );
};

export default ActivitiesLikeShare;
