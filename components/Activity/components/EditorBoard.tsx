import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { LoadingOverlay } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useActivityContext } from "@src/components/Activity/context";
import { PubsubTopic } from "@src/constants/common.constant";
import { cookieEvaluate } from "@src/constants/evaluate/evaluate.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { ActivityCodeChanelEnum, ActivityCodeSubTypeEnum, allowedLanguages } from "@src/packages/codelearn/src/configs";
import CodingService from "@src/services/Coding/CodingService";
import { ActivityContextType } from "@src/services/Coding/types";
import { selectProfile } from "@src/store/slices/authSlice";
import { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Split from "react-split";
import { ConsolePanel } from "./ConsolePanel";
import { Editor } from "./Editor";
import ModalFinishSubmit from "./ModalFinishSubmit";
import { Toolbar } from "./Toolbar";

interface EditorBoardProps {
  notShowEdit: boolean;
}

interface TabCodeDataProps {
  title: string;
  id: string;
  userCode: string;
  isActive: boolean;
}

interface RunCodeResultRealtimeProp {
  codeCompile: any;
  runCodeRequest: any;
  runTestId: any;
}

export const getLanguageSelection = (lang: string) => {
  return allowedLanguages.find((item: any) => {
    return item.value === lang;
  });
};

const EditorBoard = (props: EditorBoardProps) => {
  const { notShowEdit } = props;

  const { t } = useTranslation();

  const isMobile = useMediaQuery("(max-width: 756px)");

  const profile = useSelector(selectProfile);

  const {
    activityId,
    contextId,
    onToggleFullSize,
    fullSize,
    contextDetail = {},
    remainRetry,
    codeActivity = {},
    setIsRunCodeSuccess,
    languagesCodeSubmitted,
    isAdminContext,
    data,
    token,
    contextType,
    totalSubmitted,
    reFetchContextData,
    activities,
    chapters,
  } = useActivityContext();

  const limitNumberSubmission = codeActivity?.limitNumberSubmission;

  const { programingLanguages = [], listCodeTemplates = [] } = codeActivity;
  const { submittedSolutions } = contextDetail ?? {};

  const [activeTabId, setActiveTabId] = useState(0);

  const editorRef = useRef(null);
  const ref = useRef<any>(null);
  const initialCode = useRef("");

  const getAllowedLanguages = () => {
    if (!programingLanguages) return [];
    return allowedLanguages.filter((item: any) => {
      return !!programingLanguages.find((lang: any) => {
        return lang?.toLowerCase() === item.value.toLowerCase();
      });
    });
  };

  const supportedLanguages = getAllowedLanguages();

  const [currentLanguage, setCurrentLanguage] = useState(supportedLanguages?.[0]?.value);
  const [userCode, setUserCode] = useState("");
  const [dataTestResult, setDataTestResult] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [openFinishLesson, setOpenFinishLesson] = useState(false);
  const [isSubmitResult, setIsSubmitResult] = useState(false);
  const [listCodes, setListCodes] = useState({});

  //Using for assign value to editor
  const updateEditorValue = (value: any) => {
    let count = 0;
    let interval = setInterval(() => {
      count++;
      if (editorRef.current && ref.current) {
        editorRef.current?.updateOptions({ readOnly: false });
        editorRef.current?.setValue(isNil(value) ? "" : value);
        ref.current?.selectDots();
        clearInterval(interval);
        return;
      }
      if (count > 20) {
        clearInterval(interval);
      }
    }, 200);
  };

  const idTabPrefix = "new-file-";
  const defaultTabCodeData: TabCodeDataProps = {
    title: "New-file",
    id: idTabPrefix + "0",
    userCode: "",
    isActive: true,
  };
  const [tabCodes, setTabCodes] = useState(undefined);

  const getTitle = (title = "New-file", listTabs) => {
    title = title.replace(/[^0-9a-zA-Z.]/g, "-");
    if (title.length > 64) {
      title = title.substring(0, 64);
    }

    const data = [];
    listTabs.reduce((arr, item) => {
      arr.push(item.title.toLowerCase());
      return arr;
    }, data);
    if (data.indexOf(title.toLowerCase().replace(/\s+/g, "-")) > -1) {
      return getTitle(title + "-1", listTabs);
    } else {
      return title;
    }
  };

  useEffect(() => {
    let token = PubSub.subscribe(ActivityCodeChanelEnum.LOADUSERCODE, (mess, data: any) => {
      debugger;
      setUserCode(data);
      setCurrentLanguage(data?.languageKey);
    });
    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  useEffect(() => {
    let editorVal = "";
    //For have code sample: (activityDetails?.generationCodeType === "NO_MAIN" &&) Old condition
    if (!!codeActivity?.codeSample) {
      editorVal = codeActivity?.codeSample;
    } else {
      if (listCodeTemplates.length > 0) {
        editorVal = listCodeTemplates[0]?.codeContent;
      }
    }
    if ((languagesCodeSubmitted && languagesCodeSubmitted.length) || userCode) {
      const firstSubmittedSolution = userCode || languagesCodeSubmitted[0];
      if (firstSubmittedSolution) {
        setCurrentLanguage(firstSubmittedSolution?.languageKey);

        editorVal = firstSubmittedSolution.userCode;
        //Restructure OOP Data
        if (codeActivity?.activityCodeSubType === ActivityCodeSubTypeEnum.OOP) {
          const codes = JSON.parse(firstSubmittedSolution.userCode).map((item: any, index: number) => {
            //Set code for first activity tab code
            if (index === 0) {
              editorVal = item.source;
            }
            return {
              title: item.fileName,
              id: idTabPrefix + index,
              userCode: item.source,
              isActive: index == 0,
            };
          });

          setTabCodes(codes);
        }
      }
    } else {
      const lang = programingLanguages[0];
      if (programingLanguages.length === 1) {
        editorVal = codeActivity?.codeSample || listCodeTemplates?.[0]?.codeContent;
      } else {
        editorVal = listCodeTemplates?.find((e) => e.languageKey === lang)?.codeContent || "";
      }
      setCurrentLanguage(lang);
      if (codeActivity?.activityCodeSubType === ActivityCodeSubTypeEnum.OOP) {
        defaultTabCodeData.userCode = editorVal;
        setTabCodes([defaultTabCodeData]);
      }
    }
    //Update value case data change.
    initialCode.current = editorVal;
    updateEditorValue(editorVal);
    setActiveTabId(0);
    setDataTestResult(undefined);
    setIsLoading(false);
  }, [activityId, listCodeTemplates, userCode]);

  useEffect(() => {
    if (!!data?.codeActivity?.activity) {
      let runtestid = FunctionBase.getParameterByName("runtestid", location.href);
      if (!!runtestid) {
        //Set isload for code editor
        setIsLoading(true);
        //Call api load run test data

        CodingService.contestSubmitRuntest({ runtestid: runtestid }).then((data: any) => {
          if (!data?.data?.success) {
            if (data?.data?.message != "") {
              Notify.error(t(data?.data?.message));
            } else {
              Notify.error(t("Getting information on test run failed!"));
            }
          } else {
            let dataTest = data?.data?.data;
            setDataTestResult(dataTest);
            const countPassed = dataTest?.testResults
              ? dataTest?.testResults.filter((item: any) => item?.pass)?.length
              : 0;
            if (dataTest?.testResults && countPassed === dataTest?.testResults.length) {
              setIsRunCodeSuccess(true);
            } else {
              setIsRunCodeSuccess(false);
            }
          }
          setIsLoading(false);
        });
      }
    }
  }, [data]);

  useEffect(() => {
    const subscribe = PubSub.subscribe("OnCountNotifyChange", (chanel, data: RunCodeResultRealtimeProp) => {
      const runCodeRequest = !!data?.runCodeRequest ? data?.runCodeRequest : null;
      if (runCodeRequest != null && profile) {
        if (runCodeRequest?.userId == profile?.userId && runCodeRequest?.id == activityId) {
          //View runcode result
          const codeCompile = !!data?.codeCompile ? data?.codeCompile : null;
          if (codeCompile != null) {
            setTimeout(function () {
              setDataTestResult(codeCompile);
              const countPassed = codeCompile?.testResults
                ? codeCompile?.testResults.filter((item: any) => item?.pass)?.length
                : 0;
              if (codeCompile?.testResults && countPassed === codeCompile?.testResults.length) {
                setIsRunCodeSuccess(true);
              } else {
                setIsRunCodeSuccess(false);
              }
              setIsLoading(false);
            }, 2000);
          }
        }
      }
    });
    return () => {
      PubSub.unsubscribe(subscribe);
    };
  }, []);

  // default lang
  const onChangeLanguage = (lang: string) => {
    //Not allow change language. with NO_MAIN case
    if (codeActivity?.generationCodeType === "NO_MAIN" && !!codeActivity?.codeSample) {
      return;
    }
    setListCodes((prev) => ({ ...prev, [currentLanguage]: editorRef.current?.getValue() }));
    const submittedSolution = submittedSolutions && submittedSolutions.find((x: any) => x.languageKey == lang);

    const currentTemplate = listCodeTemplates.find((x: any) => x.languageKey == lang);

    let codeContent =
      listCodes[lang] ||
      (submittedSolution ? submittedSolution?.userCode : codeActivity?.codeSample || currentTemplate?.codeContent);
    //Need more enhance
    if (codeActivity?.activityCodeSubType === ActivityCodeSubTypeEnum.OOP && codeContent) {
      codeContent = JSON.parse(codeContent);
      codeContent = codeContent[0].source;
    }
    setCurrentLanguage(lang);
    let editorLang = getLanguageSelection(lang)?.data_mapping;
    editorRef.current?.updateOptions({ language: editorLang });

    const codeSubmitted = languagesCodeSubmitted?.find((e) => e.languageKey === lang);
    if (codeSubmitted) {
      initialCode.current = codeSubmitted.userCode || "";
      updateEditorValue(initialCode.current);
      return;
    }

    initialCode.current = codeContent || "";

    updateEditorValue(initialCode.current);
  };

  const onReset = () => {
    updateEditorValue(initialCode.current);
  };

  const handleSubmitCode = async (isSubmitted = false) => {
    let submitCode;
    if (codeActivity?.activityCodeSubType === ActivityCodeSubTypeEnum.OOP) {
      updateCodeToTabData(editorRef.current?.getValue());

      submitCode = tabCodes.map((item: any) => {
        //Help for case current tab is active - Need get current tab code data.
        let codeSubmit = item.isActive ? editorRef.current?.getValue() : item.userCode;
        // codeSubmit = codeSubmit.replace(/[\r\t]/g, "");
        return {
          fileName: item.title,
          source: codeSubmit,
        };
      });
      submitCode = JSON.stringify(submitCode);
    } else {
      submitCode = editorRef.current?.getValue();
    }
    //Request data for submit
    const languageKey = currentLanguage;

    setIsLoading(true);
    let requestParams = {
      activityId,
      contextId,
      contextType,
      languageKey,
      isSubmitted,
      userCode: submitCode && Buffer.from(submitCode).toString("base64"),
      href: location.origin + location.pathname,
    };
    let res;
    if (contextType === ActivityContextType.Contest) {
      res = await CodingService.contestRun(requestParams);
    } else if (contextType === ActivityContextType.Training) {
      requestParams.activityId = contextId;
      res = await CodingService.trainingRun(requestParams);
    } else if (contextType === ActivityContextType.Challenge) {
      // requestParams.contextId = contextId;
      res = await CodingService.challengeRun(requestParams);
    } else if (contextType === ActivityContextType.Evaluating) {
      res = await CodingService.evaluateSubmitCode({
        ...requestParams,
        token: token,
        cookie: cookieEvaluate,
      });
    }

    const data = res?.data?.data;
    const message = res?.data?.message;

    if (!res?.data?.success) {
      setDataTestResult(undefined);

      if (!message) {
        return;
      }
      switch (message) {
        case "Coding_102":
          break;
        case "Coding_103":
        case "Learn_303":
          break;
        case "Source code is empty!":
          break;
        case "Source code exceeds the allowed number of characters!":
          break;
        case "The allowed number of submissions has been exceeded!":
          PubSub.publish(PubsubTopic.SET_ACTIVITY_CODE_CONTEXT, {
            totalSubmitted: limitNumberSubmission,
          });
          break;
        case "This task is not part of the contest!":
          break;
        case "You need to complete the previous task!":
          PubSub.publish(PubsubTopic.SET_ACTIVITY_CODE_CONTEXT, {
            totalSubmitted: limitNumberSubmission,
          });
          break;
        case "Coding_043":
          setIsLoading(false);
          confirmAction({
            message: t("Coding_043"),
            title: t("Notice"),
            labelConfirm: t("Ok"),
            allowCancel: false,
            withCloseButton: false,
          });
          break;
        case "CODING_REQUEST_PENDING":
          let message = isSubmitted ? t("SUBMIT_REQUEST_PENDING") : t("RUNCODE_REQUEST_PENDING");
          showNotification({
            color: "cyan",
            message: <span className="font-medium">{message}</span>,
            style: { marginTop: "45px", marginRight: "-10px" },
            classNames: {
              description: "break-words",
            },
            loading: isSubmitted,
            autoClose: 3000,
          });
          break;
        default:
          break;
      }
      if (message != "CODING_REQUEST_PENDING" && message != "Learn_309") {
        let message = t(res.data.message);
        if (res.data.message.trim().startsWith("BLOCK_RUNCODE_MESSAGE")) {
          message = t(
            "You can't perform this action due to system attack suspicion. Try again after {{second}} seconds",
            {
              second: res.data.message.replace("BLOCK_RUNCODE_MESSAGE_", "").replace("_SECONDS", ""),
            }
          );
        }
        confirmAction({
          message: message,
          title: t("Notice"),
          labelConfirm: t("Ok"),
          allowCancel: false,
        });
        setIsLoading(false);
      }
      return;
    }

    setDataTestResult(data);

    if (isSubmitted) {
      if (contextType === ActivityContextType.Evaluating) {
        if (res?.data?.data?.submitHistoryResult?.isComplete) {
          reFetchContextData();
        }
      } else {
        reFetchContextData();
      }
      const countPassed = data?.testResults ? data?.testResults.filter((item: any) => item.pass)?.length : 0;
      if (data?.testResults && countPassed === data?.testResults.length) {
        setOpenFinishLesson(true);
        PubSub.publish(ActivityCodeChanelEnum.SUBMITSUCCESSFULLY, {
          data,
          activityId,
        });
      } else {
        PubSub.publish(ActivityCodeChanelEnum.SUBMIT_CODE_DONE, {
          data,
        });
      }
      if (!isAdminContext) {
        PubSub.publish(PubsubTopic.SET_ACTIVITY_CODE_CONTEXT, {
          totalSubmitted: totalSubmitted + 1,
        });
      }
      //Reset list code after submit successfully.
      setListCodes({});
      //Reset disable button submit after submit
      setIsRunCodeSuccess(false);
      //Re-fetch data
      //fetchCourse()

      //Re-assign value of remain try
      // PubSub.publish(ActivityCodeChanelEnum.INCREASE_REMIAN_TRY, { remain: countRemainRetry });
    } else {
      const countPassed = data?.testResults ? data?.testResults.filter((item: any) => item.pass)?.length : 0;
      if (data?.testResults && countPassed === data?.testResults.length) {
        setIsRunCodeSuccess(true);
      } else {
        setIsRunCodeSuccess(false);
      }
    }
    setIsLoading(false);
    setIsSubmitResult(isSubmitted);
  };

  const onChangeEditor = (value: string | undefined) => {
    setIsRunCodeSuccess(false);
  };

  const onChangeTabCode = (tab: any) => {
    updateCodeToTabData(editorRef.current?.getValue());
    setActiveTabId(tab);
    const updateTabs = tabCodes.map((item: any, idx: number) => {
      item.isActive = idx === tab;
      if (idx === tab) {
        initialCode.current = "";
        updateEditorValue(item.userCode);
      }
      return item;
    });
    setTabCodes(updateTabs);
  };

  const updateCodeToTabData = (code: string) => {
    tabCodes.map((item: any) => {
      if (item.id == idTabPrefix + activeTabId) {
        item.userCode = code;
      }
      return item;
    });
  };

  const onUpdateTabName = (tabProps: any) => {
    const { idx, name } = tabProps;
    tabCodes[idx].title = getTitle(name, tabCodes);
    setTabCodes(tabCodes);
  };

  const onRemoveTabCode = (idx: number) => {
    let newTabs = tabCodes.filter((item: any, index: number) => index != idx);
    let activeIndex = newTabs.length > idx ? idx : idx - 1;
    newTabs[activeIndex].isActive = true;
    initialCode.current = "";
    updateEditorValue(newTabs[activeIndex].userCode);
    setTabCodes(newTabs);
  };

  const addNewTab = () => {
    updateCodeToTabData(editorRef.current?.getValue());
    const latestItem = tabCodes[tabCodes.length - 1];
    const indexNum = +latestItem.id.replace(idTabPrefix, "") + 1;
    const fileName = getTitle("New-file-" + indexNum, tabCodes);

    const updateTabs = tabCodes.map((item: any) => {
      item.isActive = false;
      return item;
    });

    const newTab: TabCodeDataProps = {
      title: fileName,
      id: idTabPrefix + indexNum,
      userCode: "",
      isActive: true,
    };

    updateTabs.push(newTab);

    //Set data for new tab.
    setActiveTabId(indexNum);
    setTabCodes(updateTabs);
    updateEditorValue("");
    initialCode.current = "";
  };

  //Find next activity
  const currentIndex = activities?.findIndex((item: any) => item.activityId === activityId);
  const nextActivity = activities && currentIndex < activities.length && activities[currentIndex + 1];

  return (
    <Split
      sizes={isMobile ? [100, 100] : fullSize ? [100, 0] : [70, 30]}
      minSize={100}
      expandToMin={false}
      gutterSize={4}
      gutterAlign="center"
      snapOffset={30}
      dragInterval={1}
      direction="vertical"
      cursor="row-resize"
      className="flex h-full flex-col relative"
    >
      <section className="flex flex-col ">
        <div className="bg-[#0D1219]">
          <Toolbar
            supportedLanguages={supportedLanguages}
            currentRemainRetry={remainRetry}
            currentLanguage={currentLanguage}
            onToggleFullEditor={onToggleFullSize}
            isFullScreen={fullSize}
            setLanguage={onChangeLanguage}
            isOop={codeActivity?.activityCodeSubType === ActivityCodeSubTypeEnum.OOP}
            tabCodes={tabCodes}
            onChangeTabCode={onChangeTabCode}
            onRemoveTabCode={onRemoveTabCode}
            onUpdateTabName={onUpdateTabName}
            addNewTab={addNewTab}
            loading={isLoading}
            onReset={onReset}
            limitNumberSubmission={limitNumberSubmission}
            isExtenalCompilerURL={codeActivity?.extenalCompilerURL != "" && codeActivity?.extenalCompilerURL != null}
            onSubmit={handleSubmitCode}
            notShowEdit={notShowEdit}
            />
          {openFinishLesson && (
            <ModalFinishSubmit
              contextId={contextId}
              contextType={contextType}
              onClose={() => setOpenFinishLesson(false)}
              nextActivity={nextActivity}
              token={token}
              chapters={chapters}
              activityId={activityId}
            />
          )}
        </div>
        <div className={`relative flex-grow overflow-hidden`}>
          <LoadingOverlay zIndex={11} visible={isLoading} />
          <Editor
            ref={ref}
            data=""
            defaultLang={getLanguageSelection(currentLanguage)?.data_mapping}
            onChange={onChangeEditor}
            editorRef={editorRef}
          />
        </div>
      </section>

      <ConsolePanel
        onSubmit={handleSubmitCode}
        resultTest={dataTestResult}
        isSubmitResult={isSubmitResult}
        notShowEdit={notShowEdit}
      />
    </Split>
  );
};
export default EditorBoard;
