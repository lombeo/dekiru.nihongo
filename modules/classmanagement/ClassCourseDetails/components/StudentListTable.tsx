import { ScrollArea, Text } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { Top1, Top2, Top3 } from "@src/components/Svgr/components";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import { ChevronDown, ChevronRight, CircleCheck } from "tabler-icons-react";

export default function StudentListTable(props) {
  const { dataListStudent, chapterTargetIndex } = props;
  const dataChapter =
    chapterTargetIndex > 0 ? [dataListStudent?.chapters[chapterTargetIndex - 1]] : dataListStudent?.chapters;

  const { t } = useTranslation();
  const [dropDown, setDropDown] = useState([] as any);
  const divRef = useRef();

  const handleDropdown = (index) => {
    let rawData = [...dropDown];
    for (let i = 0; i < rawData.length; i++) {
      if (rawData[i] === index) {
        rawData.splice(i, 1);
        setDropDown(rawData);
        return;
      }
    }
    rawData = [...rawData, index];
    setDropDown(rawData);
  };
  const getHeight = (chapters) => {
    let maxTotalTask = 0;
    let maxChapterIndex = -1;
    for (let i = 0; i < chapters.length; i++) {
      if (chapters[i].totalTasks > maxTotalTask) {
        maxTotalTask = chapters[i].totalTasks;
        maxChapterIndex = i;
      }
    }
    const chapterWithMaxTasks = chapters[maxChapterIndex];
    return chapterWithMaxTasks.totalTasks * 32.8 + 16 + 32 + 21;
  };
  const renderChaptersData = (value: any, index: any) => {
    const arrayChaptar = chapterTargetIndex > 0 ? [value.chapters[chapterTargetIndex - 1]] : value.chapters;
    return arrayChaptar.map((chapter) => {
      return (
        <div
          key={chapter?.chapterIndex}
          className="border-b border-r-[1px] min-w-[132px] w-full min-h-[56.8px] pt-4 px-2"
        >
          <div className="flex justify-between">
            <Text className="text-xs">{`${chapter.totalCompletedTasks}/${chapter.totalTasks}`}</Text>
            <Text className="text-xs">{Math.round((chapter.totalCompletedTasks / chapter.totalTasks) * 100)} %</Text>
          </div>
          <div className="w-full h-[5px] flex">
            <div
              style={{
                width: `${Math.round((chapter.totalCompletedTasks / chapter.totalTasks) * 100)}%`,
              }}
              className="bg-blue-500"
            ></div>
            <div className="bg-gray-300 flex-1"></div>
          </div>
          {dropDown.includes(index) && (
            <div className="py-4">
              {chapter?.tasks?.map((task: any, indexTask) => {
                return (
                  <div
                    key={task?.taskId}
                    className="flex items-center gap-2 py-2 px-1 border-b border-dashed"
                    ref={divRef}
                  >
                    <CircleCheck size={16} color={task.isCompleted ? "#4d96ff" : "#ddd"} />

                    <Link
                      className="text-xs"
                      href={`/learning/${dataListStudent.coursePermalink}?activityId=${task.taskId}&activityType=${task.taskType}`}
                    >
                      {chapterTargetIndex > 0
                        ? `${t("Task")} ${indexTask + 1}: ${task.taskName}`
                        : `${t("Task")} ${indexTask + 1}`}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };
  return (
    <div className="flex">
      <div className="w-[300px] flex flex-col ">
        <div className="bg-[#d1e3fc] flex justify-between border">
          <div className="w-[50px] px-1 border-r-[2px] py-2"></div>
          <div className="w-[80px] px-1 border-r-[2px] py-2">
            <Text>#</Text>
          </div>
          <div className="w-[180px] px-1 border-r-[2px] flex items-center justify-between py-2">
            <Text>{t("Student name")}</Text>
          </div>
        </div>
        {dataListStudent?.listMember?.results?.map((value, index: number) => {
          return (
            <div key={value.userId} className="flex justify-between border-b border-l-[1px]">
              <div className="w-[50px] border-r-[2px] flex justify-center pt-5">
                {dropDown.includes(index) ? (
                  <ChevronDown
                    width={12}
                    height={12}
                    color="orange"
                    className="cursor-pointer"
                    onClick={() => handleDropdown(index)}
                  />
                ) : (
                  <ChevronRight
                    width={12}
                    height={12}
                    color="gray"
                    className="cursor-pointer"
                    onClick={() => handleDropdown(index)}
                  />
                )}
              </div>
              <div className="w-[80px] px-1 border-r-[2px] flex pt-4 justify-center">
                {index == 0 && <Top1 width={28} height={21} />}
                {index == 1 && <Top2 width={28} height={21} />}
                {index == 2 && <Top3 width={28} height={21} />}
                {index > 2 && <Text>{index + 1}</Text>}
              </div>
              <div className="w-[180px] px-2 border-r-[2px] pt-4">
                <div className="h-10 flex gap-4">
                  <Avatar src={value.avatarUrl} size="xs" userExpLevel={value.userExpLevel} userId={value.userId} />
                  <div className="flex py-2">
                    <Link href={`/profile/${value.userId}`} className="text-[#337ab7] text-xs">
                      <Text className="overflow-hidden text-ellipsis w-[100px]">{value.userName}</Text>
                    </Link>
                  </div>
                </div>
              </div>
              {dropDown.includes(index) && (
                <div
                  style={{
                    height: getHeight(
                      chapterTargetIndex > 0 ? [value.chapters[chapterTargetIndex - 1]] : value.chapters
                    ),
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="w-[600px]">
        <ScrollArea type="hover" className="w-[100%]">
          <div className="flex border-t-2 bg-[#d1e3fc]">
            {dataChapter?.map((value) => {
              return (
                <div key={value.chapterIndex} className="min-w-[132px] w-full flex justify-center border-r-2 px-2 py-2">
                  {chapterTargetIndex > 0 ? (
                    <Text>{`${t("Chapter")} ${value.chapterIndex + 1} - ${value.chapterName}`}</Text>
                  ) : (
                    <Text>{`${t("Chapter")} ${value.chapterIndex + 1}`}</Text>
                  )}
                </div>
              );
            })}
          </div>
          {dataListStudent?.listMember?.results?.map((value, index) => {
            return (
              <div key={value?.userId} className="flex justify-between bg-gray-50">
                {renderChaptersData(value, index)}
              </div>
            );
          })}
        </ScrollArea>
      </div>
      <div className="w-[240px] flex flex-col">
        <div className="bg-[#d1e3fc] flex justify-between border">
          <div className="w-[120px] px-1 border-r-[2px] py-2">
            <Text>% {t("completed")}</Text>
          </div>
          <div className="w-[120px] px-1 border-r-[2px] py-2 flex items-center justify-center">
            <Text>{t("Total Score")}</Text>
          </div>
        </div>
        {dataListStudent?.listMember?.results?.map((value, index) => {
          return (
            <div key={value?.userId} className="flex justify-between">
              <div className="flex justify-between border-b min-h-[56.8px]">
                <div className="w-[120px] px-1 border-x-[1px] pt-2">
                  <Text className="text-xs pt-[7px] text-center">{Math.ceil(value.progress) + "%"}</Text>
                </div>
                <div className="w-[120px] px-1 border-r-[1px] pt-2">
                  <Text className="text-xs pt-[7px] text-center text-[#FAA063]">{`${value.totalScore}/${value.totalPoint}`}</Text>
                </div>
              </div>
              {dropDown.includes(index) && (
                <div
                  style={{
                    height: getHeight(
                      chapterTargetIndex > 0 ? [value.chapters[chapterTargetIndex - 1]] : value.chapters
                    ),
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
