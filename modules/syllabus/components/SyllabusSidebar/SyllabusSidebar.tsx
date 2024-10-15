import { Drawer } from "@mantine/core";
import ScheduleNavigator from "@src/modules/activities/components/ScheduleNavigator/ScheduleNavigator";
import { useLayoutEffect, useRef, useState } from "react";

const SyllabusSidebar = (props: any) => {
  const { data, scheduleId, permalink } = props;
  const [isOpenLessonList, setIsOpenLessonList] = useState(false);
  const targetRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const resetDimensions = () => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      });
    }
  };

  useLayoutEffect(() => {
    resetDimensions();
  }, []);

  return (
    <>
      <Drawer onClose={() => setIsOpenLessonList(false)} opened={isOpenLessonList}>
        {data && (
          <ScheduleNavigator
            permalink={permalink}
            courseScheduleList={data.courseScheduleList}
            isEnrolled={data.isEnrolled}
            scheduleId={scheduleId}
          />
        )}
      </Drawer>
      <div ref={targetRef} className="w-1/4 hidden lg:block">
        <div className="lg:fixed lg:top-[88px] z-20" style={{ width: dimensions.width }}>
          {data && (
            <ScheduleNavigator
              permalink={permalink}
              courseScheduleList={data.courseScheduleList}
              isEnrolled={data.isEnrolled}
              scheduleId={scheduleId}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SyllabusSidebar;
