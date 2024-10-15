import { useProfileContext } from "@src/context/Can";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useActionPage } from "@src/hooks/useActionPage";
import CmsService from "@src/services/CmsService/CmsService";
import { confirmAction, LoadingOverlay, Notify } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { useRouter } from "hooks/useRouter";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import PubSub from "pubsub-js";
import { useCallback, useEffect, useState } from "react";
import { QuestionBankService } from "services/question-bank/question-bank.services";
import { ActivityFilterModel, FilterBar } from "./FilterBar";
import { QuestionBankList } from "./QuestionBankList";

let filter: any = new ActivityFilterModel();
export const QuestionBank = (props: any) => {
  const {
    selectable,
    isSelected,
    onSelectChange,
    excludedUniqueIds = [],
    excludeNoQuestions = false,
    isCourseBank = false,
    courseId,
    sessionData,
    sectionId,
    isQuizForm,
  } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const { authorized } = useProfileContext();
  const { currentUrl, pushResetUrl } = useActionPage();

  const parts = router.asPath.split("?");
  const leftPart = parts ? parts[0] : router.asPath;
  const params = parts ? new URLSearchParams(parts[1]) : new URLSearchParams();
  const pageIndexParam = params.get("pageIndex");
  let courseType = params.get("courseType") ? params.get("courseType") : "";

  useEffect(() => {
    filter = Object.fromEntries(params);
    fetchData();
    const token = PubSub.subscribe("QUESTIONBANK_CHANGED", () => fetchData());
    return () => {
      PubSub.unsubscribe(token);
      filter = new ActivityFilterModel();
    };
  }, []);

  useEffect(() => {
    if (data?.paging?.pageIndex && data.paging.pageIndex == 1 && data.paging.totalPages > 1 && !pageIndexParam) {
      filter = {
        ...filter,
        pageIndex: 1,
      };
      params.set("pageIndex", "1");
      router.push({ pathname: leftPart, search: params.toString() });
    }
  }, [data?.paging?.pageIndex]);

  useEffect(() => {
    if (pageIndexParam && pageIndexParam != data?.paging?.pageIndex) {
      handleChangePage(Number(pageIndexParam));
    }
  }, [pageIndexParam]);

  const fetchData = useCallback(() => {
    if (!authorized) return;
    setLoading(true);

    if (isCourseBank) {
      if (sectionId) {
        filter = {
          ...filter,
          sectionId: sectionId,
        };
      }

      if (courseId) {
        filter = {
          ...filter,
          courseId: courseId,
        };
      }

      filter = {
        ...filter,
        includeBankUsages: true,
      };
    }
    CmsService.getAllQuestionBank(
      {
        ...filter,
        pageSize: isCourseBank ? 10 : 12,
        visibility: filter?.visibility || "publish",
      },
      excludedUniqueIds,
      excludeNoQuestions
    )
      .then((res: any) => {
        if (res && res.data) {
          setData(res.data);
          if (res?.data?.items?.length == 0 && res?.data?.paging?.pageIndex > 1) {
            refeshPage(res?.data?.paging?.pageIndex);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [authorized]);

  const onFilter = (args: any) => {
    filter = {
      ...filter,
      ...args,
      pageIndex: 1,
    };

    // router.push({ pathname: leftPart, query: args });

    // if (courseType)
    //   pushResetUrl(["text", "sectionId", "courseId", "visibility", "courseType"]);
    // else {
    //   pushResetUrl(["text", "sectionId", "courseId", "visibility", "courseType"]);
    // }
    fetchData();
  };

  const onReset = () => {
    filter = {};
    if (sectionId) {
      filter = {
        ...filter,
        sectionId: sectionId,
      };
    }

    if (courseId) {
      filter = {
        ...filter,
        courseId: courseId,
      };
    }

    filter = {
      ...filter,
      includeBankUsages: true,
    };
    // pushResetUrl(["sectionId", "courseId", "courseType"]);
    fetchData();
  };

  const onClickDeleteQuestionBank = (questionBankId: any) => {
    const onConfirm = () => {
      QuestionBankService.deleteQuestionBank(questionBankId).then((x: any) => {
        if (x?.data) {
          Notify.success(
            t(LocaleKeys.D_MESSAGE_DELETE_SPECIFIC_ITEM_SUCCESSFUL, {
              name: t(LocaleKeys.Bank).toLocaleLowerCase(),
            })
          );
        }
        fetchData();
      });
    };
    confirmAction({
      message: t(LocaleKeys["Are you sure to delete this item?"]),
      onConfirm,
    });
  };

  const refeshPage = (items: number) => {
    params.set("pageIndex", (items - 1).toString());
    filter = Object.fromEntries(params);
    router.push({ pathname: leftPart, search: params.toString() });
    fetchData();
  };

  const handleChangePage = (pageIndex: number) => {
    filter = {
      ...filter,
      pageIndex: pageIndex,
    };
    params.set("pageIndex", pageIndex.toString());
    // router.push({ pathname: leftPart, search: params.toString() });
    fetchData();
  };

  const onClickEditQuestionBank = (id: any) => {
    if (isCourseBank) {
      router.push(`${currentUrl}?questionBankId=${id}`);
    } else {
      router.push(`/cms/question-bank?questionBankId=${id}`);
    }
  };

  const getGroupData = (groups: any, id: any) => {
    if (!groups) {
      return null;
    }

    const entityData = groups.find((x: any) => parseInt(x.bankId) == id)?.data ?? [];
    let courseId;
    let sectionIds: any[] = [];

    entityData.forEach((x: any) => {
      if (x.entityType == 1) {
        courseId = x.entityId;
      }
      if (x.entityType == 2) {
        sectionIds.push(x.entityId);
      }
    });

    return {
      courseId: courseId,
      sectionIds: sectionIds,
    };
  };

  const getSingleSection = (sectionId: any) => {
    return sessionData.courseSections.find((x: any) => x.id == sectionId);
  };

  const getSectionsFromIds = (ids: any) => {
    return ids.map((x: any) => getSingleSection(x));
  };

  const getMergedData = () => {
    if (data && data?.items) {
      let groups: any[] = [];
      if (data?.bankUsages) {
        groups = FunctionBase.groupByField(data?.bankUsages, "bankId");
      }

      let originData = [...data?.items];

      const response = originData.map((x: any) => {
        const groupData = getGroupData(groups, x.id);
        const resCourseId = groupData?.courseId;
        const resSectionIds = groupData?.sectionIds;
        return {
          ...x,
          courseId: resCourseId,
          sections: isCourseBank ? getSectionsFromIds(resSectionIds) : [],
        };
      });

      return response;
    }
  };

  return (
    <>
      <LoadingOverlay visible={loading} />
      <FilterBar
        data={filter}
        onFilter={onFilter}
        onReset={onReset}
        selectable={selectable}
        courseId={courseId}
        sectionId={sectionId}
        isCourseBank={isCourseBank}
        courseType={courseType}
      />
      {/* <FilterBarCourseBank
        data={filter}
        onFilter={onFilter}
        onReset={onReset}
      /> */}
      <Visible visible={data}>
        <QuestionBankList
          onReset={onReset}
          isQuizForm={isQuizForm}
          courseId={courseId}
          sessionData={sessionData}
          isSelected={isSelected}
          onSelectChange={onSelectChange}
          selectable={selectable}
          data={getMergedData()}
          isCourseBank={isCourseBank}
          pagination={data?.paging}
          onChangePage={handleChangePage}
          onClickEdit={onClickEditQuestionBank}
          onClickDelete={onClickDeleteQuestionBank}
        />
      </Visible>
    </>
  );
};
