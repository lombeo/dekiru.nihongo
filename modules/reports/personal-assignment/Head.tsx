import { Button, NumberInput } from "@mantine/core";
import React, { useCallback, useContext, useState } from "react";
import { PersonalAssignmentReportContext } from "./Context";
import { useTranslation } from "next-i18next";
import Icon from "@edn/font-icons/icon";
import SearchUsers from "@chatbox/components/SearchUsers/SearchUsers";
import { ReportService } from "../service/report.services";
import SelectInfinite from "@src/components/SelectInfinite/SelectInfinite";
import { DataSource } from "@src/components/TagField/TagField";
import { X } from "tabler-icons-react";

const Head = () => {
  const { t } = useTranslation();
  const [loadingExport, setLoadingExport] = useState(false);
  const { search, reset, changeModel, model, isLoading } = useContext(PersonalAssignmentReportContext);

  //Pick user
  const onPickUser = (users) => {
    changeModel("user", users[0]);
    changeModel("userId", users[0]?.id);
  };

  const handleExport = () => {};

  const handleFetchCourses = useCallback(async (query: string, page: number) => {
    try {
      let data: any[];
      let total: number;
      let limit = 10;
      const response = await ReportService.getPersonalCourseReport({
        pageIndex: page,
        pageSize: 20,
        courseName: query,
      });
      data = response.data.data?.results;
      total = response.data.data.rowCount;
      if (!data) return;
      return Promise.resolve({
        data,
        total,
        limit,
      } as DataSource);
    } catch (e) {}
  }, []);

  return (
    <div className="p-5 border w-full rounded-md mb-8 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <SelectInfinite
          fetchOptions={handleFetchCourses}
          uniqueKey="coursePermalink"
          value={model["course"]}
          required
          label={t("Course name")}
          getOptionLabel={(item) => item.title}
          onChange={(value) => {
            changeModel("course", value);
            changeModel("coursePermalink", value?.permalink);
            changeModel("courseId", value?.courseId);
          }}
        />
        <div>
          <label style={{ color: "#212529" }} className="text-base font-medium">
            {t("User")}
          </label>
          <SearchUsers
            minHeight={"42px"}
            multiple={false}
            placeholder={t("Please enter 3 or more characters")}
            disabled={!model.classId}
            onChange={onPickUser}
            value={model.user ? [model.user] : null}
          />
        </div>
        <NumberInput
          size="md"
          value={model.assignmentScore}
          onChange={(val) => changeModel("assignmentScore", val)}
          label={t("Score (>=)")}
          hideControls
          min={0}
          max={10000}
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />
        <div className="flex gap-5 items-end flex-wrap md:col-span-2">
          <Button loading={isLoading} size="md" onClick={() => search()} leftIcon={<Icon size={20} name="search" />}>
            {t("Filter")}
          </Button>
          <Button variant="light" leftIcon={<X size={20} />} size="md" onClick={reset}>
            {t("Reset")}
          </Button>
          <Button
            variant="light"
            loading={loadingExport}
            onClick={handleExport}
            // disabled={assignmentTitles.length <= 0}
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
