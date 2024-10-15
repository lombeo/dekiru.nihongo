import { Skeleton } from "@mantine/core";
import { useTranslation } from "next-i18next";

const CourseCardItemSkeleton = (props: any) => {
  const { t } = useTranslation();

  return (
    <div className="h-full py-3 px-1">
      <div className="h-full shadow-[0px_5px_12px_0px_#0000001A] rounded-md bg-white overflow-hidden flex flex-col justify-between">
        <Skeleton className="w-full aspect-[288/170]" width="100%" />
        <div className="h-[220px] px-4 pt-4 gap-4 flex flex-col justify-between">
          <div className="flex flex-col gap-0.5 items-start">
            <div className="flex flex-row gap-2 font-[500]">
              <div className="bg-[#DCE1FC] px-[6px] rounded-sm h-5 flex items-center justify-center">
                <span className="text-xs font-medium text-[#506CF0]">{t("Course")}</span>
              </div>
            </div>
            <Skeleton className="mt-1" width="72%" height={26} />
            <Skeleton width={80} height={20} />
            <Skeleton width={100} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardItemSkeleton;
