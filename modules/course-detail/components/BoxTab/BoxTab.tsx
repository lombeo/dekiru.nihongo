import { Modal } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { ActionIcon, Menu, clsx } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Container } from "@src/components";
import { useShareContext } from "@src/components/Share/ShareContext";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import { useNextQueryParam } from "@src/helpers/query-utils";
import Export from "@src/modules/course-detail/components/Export";
import ModalCourseLimit from "@src/modules/course-detail/components/ModalCourseLimit";
import ModalUpdateLabelCourse from "@src/modules/course-detail/components/ModalUpdateLabelCourse";
import ModalUpdateProvider from "@src/modules/course-detail/components/ModalUpdateProvider";
import { LearnCourseService } from "@src/services";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Bookmark, Dots, Download, Pencil, Settings, Trash } from "tabler-icons-react";
import useCourseRole from "../../hooks/useCourseRole";
import styles from "./BoxTab.module.scss";

interface BoxTabProps {
  data: any;
  refreshData: () => void;
  handleChangeTab: (tab: string) => void;
  currentTab: string;
}

const BoxTab = (props: BoxTabProps) => {
  const { data, refreshData, handleChangeTab, currentTab } = props;

  const { t } = useTranslation();

  const activeTab = useNextQueryParam("tab");

  const isMobile = useMediaQuery("(max-width: 992px)");

  const profile = useSelector(selectProfile);

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const { isOwner, isCourseManager, isStudentManager, isCanViewReport, isCanCreateVoucher, isViewCourse } =
    useCourseRole(data);

  const handleScrollTo = (id: string) => {
    let element = document.getElementById(id);
    let elementPosition = 0;

    if (["introduce", "syllabus", "reviews", "certificate"].includes(id) && element) {
      if (element) {
        elementPosition = element.getBoundingClientRect().top + window.scrollY;
        if (["syllabus", "reviews", "certificate"].includes(id)) {
          elementPosition -= 24;
        }
      }
    } else {
      element = document.getElementById("tab-course-placeholder");
      if (element) {
        elementPosition = element.getBoundingClientRect().top + window.scrollY;
      }
    }

    if (element) {
      const offsetPosition = elementPosition;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  let tabs = [
    {
      key: "introduce",
      label: t("Introduce"),
    },
    {
      key: "syllabus",
      label: t("Syllabus"),
      disabled: data?.isCombo,
    },
    {
      key: "reviews",
      label: t("Reviews"),
    },
    {
      key: "certificate",
      label: t("Certificate"),
    },
    {
      key: "comment",
      label: `${t("Comments")} ${data?.totalComment > 0 ? `(${data?.totalComment})` : ""}`,
      disabled: !profile,
    },
    {
      key: "learners",
      label: t("Learners"),
      disabled: !(isStudentManager || isCanViewReport),
    },
    {
      key: "permission",
      label: t("Permission"),
      disabled: !(isCourseManager || data?.isOrgManager),
    },
    {
      key: "my-vouchers",
      label: t("My vouchers"),
      disabled: !(!isCanCreateVoucher && (data?.isPayment || data?.price > 0)),
    },
    {
      key: "voucher-management",
      label: t("Voucher management"),
      disabled: !(isCanCreateVoucher && (data?.isPayment || data?.price > 0)),
    },
  ];

  tabs = tabs.filter((x) => !x.disabled);

  useEffect(() => {
    if (!data?.courseId) return;

    if (!activeTab || activeTab === "introduce") return;

    const timeOut = setTimeout(() => {
      handleScrollTo(activeTab);
    }, 1000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [data?.courseId]);

  useEffect(() => {
    const listener = () => {
      const headerElement = document.getElementById("app-header");
      const element = document.getElementById("tab-course");
      const placeholder = document.getElementById("tab-course-placeholder");

      const stickyDivOffsetTop = placeholder.offsetTop;

      if (window.scrollY >= stickyDivOffsetTop) {
        if (element) {
          element.classList.add("stick");
        }
        if (headerElement) {
          headerElement.style.display = "none";
        }
      } else {
        if (element) {
          element.classList.remove("stick");
        }
        if (headerElement) {
          headerElement.style.display = "block";
        }
      }
    };

    if (!isMobile) {
      window.addEventListener("scroll", listener);
    }
    return () => {
      const headerElement = document.getElementById("app-header");
      const element = document.getElementById("tab-course");
      if (headerElement) {
        headerElement.style.display = "block";
      }
      if (element) {
        element.classList.remove("stick");
      }
      window.removeEventListener("scroll", listener);
    };
  }, [isMobile]);

  useEffect(() => {
    if (activeTab && profile) {
      const index: number = tabs.findIndex((item) => item.key === activeTab);

      if (index > 3) {
        handleChangeTab(tabs[index].key);
      }
    }
  }, [profile]);

  return (
    <div className="min-h-[68px]">
      <div id="tab-course-placeholder" />
      <div id="tab-course" className={clsx(styles.root, "bg-navy-light5 z-200")}>
        <Container size="xl">
          <div className="lg:px-32">
            <div className="flex flex-wrap md:flex-row md:pr-24 flex-col gap-x-10 xl:gap-x-[56px] relative">
              {tabs?.map((tab) => (
                <div
                  key={tab.key}
                  className={clsx(
                    "md:min-h-[68px] min-h-[60px] justify-center flex items-center cursor-pointer border-b-2 border-t-2 border-transparent",
                    {
                      "text-navy-primary font-semibold border-b-[#506CF0]": tab.key === (currentTab || "introduce"),
                    }
                  )}
                  onClick={() => handleChangeTab(tab.key)}
                >
                  {tab.label}
                </div>
              ))}
              <Actions
                data={data}
                refreshData={refreshData}
                isViewCourse={isViewCourse}
                isCourseManager={isCourseManager}
                isCanViewReport={isCanViewReport}
                isManagerContent={isManagerContent}
                isOwner={isOwner}
              />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default BoxTab;

interface ActionsProps {
  data: any;
  refreshData: () => void;
  isViewCourse: boolean;
  isOwner: boolean;
  isCourseManager: boolean;
  isCanViewReport: boolean;
  isManagerContent: boolean;
}

const Actions = (props: ActionsProps) => {
  const { data, refreshData, isViewCourse, isOwner, isCourseManager, isCanViewReport, isManagerContent } = props;

  const { t } = useTranslation();

  const router = useRouter();

  const { share } = useShareContext();

  const [openModalReportData, setOpenModalReportData] = useState(false);
  const [openModalUpdateProvider, setOpenModalUpdateProvider] = useState(false);
  const [openModalCourseLimit, setOpenModalCourseLimit] = useState(false);
  const [openModalUpdateLabel, setOpenModalUpdateLabel] = useState(false);

  const [isLoadingBtnUnEnroll, setIsLoadingBtnUnEnroll] = useState(false);

  const handleUnEnroll = () => {
    confirmAction({
      message: t("Are you sure to unenroll this course?"),
      onConfirm: () => {
        setIsLoadingBtnUnEnroll(true);
        LearnCourseService.unenrollCourse({ courseId: data?.id })
          .then((res) => {
            if (!res) return;
            if (res.data?.message) {
              Notify.error(t(res.data?.message));
            } else {
              Notify.success(t("Unenroll this course successfully."));
              refreshData();
            }
          })
          .finally(() => {
            setIsLoadingBtnUnEnroll(false);
          });
      },
    });
  };

  const handleDelete = () => {
    confirmAction({
      message: t("Are you sure you want delete this course?"),
      onConfirm: async () => {
        const res = await LearnCourseService.delete(data?.id);
        if (res?.data?.success) {
          router.push("/learning");
          Notify.success(t("Delete successfully!"));
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  return (
    <div className="flex items-center absolute gap-4 right-2 md:top-1/2 md:-translate-y-1/2 top-3.5">
      {data?.isEnroll && data?.allowUnenroll && (
        <ActionIcon
          variant="default"
          radius="xl"
          color="red"
          className="flex items-center"
          onClick={handleUnEnroll}
          data-tooltip-id={"global-tooltip"}
          data-tooltip-place="top"
          data-tooltip-content={t("Unenroll")}
          loading={isLoadingBtnUnEnroll}
        >
          <Icon name="close" className="text-gray-600" />
        </ActionIcon>
      )}
      {!isViewCourse && (
        <ActionIcon
          variant="default"
          radius="xl"
          data-tooltip-id={"global-tooltip"}
          data-tooltip-place="top"
          data-tooltip-content={t("Share")}
          onClick={() =>
            share({
              title: t("Share this learn to friends"),
              url: `${window.location.origin}/learning/${data?.permalink}`,
            })
          }
        >
          <Icon name="share" className="text-gray-600" />
        </ActionIcon>
      )}
      {isCanViewReport && (
        <Menu arrowSize={12} withArrow withinPortal classNames={{ arrow: "-z-10" }} shadow="md">
          <Menu.Target>
            <ActionIcon radius="lg" size="md" variant="default">
              <Dots width={20} className="text-gray-600" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {isCanViewReport && (
              <Menu.Item
                onClick={() => setOpenModalReportData(true)}
                icon={<Download width={16} height={16} className="text-gray-600" />}
              >
                {t("Export data")}
              </Menu.Item>
            )}
            {isCourseManager && (
              <Menu.Item
                onClick={() => setOpenModalUpdateProvider(true)}
                icon={<Icon name="computer-study" className="text-gray-600" />}
              >
                {t("Update provider")}
              </Menu.Item>
            )}
            {isCourseManager && (
              <Menu.Item
                onClick={() => setOpenModalUpdateLabel(true)}
                icon={<Bookmark size="16px" className="text-gray-600" />}
              >
                {t("Update label course")}
              </Menu.Item>
            )}
            {isCourseManager ? (
              <Menu.Item
                onClick={() => setOpenModalCourseLimit(true)}
                icon={<Settings size="16px" className="text-gray-600" />}
              >
                {t("Setting")}
              </Menu.Item>
            ) : null}
            {isCourseManager ? (
              <Menu.Item
                onClick={() => {
                  window.location.href = `/cms/course/${data?.externalcode}`;
                }}
                icon={<Pencil size="16px" className="text-gray-600" />}
              >
                {t("Edit course")}
              </Menu.Item>
            ) : null}
            {isManagerContent && (
              <Menu.Item className="text-red-500" onClick={handleDelete} icon={<Trash size="16px" />}>
                {t("Delete course")}
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      )}

      {openModalReportData && (
        <Modal
          opened
          onClose={() => setOpenModalReportData(false)}
          title={<span className="font-semibold">{t("Export data")}</span>}
        >
          <Export courseId={data?.id} onCloseModal={setOpenModalReportData} />
        </Modal>
      )}

      {openModalUpdateProvider && (
        <ModalUpdateProvider
          courseId={data?.id}
          providerId={data?.providerId}
          onSuccess={refreshData}
          onClose={() => setOpenModalUpdateProvider(false)}
        />
      )}

      {openModalCourseLimit && (
        <ModalCourseLimit
          startTime={data?.startTime}
          endTime={data?.endTime}
          onSuccess={refreshData}
          courseId={data?.id}
          courseViewLimit={data?.courseViewLimit}
          courseEnrollLimit={data?.courseEnrollLimit}
          hasPrice={data?.price > 0}
          discount={data?.discount ?? 0}
          priceAfterDiscount={data?.priceAfterDiscount ?? 0}
          onClose={() => setOpenModalCourseLimit(false)}
          isOwner={isOwner}
          price={data?.price}
        />
      )}

      {openModalUpdateLabel && (
        <ModalUpdateLabelCourse
          label={data?.label}
          courseId={data?.id}
          onClose={() => setOpenModalUpdateLabel(false)}
        />
      )}
    </div>
  );
};
