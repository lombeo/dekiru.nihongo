import Activity from "@src/components/Activity";
import ActivityContextProvider from "@src/components/Activity/context/ActivityContext";
import { ActivityContextType } from "@src/services/Coding/types";

const WarehouseActivity = () => {
  return (
    <div>
      <ActivityContextProvider contextType={ActivityContextType.Warehouse} >
        <Activity />
      </ActivityContextProvider>
    </div>
  );
};

export default WarehouseActivity;
