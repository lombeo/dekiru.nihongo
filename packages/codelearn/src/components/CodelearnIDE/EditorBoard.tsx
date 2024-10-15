import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, LoadingOverlay } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { NotifyChanelEnum } from "@src/components/Notify/src/configs";
import { PubsubTopic } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Split from "react-split";
import { ActivityCodeChanelEnum, ActivityCodeSubTypeEnum, allowedLanguages } from "../../configs";
import { CodelearnService } from "../../services/codelearn.service";
import { ConsolePanel } from "../ConsolePanel";
import { Editor } from "../Editor";
import ModalFinishSubmit from "../Modal/ModalFinishSubmit";
import { Toolbar } from "../Toolbar";
import { useIdeContext } from "./IdeContext";

interface EditorBoardProps {}

interface TabCodeDataProps {
  title: string;
  id: string;
  userCode: string;
  isActive: boolean;
}

interface RunCodeResultRealtimeProp {
  codeCompile: {
    testResults: any;
  };
  runCodeRequest: { id: any; userId: any };
  runTestId: any;
}

export const getLanguageSelection = (lang: string) => {
  return allowedLanguages.find((item: any) => {
    return item.value === lang;
  });
};

const EditorBoard = (props: EditorBoardProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    activityId,
    contextId,
    contextType,
    onToggleFullSize,
    fullSize,
    activityDetails = {},
    contextDetail = {},
    remainRetry,
    codeActivity = {},
    setIsRunCodeSuccess,
    languagesCodeSubmitted,
    limitNumberSubmission,
    totalSubmitted,
    isAdminContext,
    isEnrolled,
    data,
    isFetched,
    allowPreview,
  } = useIdeContext();

  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);

  const { programingLanguages = [], listCodeTemplates = [] } = codeActivity;
  const { submittedSolutions } = contextDetail ?? {};

  const activities = contextDetail?.sectionsInCurrentSchedule?.flatMap((e) => e.activities);

  const isMobile = useMediaQuery("(max-width: 756px)");

  const [activeTabId, setActiveTabId] = useState(0);
  //Default value
  const defaultUserCode = "";
  const editorRef = useRef(null);
  const ref = useRef<any>(null);
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
  const [dataTestResult, setDataTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openFinishLesson, setOpenFinishLesson] = useState(false);
  const [isSubmitResult, setIsSubmitResult] = useState(false);
  const [listCodes, setListCodes] = useState({});

  //Using for assign value to editor
  const updateEditorValue = (value: any) => {
    setTimeout(() => {
      editorRef.current?.updateOptions({ readOnly: false });
      editorRef.current?.setValue(isNil(value) ? "" : value);
      ref.current?.selectDots();
    }, 500);
  };

  const idTabPrefix = "new-file-";
  const defaultTabCodeData: TabCodeDataProps = {
    title: "New-file",
    id: idTabPrefix + "0",
    userCode: defaultUserCode,
    isActive: true,
  };
  const [tabCodes, setTabCodes] = useState(undefined);

  const setTitle = (title = "New-file", listTabs) => {
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
      return setTitle(title + "-1", listTabs);
    } else {
      return title;
    }
  };

  useEffect(() => {
    let token = PubSub.subscribe(ActivityCodeChanelEnum.LOADUSERCODE, (mess, data: any) => {
      setUserCode(data);
      setCurrentLanguage(data?.languageKey);
    });
    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  useEffect(() => {
    let editorVal = defaultUserCode;
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
        CodelearnService.getRunCodeLogs({ runtestid: runtestid }).then((data: any) => {
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
    const subscribe = PubSub.subscribe(NotifyChanelEnum.RUN_CODE_DONE, (chanel, data: RunCodeResultRealtimeProp) => {
      const runCodeRequest = !!data?.runCodeRequest ? data?.runCodeRequest : null;

      if (runCodeRequest != null && profile) {
        if (runCodeRequest?.userId == profile?.userId && runCodeRequest?.id == activityId) {
          //View runcode result
          const codeCompile = !!data?.codeCompile ? data?.codeCompile : null;
          if (codeCompile != null) {
            setTimeout(function () {
              setDataTestResult(codeCompile);
              const countPassed = codeCompile?.testResults
                ? codeCompile?.testResults.filter((item: any) => item?.c)?.length
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

    updateEditorValue(codeContent || defaultUserCode);
  };

  const handleSubmitCode = (isSubmitted = false) => {
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
    const requestParams = {
      activityId,
      contextId,
      contextType,
      languageKey,
      isSubmitted,
      userCode: submitCode && Buffer.from(submitCode).toString("base64"),
      href: window.location.origin + router.asPath,
    };
    setIsLoading(true);
    CodelearnService.submitSolution(requestParams).then((data: any) => {
      if (!data.data.success) {
        switch (data.data.message) {
          case "Learn_302":
            break;
          case "Learn_303":
            break;
          case "Learn_304":
            break;
          case "Learn_305":
            break;
          case "Learn_306":
            PubSub.publish(PubsubTopic.SET_ACTIVITY_CODE_CONTEXT, {
              totalSubmitted: limitNumberSubmission,
            });
            break;
          case "Learn_307":
            break;
          case "Learn_308":
            PubSub.publish(PubsubTopic.SET_ACTIVITY_CODE_CONTEXT, {
              totalSubmitted: limitNumberSubmission,
            });
            break;
          case "Learn_309":
            setIsLoading(false);
            confirmAction({
              message: t("The course has expired"),
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
        if (
          data.data.message != "CODING_REQUEST_PENDING" &&
          data.data.message != "Learn_309" &&
          data.data.message != null &&
          data.data.message.trim() != ""
        ) {
          let message = t(data.data.message);
          if (data.data.message.trim().startsWith("BLOCK_RUNCODE_MESSAGE")) {
            message = t(
              "You can't perform this action due to system attack suspicion. Try again after {{second}} seconds",
              {
                second: data.data.message.replace("BLOCK_RUNCODE_MESSAGE_", "").replace("_SECONDS", ""),
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
        setDataTestResult(undefined);
      } else {
        const dataTest = data.data.data;
        setDataTestResult(dataTest);
        if (isSubmitted) {
          const countPassed = dataTest?.testResults
            ? dataTest?.testResults.filter((item: any) => item.pass)?.length
            : 0;
          if (dataTest?.testResults && countPassed === dataTest?.testResults.length) {
            setOpenFinishLesson(true);
            PubSub.publish(ActivityCodeChanelEnum.SUBMITSUCCESSFULLY, {
              dataTest,
              activityId,
            });
          } else {
            PubSub.publish(ActivityCodeChanelEnum.SUBMIT_CODE_DONE, {
              dataTest,
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
          const countPassed = dataTest?.testResults
            ? dataTest?.testResults.filter((item: any) => item.pass)?.length
            : 0;
          if (dataTest?.compileResult && dataTest?.testResults && countPassed === dataTest?.testResults.length) {
            setIsRunCodeSuccess(true);
          } else {
            setIsRunCodeSuccess(false);
          }
        }
        setIsLoading(false);
      }
      setIsSubmitResult(isSubmitted);
    });
  };

  const onChangeEditor = (value: string | undefined) => {
    let runtestid = FunctionBase.getParameterByName("runtestid", location.href);
    !runtestid && setIsRunCodeSuccess(false);
  };

  //Handle event when tab code is changed and update data to editor
  const onchangeTabCode = (tab: any) => {
    //Update data for old tab before change tab
    updateCodeToTabData(editorRef.current?.getValue());
    //Set new tab Id
    setActiveTabId(tab);
    const updateTabs = tabCodes.map((item: any, idx: number) => {
      item.isActive = idx === tab;
      if (idx === tab) {
        updateEditorValue(item.userCode);
      }
      return item;
    });
    setTabCodes(updateTabs);
  };
  //Set value to storage code data tabs.
  const updateCodeToTabData = (code: string) => {
    tabCodes.map((item: any) => {
      if (item.id == idTabPrefix + activeTabId) {
        item.userCode = code;
      }
      return item;
    });
  };
  //On Update Tab name
  const onUpdateTabName = (tabProps: any) => {
    const { idx, name } = tabProps;
    let newName = setTitle(name, tabCodes);
    tabCodes[idx].title = newName;
    setTabCodes(tabCodes);
  };
  const onRemoveTabCode = (idx: number) => {
    let newTabs = tabCodes.filter((item: any, index: number) => index != idx);
    let activeIndex = newTabs.length > idx ? idx : idx - 1;
    newTabs[activeIndex].isActive = true;
    updateEditorValue(newTabs[activeIndex].userCode);
    setTabCodes(newTabs);
  };

  const addNewTab = () => {
    updateCodeToTabData(editorRef.current?.getValue());
    const latestItem = tabCodes[tabCodes.length - 1];
    const indexNum = +latestItem.id.replace(idTabPrefix, "") + 1;
    const fileName = setTitle("New-file-" + indexNum, tabCodes);
    const updateTabs = tabCodes.map((item: any) => {
      item.isActive = false;
      return item;
    });
    const newTab: TabCodeDataProps = {
      title: fileName,
      id: idTabPrefix + indexNum,
      userCode: defaultUserCode,
      isActive: true,
    };
    updateTabs.push(newTab);
    //Set data for new tab.
    setActiveTabId(indexNum);
    setTabCodes(updateTabs);
    updateEditorValue(defaultUserCode);
  };
  //CloseModalFinishSubmit
  const closeModalFinishSubmit = () => {
    setOpenFinishLesson(false);
  };

  //Find next activity
  const currentIndex = activities?.findIndex((item: any) => item.id === +activityId);

  const nextActivity = activities && currentIndex < activities.length && activities[currentIndex + 1];

  console.log(!isEnrolled && !!allowPreview && !isAdminContext && isFetched, allowPreview);

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
      className="flex flex-col relative"
    >
      <section className="flex flex-col ">
        {!isEnrolled && !allowPreview && !isAdminContext && isFetched ? (
          <>
            <div className="z-10 absolute top-0 left-0 right-0 bottom-0 bg-[rgb(0,0,0)] opacity-60"></div>
            <div style={{ transform: "translate(-50%,-50%)" }} className="z-20 absolute top-1/2 left-1/2">
              <div>
                {profile ? (
                  <Button
                    size="md"
                    className="bg-[#2C31CF] hover:opacity-[0.8] text-xl"
                    onClick={() => router.push(`/learning/${data?.contextDetail?.contextPermalink}`)}
                  >
                    {t("Enroll Now")}
                  </Button>
                ) : (
                  <div className="flex text-white gap-2 items-center text-xl">
                    <div>{t("Please")}</div>
                    <Button
                      size="md"
                      className="bg-[#2C31CF] hover:opacity-[0.8] text-xl"
                      onClick={() => {
                        dispatch(setOpenModalLogin(true));
                      }}
                    >
                      {t("login")}
                    </Button>
                    <div>{t("to continue!")}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
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
            onChangeTabCode={onchangeTabCode}
            onRemoveTabCode={onRemoveTabCode}
            onUpdateTabName={onUpdateTabName}
            addNewTab={addNewTab}
            loading={isLoading}
            limitNumberSubmission={limitNumberSubmission}
            onSubmit={handleSubmitCode}
            isEnrolled={isEnrolled}
            isExtenalCompilerURL={codeActivity?.extenalCompilerURL != "" && codeActivity?.extenalCompilerURL != null}
          />
          <ModalFinishSubmit open={openFinishLesson} onClose={closeModalFinishSubmit} nextActivity={nextActivity} />
        </div>
        <div className={`relative flex-grow overflow-hidden`}>
          {<LoadingOverlay zIndex={11} visible={isLoading} />}
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
        activityDetails={activityDetails}
        onSubmitCode={handleSubmitCode}
        resultTest={dataTestResult}
        remainRetry={remainRetry}
        isSubmitResult={isSubmitResult}
      />
    </Split>
  );
};
export default EditorBoard;
