import { Breadcrumbs } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ActionIcon, Badge, Button, Flex, Input, Loader, Pagination, Select, Table, Text } from "@mantine/core";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import { NotFound } from "@src/components/Svgr/components";
import UserRole from "@src/constants/roles";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { FriendService } from "@src/services/FriendService/FriendService";
import SharingService from "@src/services/Sharing/SharingService";
import styles from "@src/styles/Table.module.scss";
import { debounce, uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Edit, Plus } from "tabler-icons-react";

const SharingListIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataBlogs, setDataBlogs] = useState({} as any);
  const isManager = useHasAnyRole([UserRole.ReviewBlog, UserRole.ManagerContent]);
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

  const handleExport = async () => {
    const res = await SharingService.exportBlog();
    const data = res?.data?.data;
    if (res?.data?.success && data) {
      Notify.success(t("Export successfully!"));
      let contentType = "application/vnd.ms-excel";
      let excelFile = FunctionBase.b64toBlob(data?.contents, contentType);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelFile);
      link.download = data?.filename;
      link.click();
    } else if (res?.data?.message) {
      Notify.error(t(res?.data?.message));
    }
  };

  const handleSynchrony = async () => {
    const res = await SharingService.synchronySocialNetwork();
    if (res?.data?.success) {
    } else {
      Notify.error(res?.data?.message);
    }
  };

  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 20,
    title: "",
    status: 3,
    tag: "",
  });

  const fetch = async () => {
    const res = await SharingService.manageBlog(filter);
    if (res?.data?.success) {
      setDataBlogs(res.data);
    } else {
      Notify.error(t(res?.data?.message));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [filter.pageIndex]);

  const getStatusBadge = (data: any) => {
    if (data?.isPublish) {
      return (
        <Badge size="md" color="green">
          {t("Published")}
        </Badge>
      );
    } else if (data?.isDraft) {
      return (
        <Badge size="md" color="gray" variant="light">
          {t("Draft")}
        </Badge>
      );
    }
    return (
      <Badge size="md" color="yellow">
        {t("Waiting")}
      </Badge>
    );
  };

  return (
    <div className="pb-20 flex">
      <Container size="xl">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                href: "/sharing",
                title: t("Sharing"),
              },
              {
                title: t("Sharing Management"),
              },
            ]}
          />
        </Flex>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex-grow grid gap-2 lg:grid-cols-[1fr_1fr_1fr_1fr]">
              <Input
                placeholder={t("Title")}
                value={filter.title}
                onChange={(value) => {
                  setFilter((pre) => ({
                    ...pre,
                    title: value.target.value,
                  }));
                }}
              />
              <Select
                nothingFound={t("No result found")}
                data={userOptions}
                clearable
                searchable
                onSearchChange={handleSearchUsers}
                onChange={(value) =>
                  setFilter((pre) => ({
                    ...pre,
                    ownerId: value,
                  }))
                }
                placeholder={t("Author")}
              />

              <Input
                placeholder={t("Tag")}
                value={filter.tag}
                onChange={(value) =>
                  setFilter((pre) => ({
                    ...pre,
                    tag: value.target.value,
                  }))
                }
              />
              <Select
                className="lg:w-[140px]"
                defaultValue="3"
                onChange={(value) => {
                  setFilter((pre) => ({
                    ...pre,
                    pageIndex: 1,
                    status: parseInt(value),
                  }));
                }}
                data={[
                  { value: "0", label: t("Waiting") },
                  { value: "1", label: t("Published") },
                  { value: "2", label: t("Draft") },
                  { value: "3", label: t("Status") },
                ]}
              />
            </div>
            <div className="flex gap-2 lg:flex-none flex-wrap lg:justify-between">
              <Button onClick={() => fetch()}>{t("Filter")}</Button>
              {isManager && (
                <>
                  <Button color="indigo" onClick={handleExport}>
                    {t("Export")}
                  </Button>
                  <Button color="indigo" onClick={handleSynchrony}>
                    {t("Synchrony")}
                  </Button>
                </>
              )}
              <Button
                color="indigo"
                onClick={() => router.push("/sharing/create")}
                leftIcon={<Plus color="white" size={20} />}
              >
                {t("Create")}
              </Button>
            </div>
          </div>
          <div className="overflow-auto">
            <Table className={styles.table} captionSide="bottom" striped withBorder>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t("Author")}</th>
                  <th>{t("Title")}</th>
                  <th className="min-w-[100px] !text-center">{t("Create time")}</th>
                  <th className="min-w-[150px] !text-center">{t("Publish time")}</th>
                  <th className="min-w-[100px] !text-center">{t("Status")}</th>
                  <th className="text-center" />
                </tr>
              </thead>
              <tbody>
                {dataBlogs?.data?.length > 0 &&
                  dataBlogs?.data?.map((value, index) => (
                    <tr key={value.id}>
                      <td className="">{(dataBlogs?.meta?.page - 1) * 20 + (index + 1)}</td>
                      <td className="">
                        <ExternalLink href={`/profile/${value.ownerId}`}>
                          <Text className="text-blue-primary break-words">{value.ownerName}</Text>
                        </ExternalLink>
                      </td>
                      <td className="">
                        <Link
                          href={value.isPublish ? `/sharing/${value.permalink}` : `/sharing/preview/${value.permalink}`}
                        >
                          <Text className="text-blue-primary">{value.title}</Text>
                        </Link>
                      </td>
                      <td className="text-center">{formatDateGMT(value.createdAt, "HH:mm DD/MM/YYYY")}</td>
                      <td className="text-center">
                        {value.publishTime ? formatDateGMT(value.publishTime, "HH:mm DD/MM/YYYY") : "-"}
                      </td>
                      <td className="text-center">{getStatusBadge(value)}</td>
                      <td className="">
                        <div className="flex justify-center">
                          <Link href={`/sharing/edit/${value.id}`}>
                            <ActionIcon size="sm" color="blue">
                              <Edit />
                            </ActionIcon>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {!dataBlogs?.data?.length && (
              <>
                {loading ? (
                  <div className="flex justify-center mt-10">
                    <Loader />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center mb-10 bg-white py-10 mt-10">
                    <NotFound height={199} width={350} />
                    <Text mt="lg" size="lg" fw="bold">
                      {t("No Data Found !")}
                    </Text>
                    <Text fw="bold">{t("Your search did not return any content.")}</Text>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-center py-5">
              <Pagination
                withEdges
                color="blue"
                total={dataBlogs?.meta?.totalPage ?? 0}
                onChange={(pageIndex) => {
                  setFilter((pre) => ({
                    ...pre,
                    pageIndex,
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default SharingListIndex;
