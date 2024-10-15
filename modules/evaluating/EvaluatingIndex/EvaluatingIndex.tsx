import { Breadcrumbs } from "@edn/components";
import {
    Avatar,
    Button,
    Card,
    Checkbox,
    clsx,
    Flex,
    Group,
    HoverCard,
    Image,
    Input,
    Loader,
    Pagination,
    Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { getAccessToken } from "@src/api/axiosInstance";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { NotFound } from "@src/components/Svgr/components";
import { EvaluateGradeEnum, EvaluateStatusEnum } from "@src/constants/evaluate/evaluate.constant";
import { formatDateGMT, FunctionBase } from "@src/helpers/fuction-base.helpers";
import useDebounce from "@src/hooks/useDebounce";
import CodingService from "@src/services/Coding/CodingService";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listSelect } from "./components/contanst";
import { ModalSelectTemplate } from "./components/ModalSelectTemplate";

const EvaluatingIndex = () => {
  const { t } = useTranslation();
  const [openModalSelectTemplate, setOpenModalSelectTemplate] = useState(false);
  const profile = useSelector(selectProfile);
  const token = getAccessToken();
  const dispatch = useDispatch();
  const router = useRouter();
  const locale = router.locale;

  const [data, setData] = useState({} as any);
  const [loading, setLoading] = useState(true);

  const getEvaluatingType = (status: EvaluateStatusEnum, grade: EvaluateGradeEnum, score: any, point: any) => {
    if (status === EvaluateStatusEnum.Finished) {
      switch (grade) {
        case EvaluateGradeEnum.Poor:
          return (
            <div>
              <div className="bg-[#dcdff1] inline p-[6px] rounded-sm font-semibold">{`${score}/${point}`}</div>
              <Text className="mt-2 text-[#6e84a3]" size={12}>
                {t("Poor")}
              </Text>
            </div>
          );
        case EvaluateGradeEnum.Weak:
          return (
            <div>
              <div className="bg-[#36b37e] inline p-[6px] rounded-sm font-semibold text-white">{`${score}/${point}`}</div>
              <Text className="mt-2 text-[#6e84a3]" size={12}>
                {t("Weak")}
              </Text>
            </div>
          );
        case EvaluateGradeEnum.Pass:
          return (
            <div>
              <div className="bg-[#00a9de] inline p-[6px] rounded-sm font-semibold text-white">{`${score}/${point}`}</div>
              <Text className="mt-2 text-[#6e84a3]" size={12}>
                {t("Pass")}
              </Text>
            </div>
          );
        case EvaluateGradeEnum.Credit:
          return (
            <div>
              <div className="bg-[#6554c0] inline p-[6px] rounded-sm font-semibold text-white">{`${score}/${point}`}</div>
              <Text className="mt-2 text-[#6e84a3]" size={12}>
                {t("Credit")}
              </Text>
            </div>
          );
        case EvaluateGradeEnum.Distinction:
          return (
            <div>
              <div className="bg-[#fe8900] inline p-[6px] rounded-sm font-semibold text-white">{`${score}/${point}`}</div>
              <Text className="mt-2 text-[#6e84a3]" size={12}>
                {t("Distinction")}
              </Text>
            </div>
          );
        case EvaluateGradeEnum.HighDistinction:
          return (
            <div>
              <div className="bg-[#ec467c] inline p-[6px] rounded-sm font-semibold text-white">{`${score}/${point}`}</div>
              <Text className="mt-2 text-[#6e84a3]" size={12}>
                {t("High distinction")}
              </Text>
            </div>
          );
      }
    } else {
      switch (status) {
        case EvaluateStatusEnum.Expired:
          return (
            <div>
              <div className="bg-[#a5adba] inline p-[6px] rounded-sm font-semibold">{t("Expired")}</div>
            </div>
          );
        case EvaluateStatusEnum.Waiting:
          return (
            <div>
              <div className="bg-[#fec] inline p-[6px] rounded-sm font-semibold">{t("Not yet started")}</div>
            </div>
          );
        case EvaluateStatusEnum.Running:
          return (
            <div>
              <div className="bg-[rgba(0,82,204,.2)] inline p-[6px] rounded-sm font-semibold text-blue-500">
                {t("In Progress")}
              </div>
            </div>
          );
      }
    }
  };
  const [filter, setFilter] = useState({
    pageSize: 10,
    pageIndex: 1,
    keyword: "",
    filterGrade: [],
    filterStatus: [],
  });
  const [targetSelect, setTargetSelect] = useState([]);

  const filterDebounce = useDebounce(filter);
  const fetch = async () => {
    const res = await CodingService.searchEvaluate({
      ...filter,
    });

    if (res?.data?.success) {
      setData(res.data.data);
    }
    setLoading(false);
  };
  const handleFilter = () => {
    console.log(targetSelect);
    setFilter((pre) => ({
      ...pre,
      pageIndex: 1,
      filterGrade: targetSelect.map((item) => {
        if (item === "8" || item === "9" || item === "10" || item == "11") {
          return;
        }
        if (item === "7") {
          return;
        }
        return item;
      }),
      filterStatus: targetSelect.map((item) => {
        if (item === "8" || item === "9" || item === "11") {
          return +item - 7;
        } else {
          return;
        }
      }),
    }));
  };
  const handleCheckboxChange = (value) => {
    if (value.find((item) => item == "7")) {
      setTargetSelect(["7"]);
    } else {
      setTargetSelect(value);
    }
  };

  useEffect(() => {
    fetch();
  }, [filterDebounce, locale]);

  return (
    <div className="mb-16">
      {openModalSelectTemplate && <ModalSelectTemplate onClose={() => setOpenModalSelectTemplate(false)} />}
      <div className="bg-[#1e2a55] pb-20 before:bg-[url('/images/evaluating/evaluting-bg-left.png')]">
        <Container size="xl">
          <Flex className="justify-center">
            <Breadcrumbs
              isWhite
              data={[
                {
                  href: "/",
                  title: t("Home"),
                },
                {
                  title: t("Evaluating"),
                },
              ]}
            />
          </Flex>
          <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between flex-wrap gap-5">
            <div className="flex gap-6 items-center flex-col md:flex-row">
              <img width={65} height={63} src="/images/evaluating/evaluting-banner-icon.png" alt="" />
              <div className="text-white w-[92%] text-center sm:text-start">
                <Text size={24} className="uppercase">
                  {t("Evaluate your programming skills")}
                </Text>
                <Text size={16}>
                  {t(
                    "We provide the opportunity for you to test your level in programming so that you can choose the right learning path."
                  )}
                </Text>
              </div>
            </div>
            {!!token &&
              !(
                data?.listEvalute?.rowCount < 1 &&
                filter.keyword === "" &&
                filter?.filterGrade?.length == 0 &&
                filter?.filterStatus?.length == 0
              ) && (
                <div>
                  <Button
                    disabled={data?.numberOfCreateableEvalute === 0}
                    size="md"
                    color="red"
                    onClick={() => setOpenModalSelectTemplate(true)}
                  >
                    {`${t("Create")} (${data?.numberOfCreateableEvalute ?? 0})`}
                  </Button>
                </div>
              )}

            <div className="absolute left-0 bg-[url('/images/evaluating/evaluting-bg-left.png')]" />
            <div className="absolute right-0 bg-[url('/images/evaluating/evaluting-bg-right.png')]" />
          </div>
        </Container>
      </div>
      <Container size="xl" className="pt-10">
        {filter.keyword === "" &&
        filter?.filterGrade?.length == 0 &&
        data?.listEvalute?.rowCount < 1 &&
        filter?.filterStatus?.length == 0 ? (
          <Card className="mt-5">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1 text-lg">
                <Trans i18nKey="CONFIRM_NEW_EVALUATING" t={t}>
                  You haven&apos;t had have any evaluation test yet, let&apos;s
                  <Text className="text-red-500">Create a new one!</Text>
                </Trans>
              </div>
              <Button
                size="xl"
                className="bg-red-500 hover:bg-red-300"
                onClick={() => setOpenModalSelectTemplate(true)}
              >
                <Text className="uppercase">
                  {`${t("Create the evaluation")} (${data?.numberOfCreateableEvalute ?? 0})`}
                </Text>
              </Button>
              <Image src="/images/evaluating/no-evaluation.png" width={436} />
              <Text>{t("There is no evaluation test")}</Text>
            </div>
          </Card>
        ) : (
          <div>
            {!!token ? (
              <>
                <div className="flex justify-between flex-col lg:flex-row flex-wrap gap-5">
                  <div className="flex justify-start lg:w-[40%]">
                    <Text size={20} weight={700}>
                      {`${t("Total number of evaluation tests")} (${FunctionBase.formatNumber(
                        data?.listEvalute?.rowCount || 0
                      )})`}
                    </Text>
                  </div>
                  <div className="sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr] sm:gap-3 lg:w-[56%] flex flex-col gap-3">
                    <Input
                      placeholder={t("Name of examinee or name of test")}
                      onChange={(value) => {
                        setFilter((pre) => ({
                          ...pre,
                          pageIndex: 1,
                          keyword: value.target.value.trim(),
                        }));
                      }}
                    />
                    <DateInput
                      clearable
                      placeholder={t("From date")}
                      valueFormat="MM/DD/YYYY"
                      onChange={(value) => {
                        setFilter((pre) => ({
                          ...pre,
                          fromDate: value,
                        }));
                      }}
                    />
                    <DateInput
                      clearable
                      placeholder={t("To date")}
                      valueFormat="MM/DD/YYYY"
                      onChange={(value) => {
                        setFilter((pre) => ({
                          ...pre,
                          toDate: value,
                        }));
                      }}
                    />
                    <div className="flex justify-center">
                      <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                          <Button variant="outline" className="w-[200px]">
                            {t("Filter")}
                          </Button>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Checkbox.Group value={targetSelect} onChange={handleCheckboxChange}>
                            {listSelect.map((value: any) => {
                              return (
                                <div
                                  className="border-dashed flex justify-between py-3 border-b"
                                  key={value.status}
                                >
                                  <Checkbox
                                    value={value.grade + ""}
                                    label={
                                      <div
                                        className={`bg-[${value.bgColor}] inline p-[6px] rounded-sm font-semibold text-[${value.textColor}] cursor-pointer`}
                                      >
                                        {t(value.label)}
                                      </div>
                                    }
                                  />
                                  <Text>{value?.labelPoint}</Text>
                                </div>
                              );
                            })}
                            <div className="border-dashed py-3 border-b">
                              <Button className="w-[100%]" onClick={handleFilter}>
                                {t("Search")}
                              </Button>
                            </div>
                          </Checkbox.Group>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </div>
                  </div>
                </div>
                <div className="mt-4 mb-4">
                  <div className="bg-[#e1e2ea] text-[#5e6c84] gap-5 p-[15px] hidden lg:grid lg:grid-cols-[1fr_1fr_1fr_1fr] shadow-sm">
                    <Text>{t("End Date")}</Text>
                    <Text>{t("Examinee")}</Text>
                    <Text>{t("Test name")}</Text>
                    <Text>{t("Result")}</Text>
                  </div>
                  {loading ? (
                    <div className="mt-32 flex justify-center">
                      <Loader color="blue" />
                    </div>
                  ) : (
                    <>
                      {data?.listEvalute?.results?.length > 0 ? (
                        data.listEvalute.results.map((value: any) => {
                          return (
                            <div
                              onClick={() =>
                                router.push(
                                  value.token
                                    ? `/evaluating/detail/${value.id}?token=${value.token}`
                                    : `/evaluating/detail/${value.id}`
                                )
                              }
                              key={value.id}
                              className={clsx(
                                value.userTestId
                                  ? "lg:border-l-[#ffab00] border-t-[#ffab00]"
                                  : "lg:border-l-[#09d0da] border-t-[#09d0da]",
                                "grid lg:grid-cols-[1fr_1fr_1fr_1fr] lg:p-[15px] bg-white gap-5  lg:border-t-0 border-t-[3px]  rounded-sm lg:border-l-[3px] lg:border-b-gray-300 lg:border-b hover:bg-[#e9eafa] cursor-pointer"
                              )}
                            >
                              <div className="lg:hidden border-b-gray-300 border-b p-[15px] flex items-center bg-[#E9EAFA]">
                                <Text className="w-[120px] lg:hidden">{t("Test Name")}</Text>
                                <Text size={16} className="uppercase">
                                  {value.name}
                                </Text>
                              </div>
                              <div className=" border-b-gray-300 border-b p-[15px] flex items-center lg:border-none lg:p-0">
                                <Text className="w-[120px] lg:hidden">{t("Date")}</Text>
                                <Text size={16}>
                                  {value.status == EvaluateStatusEnum.Running
                                    ? "-"
                                    : formatDateGMT(value.endActualDate) ?? "-"}
                                </Text>
                              </div>
                              <div className=" border-b-gray-300 border-b p-[15px] flex items-center lg:border-none lg:p-0">
                                <Text className="w-[120px] lg:hidden">{t("Examinee")}</Text>
                                <div className="flex items-center gap-2">
                                  <Avatar radius="100%" src={value.userTest.avatarUrl} />
                                  {!value.anonymousUserName ? (
                                    <Link
                                      href={`/profile/${value.userTest?.userId}`}
                                      className="text-blue-600 hover:underline"
                                      onClick={(event) => event.stopPropagation()}
                                    >
                                      {value.userTest.userName}
                                    </Link>
                                  ) : (
                                    <Text size={16}>{value.userTest.userName}</Text>
                                  )}
                                </div>
                              </div>

                              <div className="hidden lg:flex lg:items-center lg:border-none lg:p-0">
                                <Text className="w-[120px] lg:hidden">{t("Test Name")}</Text>
                                <Text size={16} className="uppercase">
                                  {value.name}
                                </Text>
                              </div>
                              <div className="border-b-gray-300 border-b p-[15px] lg:border-none lg:p-0 flex items-center">
                                <Text className="w-[120px] lg:hidden">{t("Result")}</Text>
                                <div className="flex flex-col justify-center">
                                  {getEvaluatingType(value.status, value.grade, value.pointsScored, value.point)}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex flex-col w-[100%] items-center justify-center mb-10 bg-white py-10">
                          <NotFound height={199} width={350} />
                          <Text mt="lg" size="lg" fw="bold">
                            {t("No Data Found !")}
                          </Text>
                        </div>
                      )}
                    </>
                  )}
                  <Group position="center" className="mt-4">
                    <Pagination
                      withEdges
                      value={data?.listEvalute?.currentPage}
                      total={data?.listEvalute?.pageCount}
                      onChange={(pageIndex) => {
                        setFilter((prev) => ({
                          ...prev,
                          pageIndex: pageIndex,
                        }));
                      }}
                    />
                  </Group>
                </div>
              </>
            ) : (
              <Card className="mt-5">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-1 text-lg">
                    <Text>{t("Please")}</Text>
                    <Text className="text-red-500"> {t("Sign in")} </Text>
                    <Text>{t("to start your evaluation test!")}</Text>
                  </div>
                  <Button
                    onClick={() => {
                      dispatch(setOpenModalLogin(true));
                    }}
                    size="xl"
                    className="bg-yellow-300 hover:bg-yellow-500"
                  >
                    <Text className="uppercase">{t("Login")}</Text>
                  </Button>
                  <Image src="/images/evaluating/no-evaluation.png" width={436} />
                  <Text>{t("There is no evaluation test")}</Text>
                </div>
              </Card>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};
export default EvaluatingIndex;
