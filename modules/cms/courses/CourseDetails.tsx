import { Card } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Grid, Image } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { NotFound } from "@src/components/NotFound/NotFound";
import { AppIcon } from "@src/components/cms/core/Icons";
import UserRole from "@src/constants/roles";
import { useProfileContext } from "@src/context/Can";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage, useHasAnyRole } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import { BlurBackground, Button, Tabs, Text, confirmAction } from "components/cms";
import RawText from "components/cms/core/RawText/RawText";
import { Visible } from "components/cms/core/Visible";
import { GroupCourseTypeEnum, MoneyEnum } from "constants/cms/course/course.constant";
import { useRouter } from "hooks/useRouter";
import _ from "lodash";
import { QuestionBank } from "modules/cms/banks/QuestionBank";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useRef, useState } from "react";
import { SectionService } from "services/section";
import styles from "./CourseDetails.module.scss";
import { CourseForm } from "./CourseForm";
import { CourseInfo } from "./CourseInfo";
import { CourseScheduleContainer } from "./CourseScheduleContainer";
import { CourseSidebarView } from "./CourseSidebarView";
import ModalSchedule from "./components/ModalSchedule";
import ModalSection from "./components/ModalSection";
import { SectionItem } from "./components/SectionItem";

//var tabs = ["section", "session", "bank"];
export const CourseDetails = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const { activeSectionId }: any = router.query;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const slug: any = router.query.slug;
  const isCreate = slug[0] === "create";
  const courseId = slug[0];
  const isCourseCode = slug[0] !== "create" && isNaN(+courseId);

  const [tabs, setTabs] = useState<any>(["section", "session", "bank"]);
  const tab = slug[1] ? slug[1] : tabs[0];

  const [released, setReleased] = useState(false);
  const canPublish = true;
  const [isEdit, setIsEdit] = useState(isCourseCode || isCreate);

  const initData = {
    createdOn: "",
    modifiedOn: "",
    id: 0,
    ownerId: 0,
    categoryId: null,
    providerId: null,
    visibleMode: 0,
    type: GroupCourseTypeEnum.Personal,
    moneyType: MoneyEnum.VND,
    title: "",
    summary: "",
    about: "",
    requirements: "",
    code: "",
    thumbnail: "",
    price: 0,
    tags: null,
    publishedOn: "",
    courseUsers: [],
    sections: [],
    sessionGroups: [],
    schedule: [],
    skills: [],
    approxDuration: 0,
    courseLevel: 0,
    scheduleUnit: 0,
  };
  const [course, setCourse] = useState<any>(initData);
  const [courseSessions] = useState<any>([]);
  const [thumbnailFile, setThumbnailFile] = useState<any>();
  const [activeTab, setActiveTab] = useState(0);
  const [openModalSchedule, setOpenModalSchedule] = useState(false);
  const [scheduleSelected, setScheduleSelected] = useState<any>(null);
  const [openModalSection, setOpenModalSection] = useState(false);
  const refSelectedSection = useRef<any>(null);

  const currentLangData = resolveLanguage(course, locale);

  const { profile } = useProfileContext();
  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);
  const editable = course?.ownerId === profile?.userId || isManagerContent;

  const fetchData = () => {
    CmsService.getCourseDetails(
      isCourseCode
        ? { code: courseId }
        : {
            id: courseId,
          }
    ).then((response: any) => {
      if (response && response.data) {
        setTabs(["section"]);
        setCourse(response.data);
      }
    });
  };

  useEffect(() => {
    if (!isCreate) {
      fetchData();
    }
  }, [isCreate, courseId]);

  useEffect(() => {
    const onCourseUpdateSection = PubSub.subscribe("COURSE_UPDATE_SECTION_SESSION", fetchData);
    return () => {
      PubSub.unsubscribe(onCourseUpdateSection);
    };
  }, []);

  const getThumbnail = () => {
    const thumbnail = course?.thumbnail;
    if (!thumbnailFile) {
      return thumbnail;
    }
    return thumbnailFile;
  };

  const onSave = (values: any) => {
    const storeAction = async (model: any) => {
      let res: any;
      if (model.isCombo) {
        res = await CmsService.addOrUpdateCourseCombo(model, isCreate);
      } else {
        res = await CmsService.addOrUpdateCourse(model, isCreate);
      }

      if (!res?.data) {
        return;
      }

      if (res?.data?.Message) {
        Notify.error(t(res?.data?.Message));
        return;
      }

      setIsEdit(false);
      if (isCreate) {
        const sectionId = res.data.sections?.[0]?.id;
        if (sectionId && !model.isCombo) {
          CmsService.removeSection(sectionId);
        }
        router.push(`/cms/course/${res.data.id}`, undefined, {
          shallow: true,
        });
      } else {
        fetchData();
      }
    };
    const sectionField = isEdit ? "sections" : "initialSections";
    const formBody = {
      ...values,
      moneyType: +values.moneyType,
      ...{
        [sectionField]: courseSessions,
      },
    };
    storeAction(formBody);
  };

  const onPublish = () => {
    const onConfirm = () => {
      CmsService.publishCourse({ id: course.id, published: true }).then((response: any) => {
        if (!response) return;
        Notify.success(t("Publish course successfully"));
        setIsEdit(false);
        fetchData();
      });
    };
    confirmAction({
      message: t("Are you sure to publish this course?"),
      onConfirm,
    });
  };

  const onClickAddNewSection = (scheduleUniqueId: any) => {
    // if (courseSections.some((x: any) => x.id == undefined)) {
    //   Notify.error(t("Please finish isCreate the previous section to continue."));
    // } else {
    // }
    setOpenModalSection(true);
    refSelectedSection.current = {
      scheduleUniqueId: scheduleUniqueId,
    };
  };

  const onAddOrUpdateItemSection = (sectionId: number, title: string, oldData: any) => {
    const currentLang = keyLocale;
    let multiLangData = oldData.multiLangData || [];
    const langData = {
      key: currentLang,
      title,
    };
    const langDataOther = {
      key: currentLang == "en" ? "vn" : "en",
      title,
    };
    multiLangData = [...multiLangData.filter((e: any) => e.key !== currentLang), langData];
    if (multiLangData.length <= 1) {
      multiLangData = [...multiLangData, langDataOther];
    }
    multiLangData.forEach((e: any) => {
      if (_.isEmpty(e.title)) {
        e.title = title;
      }
    });
    multiLangData = multiLangData?.filter((e: any) => !!e.key);

    // Check null
    if (sectionId > 0) {
      CmsService.updateSection({ id: sectionId, title, multiLangData }).then((response: any) => {
        if (!response) return;
        fetchData();
        Notify.success(t("Update section successfully"));
      });
    } else {
      const section = course.sections?.find((x: any) => {
        return !x.id;
      });
      CmsService.addSection({
        courseId: course.id,
        title,
        multiLangData,
        scheduleUniqueId: section?.scheduleUniqueId,
        SkipDuplicateValidation: true,
      }).then((response: any) => {
        if (!response) return;
        Notify.success(t("Add new section successfully"));
        fetchData();
      });
    }
  };

  const onRemoveItem = (id: number) => {
    CmsService.removeSection(id).then((response: any) => {
      if (!response) return;
      Notify.success(t("Delete section successfully"));
      fetchData();
    });
  };

  const onDiscard = () => {
    if (!isCreate) {
      setIsEdit(false);
      setThumbnailFile(course?.thumbnail);
    } else {
      router.push("/cms/courses");
    }
  };

  const onDelete = () => {
    const onConfirm = () => {
      CmsService.deleteCourse(course.id).then((response: any) => {
        if (!response) return;
        Notify.success(t("Delete course successfully"));
        router.push(`/cms/courses`);
      });
    };

    confirmAction({
      message: t("Are you sure to delete this course?"),
      onConfirm,
    });
  };

  const onChangeSyllabusTab = (tabKey: any) => {
    router.push(`/cms/course/${course.id}/${tabKey}`);
  };

  const renderTaps = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-3">
          {course.type != GroupCourseTypeEnum.Personal && (
            <Tabs
              onTabChange={onChangeSyllabusTab}
              value={tab}
              classNames={{
                root: "course-tabs",
                // tabsListWrapper: "course-tabs-wrapper border-none",
                // tabControl:
                //   "rounded border-none m-1 font-medium text-base px-3 ml-2 hover:bg-[#eff6fc]  hover:text-blue-500",
                // tabActive: "bg-[#eff6fc] border-none mx-0",
                // tabInner: "",
                tabLabel: "capitalize",
              }}
            >
              <Tabs.List>
                {tabs.map((x: any) => (
                  <Tabs.Tab key={x} value={x + ""}>
                    {t(x)}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          )}
        </div>
      </div>
    );
  };

  if (!course || (course.id === 0 && !isCreate)) return null;

  const releaseCourse = () => {
    const onConfirm = () => {
      CmsService.releaseCourse({ id: course.id }).then((response: any) => {
        if (!response) return;

        Notify.warning("Release course inprogress...", "Release Course");
        setIsEdit(false);
        fetchData();
      });
    };
    confirmAction({
      message: t("Are you sure to publish this course?"),
      onConfirm,
    });
  };

  const onTabChange = (value: any) => {
    setActiveTab(value);
  };

  function onMove(id: number, direction: boolean) {
    SectionService.moveSection({
      id,
      up: direction,
    }).then((x: any) => {
      if (x) {
        Notify.success(t("Move activity successfully"));
        fetchData();
      }
    });
  }

  const schedules = [...(course.schedule ?? [])];

  const renderSyllabus = (scheduleUniqueId: any = undefined) => {
    return (
      <div>
        {openModalSection && (
          <ModalSection
            courseId={course.id}
            onSuccess={() => fetchData()}
            data={refSelectedSection.current?.data}
            scheduleUniqueId={refSelectedSection.current?.scheduleUniqueId}
            onClose={() => setOpenModalSection(false)}
          />
        )}
        {course.sections
          ?.filter((e: any) => e.scheduleUniqueId === scheduleUniqueId)
          ?.map((x: any, idx: number) => (
            <SectionItem
              key={x.uniqueId ? x.uniqueId + locale : x.id + locale}
              index={idx}
              data={x}
              onEdit={() => {
                setOpenModalSection(true);
                refSelectedSection.current = {
                  data: x,
                  scheduleUniqueId: x.scheduleUniqueId,
                };
              }}
              course={course}
              onAddOrUpdate={(id: any, title: any) => onAddOrUpdateItemSection(id, title, x)}
              onRemove={() => onRemoveItem(x?.id)}
              defaultOpen={x.id == activeSectionId ?? false}
              editable={editable}
              onMove={(direction: boolean) => onMove(x?.id, direction)}
            />
          ))}
        <Button preset="secondary" onClick={() => onClickAddNewSection(scheduleUniqueId)} hidden={!editable}>
          {t(LocaleKeys["Add section"])}
        </Button>
      </div>
    );
  };

  const renderBanks = () => {
    return (
      <div>
        <Visible visible={true}>
          <QuestionBank
            courseId={course.id}
            isCourseBank={true}
            sessionData={{
              course: course,
              courseSections: course?.sections,
            }}
          />
        </Visible>
      </div>
    );
  };

  return (
    <div className="pb-10 border-b">
      <Container size="xl">
        {isEdit && (
          <CourseForm
            data={isCreate ? initData : course}
            onDiscard={onDiscard}
            onSave={onSave}
            onDelete={onDelete}
            isCreate={isCreate}
            type={course.type}
          />
        )}
      </Container>

      {!isEdit && (
        <div className="relative">
          <BlurBackground url={getThumbnail()}>
            <Container size="xl">
              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-3 md:col-span-3">
                  <CourseInfo {...course} onEdit={() => setIsEdit(true)} imgSrc={getThumbnail()} />
                </div>
              </div>
            </Container>
          </BlurBackground>
        </div>
      )}

      <Container size="xl">
        {!isCreate && (
          <>
            <div className="grid lg:grid-cols-[1fr_334px] gap-6 py-5">
              {!isEdit && (
                <>
                  <div className="">
                    <Tabs value={activeTab + ""} onTabChange={onTabChange}>
                      <Tabs.List>
                        <Tabs.Tab value="0">{t("About")}</Tabs.Tab>
                        <Tabs.Tab value="1">{t("Syllabus")}</Tabs.Tab>
                      </Tabs.List>
                      <Tabs.Panel value="0">
                        <br />
                        {!currentLangData?.about && (
                          <>
                            <div className="flex justify-center mt-24 w-full">
                              <NotFound>
                                <span className="font-bold">{t("No data")}</span>
                              </NotFound>
                            </div>
                          </>
                        )}

                        {!!currentLangData?.summary && <div className="mb-4">{currentLangData?.summary}</div>}

                        <article>
                          <RawText content={currentLangData?.about || ""} />
                        </article>

                        {currentLangData?.objectives && currentLangData?.objectives?.length > 0 && (
                          <>
                            <br />
                            <br />
                            <div className="border p-4 rounded-md">
                              <div className="font-bold uppercase text-gray-500">{t("What you will learn")}</div>
                              <br />
                              {
                                <Grid columns={12}>
                                  {currentLangData.objectives?.map((item: any, index: number) => (
                                    <Grid.Col key={index} span={12} lg={6}>
                                      <div className="flex gap-4 items-start">
                                        <span className="text-green">
                                          <AppIcon size="md" className="text-green-500" name="checkmark" />
                                        </span>
                                        <span
                                          style={{
                                            maxWidth: "calc(100% - 40px)",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          {item}
                                        </span>
                                      </div>
                                    </Grid.Col>
                                  ))}
                                </Grid>
                              }
                            </div>
                            <br />
                          </>
                        )}

                        {currentLangData?.skills && currentLangData?.skills?.length > 0 && (
                          <div className="border rounded-md p-4 mb-14">
                            <div className="font-bold uppercase text-gray-500">{t("Skills you will gain")}</div>
                            <br />
                            <div className="flex flex-wrap gap-2">
                              {currentLangData.skills.map((item: any, index: number) => (
                                <div key={index} className="px-4 py-1 text-sm bg-gray-lighter color-text rounded-large">
                                  <span
                                    style={{
                                      maxWidth: "calc(100% - 40px)",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {course.isCombo && (
                          <div>
                            <Text size="xl" className="font-bold">
                              {t("List course in combo")}
                            </Text>
                            <div className="mt-4 grid gap-5 lg:grid-cols-5">
                              {course?.subCourses?.map((data: any) => (
                                <Link key={data.id} href={`/cms/course/${data.id}`}>
                                  <Card withBorder className={styles.item}>
                                    <Card.Section className={styles.wrapThumb}>
                                      <div className={styles.thumbnail}>
                                        <Image
                                          src={data.thumbnail}
                                          height={180}
                                          alt="Dekiru"
                                          fit="cover"
                                          withPlaceholder
                                        />
                                      </div>
                                    </Card.Section>
                                    <TextLineCamp className="font-semibold mb-1 h-6">
                                      {resolveLanguage(data, locale)?.title}
                                    </TextLineCamp>
                                    <TextLineCamp
                                      title={resolveLanguage(data.category, locale)?.title}
                                      className="font-semibold text-sm text-blue-500"
                                    >
                                      {resolveLanguage(data.category, locale)?.title}
                                    </TextLineCamp>
                                    <Text className="text-sm mt-2">
                                      {getCoursePrice(data?.price ?? 0, data?.moneyType ?? MoneyEnum.VND, t)}
                                    </Text>
                                  </Card>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </Tabs.Panel>
                      {!course.isCombo && (
                        <Tabs.Panel value="1">
                          {renderTaps()}
                          <div className="flex gap-5">
                            <div className="w-full">
                              {course && course.type == GroupCourseTypeEnum.Personal && (
                                <>
                                  {schedules.map((schedule: any, idx: number) => {
                                    return (
                                      <CourseScheduleContainer
                                        key={idx}
                                        currentSchedule={schedule}
                                        scheduleIndex={idx + 1}
                                        editable={editable}
                                        course={course}
                                        fetchData={fetchData}
                                        onEdit={() => {
                                          setScheduleSelected(schedule);
                                          setOpenModalSchedule(true);
                                        }}
                                      >
                                        {renderSyllabus(schedule.uniqueId)}
                                      </CourseScheduleContainer>
                                    );
                                  })}
                                  {openModalSchedule && (
                                    <ModalSchedule
                                      course={course}
                                      data={scheduleSelected}
                                      onSuccess={fetchData}
                                      onClose={() => setOpenModalSchedule(false)}
                                    />
                                  )}
                                  {course.type === 1 && editable && (
                                    <>
                                      <Button
                                        preset="primary"
                                        onClick={() => {
                                          setScheduleSelected(null);
                                          setOpenModalSchedule(true);
                                        }}
                                      >
                                        {t("Add Schedule")}
                                      </Button>
                                    </>
                                  )}
                                </>
                              )}

                              {course && (!course.type || course.type == GroupCourseTypeEnum.Organization) && (
                                <>
                                  {tab === tabs[0] && renderSyllabus()}
                                  {tab === tabs[2] && renderBanks()}
                                </>
                              )}
                            </div>
                          </div>
                        </Tabs.Panel>
                      )}
                    </Tabs>
                  </div>
                  <div className="relative">
                    <CourseSidebarView
                      data={course}
                      src={getThumbnail()}
                      onPublish={onPublish}
                      releaseCourse={releaseCourse}
                      canPublish={canPublish}
                      canCreateClass={tab === tabs[1]}
                      canRelease={tab === tabs[0]}
                      released={released}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export const getCoursePrice = (price: number, moneyType: number, t: any) => {
  if (moneyType === 1) {
    return price
      ? FunctionBase.formatNumber(price, {
          style: "currency",
          currency: "VND",
        })
      : t(LocaleKeys["FREE"]);
  } else {
    return price
      ? FunctionBase.formatNumber(price * 25000, {
          style: "currency",
          currency: "VND",
        })
      : t(LocaleKeys["FREE"]);
  }
};
