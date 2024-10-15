import { Button, Select, TextInput } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { PersonalCourseReportContext } from "./Context";
import { useTranslation } from "next-i18next";
import { isNil } from "lodash";
import Icon from "@edn/font-icons/icon";
import { getCookie } from "@src/helpers/cookies.helper";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ReportService } from "../service/report.services";
import { useProfileContext } from "@src/context/Can";
import { X } from "tabler-icons-react";

const Head = () => {
  const { t } = useTranslation();
  const { search, reset, changeModel, model, data, isLoading } = useContext(PersonalCourseReportContext);
  const [loadingExport, setLoadingExport] = useState(false);
  const { profile } = useProfileContext();
  const [disable, setDisable] = useState(data?.results.length <= 0);

  useEffect(() => {
    if (data?.results.length <= 0) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [data]);

  const handleExport = () => {
    if (data?.results.length > 0) {
      const ACCESS_TOKEN = getCookie("ACCESS_TOKEN");
      let paid;
      if (model.paid == "Paid") {
        paid = true;
      } else if (model.paid == "Free") {
        paid = false;
      }
      let filter: any = {
        courseName: model?.courseName?.trim(),
        courseStatus: model.courseStatus,
        accessToken: ACCESS_TOKEN,
        email: profile.email,
      };
      if (model.paid == "Paid" || model.paid == "Free") {
        filter = { ...filter, paid };
      }
      if (model.courseStatus == "All") {
        filter = { ...filter, courseStatus: "" };
      }
      setLoadingExport(true);
      ReportService.postPersonalCourseExport(filter)
        .then((data: any) => {
          let response = data.data;
          if (response?.data?.success && response.data?.url) {
            const a = document.createElement("a");
            a.href = response.data.url;
            a.click();
          } else {
            Notify.error(t("Export data failed"));
          }
        })
        .finally(() => {
          setLoadingExport(false);
        });
    }
  };

  return (
    <div className="p-5 border w-full rounded-md mb-8 bg-white">
      <div className="md:grid flex flex-col lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <TextInput
          size="md"
          label={t("Course name")}
          value={isNil(model.courseName) ? "" : model.courseName}
          onChange={(e) => {
            changeModel("courseName", e.target.value);
            setDisable(true);
          }}
          placeholder={t("")}
        />
        <Select
          size="md"
          data={[
            {
              label: t("All"),
              value: "All",
            },
            {
              label: t("Published"),
              value: "Published",
            },
            {
              label: t("Archived"),
              value: "Archived",
            },
          ]}
          label={t("Status")}
          value={model.courseStatus}
          onChange={(val) => {
            changeModel("courseStatus", val);
            setDisable(true);
          }}
        />
        <Select
          label={t("Price")}
          placeholder={t("Select")}
          data={[
            { value: "All", label: t("All") },
            { value: "Paid", label: t("Paid") },
            { value: "Free", label: t("Free") },
          ]}
          value={model?.paid}
          size="md"
          onChange={(val) => {
            changeModel("paid", val);
            setDisable(true);
          }}
        />
        <div className="flex gap-5 items-end flex-wrap col-span-2 xl:col-span-1">
          <Button
            loading={isLoading}
            onClick={() => {
              search();
            }}
            size="md"
            leftIcon={<Icon size={20} name="search" />}
          >
            {t("Filter")}
          </Button>
          <Button variant="light" size="md" onClick={reset} leftIcon={<X size={20} />}>
            {t("Reset")}
          </Button>
          <Button
            variant="light"
            loading={loadingExport}
            onClick={handleExport}
            disabled={disable}
            size="md"
            leftIcon={<Icon size={20} name="download" />}
          >
            {t("Export")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Head;
