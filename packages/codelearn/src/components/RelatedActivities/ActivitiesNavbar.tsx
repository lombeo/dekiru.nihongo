import Icon from "@edn/font-icons/icon";
import { Collapse } from "@mantine/core";
import { useEffect, useState } from "react";
import ActivityNavbarContent from "./ActivityNavbarContent";

interface ActivitiesNavbarProps {
  data?: any;
  completed?: any;
  failed?: any;
}

const ActivitiesNavbar = (props: ActivitiesNavbarProps) => {
  const { data, completed, failed } = props;

  const [activeSchedule, setActiveSchedule] = useState(undefined);
  useEffect(() => {
    data && setActiveSchedule(data);
  }, [data]);

  return (
    <>
      {activeSchedule &&
        activeSchedule.map((section, idx) => {
          return (
            <SectionCollapse
              key={idx}
              section={section}
              activities={section?.activities}
              completed={completed}
              failed={failed}
            />
          );
        })}
    </>
  );
};

const SectionCollapse = ({ section, completed, failed, activities }: any) => {
  const [opened, setOpen] = useState(true);

  const { title, id } = section;

  return (
    <div className={`border-b-1 mb-2 ${!opened && "pb-2"}`}>
      <div
        onClick={() => setOpen((o) => !o)}
        className="text-gray-700 font-extrabold pr-5 pl-4 py-1 text-base cursor-pointer flex items-center"
      >
        <Icon name={opened ? "angle-up" : "angle-down"} size={28} className="mr-3" />{title}
      </div>
      <Collapse in={opened}>
        <ActivityNavbarContent
          key={id}
          data={activities}
          completed={completed}
          failed={failed}
        />
      </Collapse>
    </div>
  );
};

export default ActivitiesNavbar;
