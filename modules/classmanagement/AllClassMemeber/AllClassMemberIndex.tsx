import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import {
  ActionIcon,
  Button,
  Card,
  FileInput,
  Flex,
  Image,
  Input,
  Loader,
  LoadingOverlay,
  Modal,
  Pagination,
  Select,
  Text,
} from "@mantine/core";
import { Container } from "@src/components";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import { NotFound } from "@src/components/Svgr/components";
import { resolveLanguage } from "@src/helpers/helper";
import useDebounce from "@src/hooks/useDebounce";
import { LearnClassesService } from "@src/services";
import { FriendService } from "@src/services/FriendService/FriendService";
import { debounce, uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Plus, Point, Search, X } from "tabler-icons-react";

enum ClassMemberStatus {
  Inviting,
  Accepted,
  Rejected,
}

enum ClassMemberRole {
  None,
  ClassMember,
  ClassManager,
  AssignedClassManager,
}

const AllClassMemeberIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [data, setData] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<any>();
  const [loadingAddUser, setLoadingAddUser] = useState(false);
  const id = router.query.id;
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const locale = router.locale;
  const langKey = locale === "vi" ? "vn" : "en";

  const handleSearchUsers = useCallback(
    debounce((query: string) => {
      if (!query || query.trim().length < 2) return;
      FriendService.searchUser({
        filter: query,
      }).then((res) => {
        let data = res?.data?.data;
        if (data) {
          data = data.map((user) => ({
            label: user.userName,
            value: user.userId,
          }));
          setUserOptions((prev) => uniqBy([...prev, ...data], "value"));
        }
      });
    }, 300),
    []
  );
  const validation = (data: any) => {
    let isValid = true;
    const file = data;
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      isValid = false;
    }
    if (file.size > 1024 * 1000 * 25) {
      Notify.error(t("Attachment file size cannot exceed 25MB"));
      isValid = false;
    } else if (file.name.length > 100) {
      Notify.error(t("File name must not exceed 100 characters"));
      isValid = false;
    }
    return isValid;
  };
  const onChangeFiles = async (data: any) => {
    setLoadingAddUser(true);
    const isValid = validation(data);
    if (!isValid) {
      return;
    }
    const formData = new FormData();
    formData.append("file", data);
    formData.append("classId", id.toString());
    const res = await LearnClassesService.importMember(formData);
    if (res?.data?.success) {
      Notify.success(t("Add successfully!"));
      fetch();
    } else {
      Notify.error(t(res?.data?.message));
    }
    setLoadingAddUser(false);
    setModalAddUser(false);
  };

  const [modalAddUser, setModalAddUser] = useState(false);
  const [filter, setFilter] = useState({
    classId: id,
    keyword: "",
    searchCourse: "",
    pageIndex: 1,
    pageSize: 10,
    langkey: langKey,
  });
  const handleAddUser = async () => {
    setLoadingAddUser(true);
    if (!userId) {
      Notify.error(t("User cannot empty"));
    } else {
      const res = await LearnClassesService.addMember({
        classId: parseInt(id.toString()),
        userId: userId,
      });
      if (res?.data?.success) {
        Notify.success(t("Add successfully!"));
        fetch();
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
      setModalAddUser(false);
    }
    setLoadingAddUser(false);
  };
  const handleDeleteMember = async (userIdDelete: any) => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        const res = await LearnClassesService.deleteMember({
          classId: parseInt(id.toString()),
          userId: userIdDelete,
        });
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          fetch();
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };
  const filterDebounce = useDebounce(filter);
  const fetch = async () => {
    const res = await LearnClassesService.getAllClassMember({ ...filter });
    if (res?.data?.success) {
      setData(res.data.data);
    } else {
      router.push("/403");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [filterDebounce]);

  return (
    <div className="pb-20">
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
                href: `/classmanagement/classdetails/${id}`,
                title: t("Class detail"),
              },
              {
                title: t("List members"),
              },
            ]}
          />
        </Flex>
        <div>
          <div className="flex flex-col md:flex-row justify-between">
            <Text className="text-2xl font-semibold">{t("Student list")}</Text>
            <div className="flex gap-3">
              <Input
                placeholder={t("Search")}
                className="w-[300px]"
                rightSection={<Search color="gray" />}
                onChange={(value) => {
                  setFilter((pre) => ({
                    ...pre,
                    pageIndex: 1,
                    keyword: value.target.value.trim(),
                  }));
                }}
              />
              {data?.isManager && (
                <Button variant="outline" rightIcon={<Plus />} onClick={() => setModalAddUser(true)}>
                  {t("Add User")}
                </Button>
              )}
            </div>
          </div>
          <Card className="mt-5" shadow="sm">
            <div className="overflow-auto">
              <div className="flex justify-between border-b-2 min-w-[685px] py-2">
                <Text className="text-sm text-[#898989] w-[5%] min-w-[30px] text-center">STT</Text>
                <Text className="text-sm text-[#898989] w-[30%] min-w-[250px] text-center">{t("Student name")}</Text>
                <Text className="text-sm text-[#898989] w-[12%] min-w-[75px] text-center">{t("Learning")}</Text>
                <Text className="text-sm text-[#898989] w-[12%] min-w-[75px] text-center">{t("Training")}</Text>
                <Text className="text-sm text-[#898989] w-[12%] min-w-[75px] text-center">{t("Contests")}</Text>
                <Text className="text-sm text-[#898989] w-[12%] min-w-[75px] text-center">{t("Certificates")}</Text>
                <Text className="text-sm text-[#898989] w-[12%] min-w-[75px] text-center">{t("Exp")}</Text>
                {data?.isManager && <Text className="text-sm text-[#898989] w-[5%] min-w-[30px] text-center"></Text>}
              </div>
              {loading ? (
                <div className="flex justify-center pt-16">
                  <Loader />
                </div>
              ) : data?.classMember?.results.length > 0 ? (
                <>
                  {data.classMember.results.map((value, index) => {
                    return (
                      <div className="md:border-b flex justify-between py-3" key={value.id}>
                        <div className="w-[5%] min-w-[30px] flex items-center justify-center">
                          <Text>{(data?.classMember?.currentPage - 1) * 10 + index + 1}</Text>
                        </div>
                        <div className="flex items-center gap-2 w-[30%] min-w-[250px] pl-4">
                          <div className="flex gap-2">
                            <Avatar
                              src={value.avatarUrl}
                              size="xs"
                              userExpLevel={value.userExpLevel}
                              userId={value.userId}
                            />
                            <ExternalLink
                              className="text-[#337ab7] text-ellipsis overflow-hidden w-[100px]"
                              href={`/profile/${value.userId}`}
                            >
                              {value.userName}
                            </ExternalLink>
                          </div>
                          <div className="flex flex-col">
                            {value.role === ClassMemberRole.AssignedClassManager && (
                              <Text className="text-gray-500 text-sm">{t("Class manager")}</Text>
                            )}
                            {value.status === ClassMemberStatus.Inviting && (
                              <Text className="text-[#faa05e] text-sm">{t("Not accepted yet")}</Text>
                            )}
                          </div>
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
                        {data?.isManager && (
                          <div className="w-[5%] min-w-[30px]">
                            <ActionIcon onClick={() => handleDeleteMember(value.userId)}>
                              <X color="#337ab7" size={20} />
                            </ActionIcon>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="flex md:justify-center pt-5 pb-5 md:pb-0 justify-start">
                    <Pagination
                      withEdges
                      value={data?.classMember?.currentPage}
                      total={data?.classMember?.pageCount}
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
            </div>
          </Card>
        </div>

        <div className="py-8 ">
          <div className="flex flex-col md:flex-row justify-between">
            <Text className="text-2xl font-semibold">{t("Courses list")}</Text>
            <Input
              placeholder={t("Search")}
              className="md:w-[500px]"
              rightSection={<Search color="gray" />}
              onChange={(value) => {
                setFilter((pre) => ({
                  ...pre,
                  searchCourse: value.target.value.trim(),
                }));
              }}
            />
          </div>
          <div className="flex pt-5 flex-wrap gap-7">
            {data?.listCourses?.listCoursesInClass?.length > 0 ? (
              data.listCourses.listCoursesInClass.map((value: any) => {
                return (
                  <Card className="md:w-[23%] w-[100%]  flex gap-2 items-center p-0" shadow="sm" key={value.courseId}>
                    <div>
                      <Image width={70} height={70} src={value.thumbnail} fit="fill" />
                    </div>
                    <div>
                      <Link
                        href={`/classmanagement/classcoursedetails?classId=${id}&courseid=${value.courseId}`}
                        className="font-semibold"
                      >
                        <Text lineClamp={1}>{resolveLanguage(value, locale, "multiLang")?.title}</Text>
                      </Link>
                      <div className="flex items-center">
                        <Point size={15} color="gray" />
                        <Text className="text-sm text-gray-500">
                          {value.totalUser} {t("Students")}
                        </Text>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      </Container>
      <Modal
        size={650}
        opened={modalAddUser}
        onClose={() => setModalAddUser(false)}
        title={<Text className="font-semibold uppercase">{t("Add User")}</Text>}
        className="relative"
      >
        <div className="flex md:flex-row flex-col border-t-2 py-12 gap-2">
          <Select
            nothingFound={t("No result found")}
            data={userOptions}
            clearable
            searchable
            onSearchChange={handleSearchUsers}
            onChange={(value) => setUserId(value)}
            placeholder={t("Username")}
          />
          <Button onClick={handleAddUser}>{t("Add User")}</Button>
          <FileInput placeholder={t("Select file")} onChange={(files) => onChangeFiles(files)} />
          <Button className="bg-blue-600">
            <a href="/files/template_add_member_class.xlsx" className="text-white">
              {t("Template")}
            </a>
          </Button>
        </div>
        <LoadingOverlay visible={loadingAddUser} zIndex={1000} />
      </Modal>
    </div>
  );
};

export default AllClassMemeberIndex;
