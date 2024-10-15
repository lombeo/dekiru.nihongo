import { LearnService } from "@src/services/LearnService/LearnService";
import { ClassReport } from "./ClassReport";
import { CourseReport } from "./CourseReport";
import { FightReport } from "./FightReport";
import { TrainingReport } from "./TrainingReport";
import { useEffect, useState } from "react";
import CodingService from "@src/services/Coding/CodingService";

const StatisticReport = (props: any) => {
  const { listUsers, typeReport } = props;
  const [dataLearn, setDataLearn] = useState({} as any);
  const [dataCoding, setDataCoding] = useState({} as any);
  const fetchDataLearning = async () => {
    const res = await LearnService.getLearnReportOwnerIds({
      ownerIds: listUsers,
    });
    if (res?.data?.success) {
      setDataLearn(res?.data?.data);
    }
  };
  const fetchDataCoding = async () => {
    const res = await CodingService.getCodingReportByOwnerIds({
      ownerIds: listUsers,
    });
    if (res?.data?.success) {
      setDataCoding(res?.data?.data);
    }
  };
  useEffect(() => {
    fetchDataLearning();
    fetchDataCoding();
  }, [listUsers]);

  return (
    <div className="my-4">
      {typeReport == 0 && <CourseReport data={dataLearn?.courseReport} listUsers={listUsers} />}
      {typeReport == 1 && <ClassReport data={dataLearn?.classReport} listUsers={listUsers} />}
      {typeReport == 2 && <FightReport data={dataCoding?.contestReport} listUsers={listUsers} />}
      {typeReport == 3 && <TrainingReport data={dataCoding?.trainingReport} listUsers={listUsers} />}
    </div>
  );
};
export default StatisticReport;
