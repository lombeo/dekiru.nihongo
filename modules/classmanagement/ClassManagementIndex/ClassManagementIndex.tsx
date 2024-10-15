import { Breadcrumbs } from "@edn/components";
import { Button, Flex, Input, Loader, Pagination, Text } from "@mantine/core";
import { Container } from "@src/components";
import { NotFound } from "@src/components/Svgr/components";
import useDebounce from "@src/hooks/useDebounce";
import { LearnClassesService } from "@src/services";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Plus, Search } from "tabler-icons-react";
import ClassCard from "./components/ClassCard";

const ClassManagementIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [data, setData] = useState({} as any);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 9,
    keyword: "",
  });

  const filterDebounce = useDebounce(filter);
  const fetch = async () => {
    const res = await LearnClassesService.classList({
      ...filter,
    });
    if (res?.data?.success) {
      setData(res.data.data);
    } else {
      setData(null);
    }
    setIsLoading(false);
  };
  const checkCreate = async () => {
    const res = await LearnClassesService.checkRoleCreateClass();
    if (res?.data?.success) {
      setUserRole(res.data.data);
    }
  };

  useEffect(() => {
    checkCreate();
  }, []);

  useEffect(() => {
    fetch();
  }, [filterDebounce]);

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
                title: t("List class"),
              },
            ]}
          />
        </Flex>
        <div>
          <div className="flex justify-between flex-wrap gap-4">
            <Text className="text-3xl font-semibold">{t("Permission to manage class")}</Text>
            <div className="flex gap-6 flex-wrap">
              <Input
                placeholder={t("Search") + "..."}
                rightSection={<Search color="gray" />}
                className="md:w-[300px] w-full"
                onChange={(value) =>
                  setFilter((pre) => ({
                    ...pre,
                    pageIndex: 1,
                    keyword: value.target.value.trim(),
                  }))
                }
              />
              {userRole?.canCreateClass && (
                <Button leftIcon={<Plus />} onClick={() => router.push("./classmanagement/create")}>
                  {t("New class")}
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="mt-32 flex justify-center">
              <Loader color="blue" />
            </div>
          ) : (
            <>
              {data?.results?.length > 0 ? (
                <>
                  <div className="flex flex-col lg:flex-row gap-6 mt-8 flex-wrap">
                    {data.results.map((value) => {
                      return <ClassCard key={value.id} userRole={userRole} dataClass={value} fetch={fetch} />;
                    })}
                  </div>

                  <div className="flex justify-center py-5">
                    <Pagination
                      withEdges
                      value={data?.currentPage}
                      total={data?.pageCount}
                      onChange={(pageIndex) => {
                        setFilter((prev) => ({
                          ...prev,
                          pageIndex: pageIndex,
                        }));
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col w-[100%] items-center justify-center mb-10 bg-white py-10 mt-10">
                  <NotFound height={199} width={350} />
                  <Text mt="lg" size="lg" fw="bold">
                    {t("No Data Found !")}
                  </Text>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ClassManagementIndex;
