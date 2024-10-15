import { Breadcrumbs } from "@edn/components";
import { Button, Card, Flex, Text } from "@mantine/core";
import { Container } from "@src/components";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { CertificateIcon, Top1, Top2, Top3, TotalCourses, UserDouble } from "@src/components/Svgr/components";
import { FunctionBase, convertDate, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { LearnClassesService } from "@src/services";
import { ApexOptions } from "apexcharts";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import Dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Edit } from "tabler-icons-react";
import ClassActivityChart from "./components/ClassActivityChart";
import LanguagesStatisticalChart from "./components/LanguagesStatisticalChart";
import TrainingChart from "./components/TrainingChart";

const ReactApexChart = Dynamic(() => import("react-apexcharts"), { ssr: false });

const ClassDetailIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [typeActivity, setTypeActivity] = useState("month");
  const [data, setData] = useState({} as any);
  const id = router.query.id;

  const fetch = async () => {
    const res = await LearnClassesService.getClassDetail({
      classId: id,
    });
    if (res?.data?.success) {
      setData(res.data.data);
    } else {
      router.push("/403");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const getTotalDuration = () => {
    let total = 0;
    for (const element of data?.learningPaths) {
      total = total + element.duration;
    }
    return total;
  };

  //Data learning path
  const series = [
    {
      data: data?.learningPaths?.map((value) => {
        return {
          x: value.title,
          y: [
            convertDate(value.startDate).getTime() - convertDate(value.startDate).getTimezoneOffset() * 60000,
            convertDate(value.endDate).getTime() - convertDate(value.endDate).getTimezoneOffset() * 60000,
          ],
          fillColor: "#008FFB",
        };
      }),
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
      events: {
        mounted: () => {
          let settings = { childList: true },
            observer = new MutationObserver(() => setLinks());
          observer.observe(document.querySelector("#chart"), settings);
          setLinks();
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const label = opts.w.globals.labels[opts.dataPointIndex];
        let diff = 0;
        for (const element of data?.learningPaths) {
          if (label == element.title) {
            diff = element.duration;
          }
        }
        return t("Duration") + ":" + diff + " " + (diff > 1 ? t("days") : t("day"));
      },
      style: {
        colors: ["#f3f4f5", "#fff"],
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "15px",
          fontWeight: 500,
        },
      },
    },
    xaxis: {
      type: "datetime",
    },
  };

  function setLinks() {
    let labels = document.querySelectorAll(".apexcharts-yaxis-label");
    for (let i = 0; i < labels.length; i++) {
      const course = data.learningPaths?.[i];
      if (!course) continue;
      labels[i].setAttribute(
        "onclick",
        `window.location.href = '/classmanagement/classcoursedetails?classId=${id}&courseid=${course.courseId}'`
      );
    }
  }

  return (
    <div className="pb-16">
      <Container>
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                href: "/classmanagement",
                title: t("List class"),
              },
              {
                title: t("Class detail"),
              },
            ]}
          />
        </Flex>
        <div className="flex flex-col gap-7">
          <Card>
            <div className="flex justify-between">
              <Text className="text-2xl font-semibold text-[#2c31cf]">{FunctionBase.htmlDecode(data?.className)}</Text>
              {(data?.isClassManager || data?.isOrgManager) && (
                <Button
                  leftIcon={<Edit size={20} />}
                  onClick={() => router.push(`/classmanagement/edit/${data?.id}`)}
                  className="uppercase"
                >
                  {t("Edit")}
                </Button>
              )}
            </div>
            <div className="flex justify-between py-5 flex-wrap items-center gap-4">
              <div className="flex items-center gap-10">
                <Text className="text-[#898989] w-[80px]">{t("Creator")}</Text>
                <div className="flex items-center gap-2">
                  <Avatar
                    src={data?.owner?.avatarUrl}
                    size="sm"
                    userExpLevel={data?.owner?.userExpLevel}
                    userId={data?.ownerId}
                  />
                  <Link href={`/profile/${data?.ownerId}`} className="text-[#337ab7]">
                    {FunctionBase.htmlDecode(data?.owner?.userName)}
                  </Link>
                </div>
              </div>
              <div className="flex gap-10">
                <Text className="text-[#898989] w-[80px]">{t("Position")}</Text>
                <Text>{FunctionBase.htmlDecode(t(data?.position))}</Text>
              </div>
              <div className="flex gap-10">
                <Text className="text-[#898989] w-[80px]">{t("Time")}</Text>
                <Text>{formatDateGMT(data?.startDate)}</Text>
              </div>
              <div className="flex gap-6 items-center">
                <Text className="text-[#898989] w-[80px] ">{t("Status")}</Text>
                {data.isShowDuration && data.classStatus == 3 ? (
                  <Text className="text-sm text-gray-500">{t("Close")}</Text>
                ) : (
                  <div />
                )}
                {data.isShowDuration && data.classStatus == 2 ? (
                  <Text className="text-sm text-green-500">{t("In process")}</Text>
                ) : (
                  <div />
                )}
              </div>
            </div>
            <div className="flex py-5">
              <div className="flex items-center gap-10">
                <Text className="text-[#898989] w-[80px]">{t("Manager")}</Text>
                <div className="flex gap-4 flex-wrap">
                  {data?.listManagers?.length > 0 &&
                    _.sortBy(_.uniqBy(data.listManagers, "userId"), [
                      (o: any) => {
                        return _.toLower(o.userName);
                      },
                    ]).map((value: any) => {
                      return (
                        <div key={value.userId} className="flex items-center gap-2">
                          <Avatar
                            src={value.avatarUrl}
                            size="sm"
                            userExpLevel={value.userExpLevel}
                            userId={value.userId}
                          />
                          <Link href={`/profile/${value.userId}`} className="text-[#337ab7]">
                            {value.userName}
                          </Link>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Text className="text-[#898989]">{t("Description")}</Text>
              <Text>{FunctionBase.htmlDecode(data?.description)}</Text>
            </div>
          </Card>
          {data?.isShowLearningPath && (
            <Card>
              <Text className="text-2xl font-semibold text-[#2c31cf]">{t("Learning path")}</Text>
              <div>
                <ReactApexChart id="chart" options={options} series={series} type="rangeBar" height={150} />
              </div>
              <div className="flex gap-1 border-b-2 py-1">
                <Text>{t("Total number of days completed")}: </Text>
                <Text className="font-semibold">{getTotalDuration() + " " + t("days")}</Text>
              </div>
              <Text className="text-sm text-red-500 pt-5">
                {t(
                  "Note: Total number of days completed does not include Saturdays, Sundays, and legal public holidays."
                )}
              </Text>
            </Card>
          )}

          <div className="flex gap-5 justify-between items-center flex-col md:flex-row">
            <Card shadow="sm" className="flex gap-6 w-full items-center">
              <div className="flex items-center">
                <UserDouble width={59} height={45} />
              </div>
              <div>
                <Text className="text-[#898989]">{t("Total Students")}</Text>
                <Text className="text-3xl text-[#333]">{data?.classStatistic?.totalMembers} </Text>
              </div>
            </Card>
            <Card shadow="sm" className="flex gap-6 w-full items-center">
              <div className="flex items-center">
                <TotalCourses width={69} height={45} />
              </div>
              <div>
                <Text className="text-[#898989]">{t("Total Courses")}</Text>
                <Text className="text-3xl text-[#333]">{data?.classStatistic?.totalCourses}</Text>
              </div>
            </Card>
            <Card shadow="sm" className="flex gap-6 w-full items-center">
              <div className="flex items-center">
                <CertificateIcon width={59} height={55} />
              </div>
              <div>
                <Text className="text-[#898989]">{t("Certificates")}</Text>
                <Text className="text-3xl text-[#333]">{data?.classStatistic?.totalCertificates}</Text>
              </div>
            </Card>
          </div>
          <div className="flex justify-between gap-6 flex-col md:flex-row">
            <Card className="md:w-[635px]">
              <div className="flex justify-between pb-5">
                <Text className="text-sm font-semibold">{t("Top rank")}</Text>
                <Link className="text-sm text-[#898989] italic" href={`/classmanagement/allclassmember/${id}`}>
                  {t("View all")}
                </Link>
              </div>
              <div className="overflow-auto">
                <div className="flex justify-between">
                  <Text className="text-sm text-[#898989] w-[5%] min-w-[30px] text-center">#</Text>
                  <Text className="text-sm text-[#898989] w-[35%] min-w-[195px] text-center">{t("Student name")}</Text>
                  <Text className="text-sm text-[#898989] w-[12%] min-w-[75px] text-center">{t("Learning")}</Text>
                  <Text className="text-sm text-[#898989] w-[12%] min-w-[75px] text-center">{t("Training")}</Text>
                  <Text className="text-sm text-[#898989] w-[12%] min-w-[75px] text-center">{t("Contests")}</Text>
                  <Text className="text-sm text-[#898989] w-[12%] min-w-[75px] text-center">{t("Certificates")}</Text>
                  <Text className="text-sm text-[#898989] w-[12%] min-w-[75px] text-center">{t("Exp")}</Text>
                </div>
                {data?.classMember?.map((value, index) => {
                  return (
                    <div key={value.userId} className="md:border-b flex justify-between py-4">
                      <div className="w-[5%] min-w-[30px] flex items-center justify-center">
                        {index == 0 && <Top1 width={28} height={21} />}
                        {index == 1 && <Top2 width={28} height={21} />}
                        {index == 2 && <Top3 width={28} height={21} />}
                        {index > 2 && <Text>{index + 1}</Text>}
                      </div>
                      <div className="flex items-center gap-2 w-[35%] min-w-[195px] pl-4">
                        <Avatar
                          src={value.avatarUrl}
                          size={33}
                          userExpLevel={value.userExpLevel}
                          userId={value.userId}
                        />
                        <Link href={`/profile/${value.userId}`} className="text-[#337ab7]">
                          <Text maw={150} className="text-ellipsis overflow-hidden">
                            {value.userName}
                          </Text>
                        </Link>
                      </div>
                      <div className="w-[12%] min-w-[75px]">
                        <Text className="text-center">{value.totalLearnings}</Text>
                      </div>
                      <div className="w-[12%] min-w-[75px]">
                        <Text className="text-center">{value.totalTrainings}</Text>
                      </div>
                      <div className="w-[12%] min-w-[75px]">
                        <Text className="text-center">{value.totalContests}</Text>
                      </div>
                      <div className="w-[12%] min-w-[75px]">
                        <Text className="text-center">{value.totalCertificates}</Text>
                      </div>
                      <div className="w-[12%] min-w-[75px]">
                        <Text className="text-center text-[#f7b100]">
                          {value.userExpLevel.currentUserExperiencePoint}
                        </Text>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card>
              <LanguagesStatisticalChart dataLanguages={data?.classStatistic?.languageStatistic} />
            </Card>
          </div>
          {/* <div className="flex gap-4 justify-between lg:flex-row flex-col">
            <Card className="md:min-w-[450px] min-w-[350px]">
              <Text className="text-sm font-semibold">{t("Training")}</Text>
              <TrainingChart dataTraningStatistic={data?.classStatistic?.trainingStatistic} />
            </Card>
            <Card className="md:min-w-[650px] min-w-[350px] flex flex-col gap-10">
              <div className="flex justify-between">
                <Text className="text-sm font-semibold">{t("Class' activity")}</Text>
                <div className="flex gap-2">
                  <Button
                    variant="subtle"
                    onClick={() => setTypeActivity("week")}
                    className={typeActivity == "week" && "bg-[#E7F5FF]"}
                  >
                    {t("Week")}
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={() => setTypeActivity("month")}
                    className={typeActivity == "month" && "bg-[#E7F5FF]"}
                  >
                    {t("Month")}
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={() => setTypeActivity("year")}
                    className={typeActivity == "year" && "bg-[#E7F5FF]"}
                  >
                    {t("Year")}
                  </Button>
                </div>
              </div>
              <ClassActivityChart
                dataClassActivity={data?.classStatistic?.activityStatistic}
                typeActivity={typeActivity}
              />
              <div className="flex justify-center gap-4">
                <div className="flex gap-2 items-center">
                  <div className="bg-[#8884d8] w-6 h-3"></div>
                  <Text>{t("Learning")}</Text>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="bg-[#82ca9d] w-6 h-3"></div>
                  <Text>{t("Training")}</Text>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="bg-[#F1646C] w-6 h-3"></div>
                  <Text>{t("Fights")}</Text>
                </div>
              </div>
            </Card>
          </div> */}
        </div>
      </Container>
    </div>
  );
};

export default ClassDetailIndex;
