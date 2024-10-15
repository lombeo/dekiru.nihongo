import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Collapse } from "@mantine/core";
import Link from "@src/components/Link";
import { resolveLanguage } from "@src/helpers/helper";
import { useRouter } from "next/router";
import { useState } from "react";
import { Minus, Plus } from "tabler-icons-react";
import Activities from "./Activities";

interface SectionCollapseProps {
  section?: any;
  activityId?: any;
  defaultOpen?: boolean;
  schedule: any;
  permalink: string;
  isEnrolled: boolean;
}

const SectionCollapse = ({ section, permalink, schedule, activityId, isEnrolled, defaultOpen }: SectionCollapseProps) => {
  const router = useRouter();
  const locale = router.locale;

  const [collapse, setCollapse] = useState(
    defaultOpen || section?.activities?.some((activity) => activity?.activityId == activityId)
  );

  const sectionName = resolveLanguage(section, locale)?.title || section?.sectionName;

  return (
    <>
      <div
        className="flex pl-4 py-1 items-center px-4 gap-3 cursor-pointer"
        onClick={() => setCollapse((prev) => !prev)}
      >
        <ActionIcon color="gray" variant="light" size={"xs"}>
          {collapse ? <Minus size={20} /> : <Plus />}
        </ActionIcon>
        <Link href={`/learning/${permalink}?scheduleId=${schedule?.scheduleUniqueId}&sectionId=${section?.sectionId}`}>
          <TextLineCamp className="text-base font-semibold">{sectionName}</TextLineCamp>
        </Link>
      </div>
      <Collapse in={collapse}>
        <Activities key={sectionName} isEnrolled={isEnrolled} data={section?.activities} />
      </Collapse>
    </>
  );
};

export default SectionCollapse;
