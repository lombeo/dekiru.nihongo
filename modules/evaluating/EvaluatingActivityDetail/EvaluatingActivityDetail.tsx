import Activity from "@src/components/Activity";
import ActivityContextProvider from "@src/components/Activity/context/ActivityContext";
import { ActivityContextType } from "@src/services/Coding/types";

const EvaluatingActivityDetail = () => {
  return (
    <div>
      <ActivityContextProvider contextType={ActivityContextType.Evaluating}>
        <Activity notShowEdit={true} />
      </ActivityContextProvider>
    </div>
  );
};
export default EvaluatingActivityDetail;
