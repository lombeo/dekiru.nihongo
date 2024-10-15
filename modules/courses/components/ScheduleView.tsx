import { Container } from "@src/components";
import SyllabusContent from "@src/modules/syllabus/components/SyllabusContent/SyllabusContent";
import SyllabusSidebar from "@src/modules/syllabus/components/SyllabusSidebar/SyllabusSidebar";
import { LearnCourseService } from "@src/services";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ScheduleView = (props: any) => {
  const { permalink, sectionId, scheduleId } = props;

  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;

  const [data, setData] = useState(undefined);

  useEffect(() => {
    fetchCourse(permalink);
  }, [permalink, locale]);

  const fetchCourse = async (permalink: any) => {
    try {
      const response = await LearnCourseService.getScheduleCourse({
        permalink: permalink,
      });
      if (response.data) {
        const data = response.data.data;
        setData(data);
      }
    } catch {}
  };

  let unitTime = 0;
  const activeSchedule = data?.courseScheduleList?.find((x: any, idx) => {
    unitTime = idx;
    return x.scheduleUniqueId === scheduleId;
  });
  const onlyOneSchedule = data?.courseScheduleList?.length === 1;

  return (
    <Container size="xl">
      <div className="block md:flex gap-8 pb-4">
        <SyllabusSidebar data={data} permalink={permalink} scheduleId={scheduleId} />
        <div className="md:w-3/4 w-full">
          {activeSchedule && (
            <SyllabusContent
              onlyOneSchedule={onlyOneSchedule}
              course={data}
              sectionId={sectionId}
              scheduleId={scheduleId}
              permalink={permalink}
              unitTime={unitTime}
              data={activeSchedule}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default ScheduleView;
