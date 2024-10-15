import React from "react";
import SyllabusItem from "./components/SyllabusItem";

const SyllabusSchedule = (props: any) => {
  const { data, scheduleId } = props;

  return (
    <div className="border-t">
      {data &&
        data.length > 0 &&
        data.map((item: any, idx: any) => {
          return <SyllabusItem idx={idx} data={item} key={idx} isActive={item.scheduleUniqueId == scheduleId} />;
        })}
    </div>
  );
};

export default SyllabusSchedule;
