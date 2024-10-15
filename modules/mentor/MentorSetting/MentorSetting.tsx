import { Breadcrumbs, Pagination, Text } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { ActionIcon, Badge, Table, TextInput, Tooltip } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import MenuBar from "@src/components/MenuBar/MenuBar";
import { TypeMenuBar } from "@src/config";
import UserRole from "@src/constants/roles";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import useDebounce from "@src/hooks/useDebounce";
import { useMenuBar } from "@src/hooks/useMenuBar";
import { LearnMentorService } from "@src/services/LearnMentor";
import { MentorState } from "@src/services/LearnMentor/types";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { debounce, trim } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Check, Trash } from "tabler-icons-react";

const MentorSetting = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const listItem = useMenuBar(TypeMenuBar.UserManagement);

  const isContentManager = useHasAnyRole([UserRole.SiteOwner, UserRole.ManagerContent]);

  useEffect(() => {
    if (!isContentManager) {
      router.push("/403");
    }
  }, []);

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 20,
    state: null,
    keyword: "",
  });
  const filterDebounce = useDebounce(filter, 500);

  const { data, refetch } = useQuery({
    queryKey: ["searchMentors", filterDebounce],
    queryFn: async () => {
      try {
        const res = await LearnMentorService.searchMentors({
          ...filter,
          keyword: trim(filter.keyword),
        });
        return res.data?.data;
      } catch (e) {}
      return null;
    },
  });

  const getMentorStateBadge = (state: number) => {
    switch (state) {
      case MentorState.Approved:
        return <Badge color="green">{t("Approved")}</Badge>;
      case MentorState.Pending:
        return <Badge color="yellow">{t("Pending")}</Badge>;
      case MentorState.Blocked:
        return <Badge color="red">{t("Blocked")}</Badge>;
      default:
        return null;
    }
  };

  const handleAccept = useCallback(
    debounce(async (id: any) => {
      const res = await LearnMentorService.changeMentorState({
        id: id,
        state: MentorState.Approved,
      });
      if (res.data?.success) {
        Notify.success(t("Accept successfully!"));
        refetch();
      } else if (res.data?.message) {
        Notify.error(t(res.data?.message));
      }
    }, 500),
    []
  );

  const handleReject = (id: any) => {
    confirmAction({
      message: t("Are you sure you want to reject mentor?"),
      onConfirm: async () => {
        const res = await LearnMentorService.deleteMentorRequest(id);
        if (res.data?.success) {
          Notify.success(t("Reject successfully!"));
          refetch();
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  if (!isContentManager) return null;

  return (
    <div className="flex flex-col md:flex-row">
      <div className="px-4">
        <MenuBar title="User management" listItem={listItem} />
      </div>

      <Container size="xl">
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("Mentor management"),
            },
          ]}
        />
        <div className="flex gap-4 my-4">
          <TextInput
            value={filter.keyword}
            onChange={(event) => setFilter((prev) => ({ ...prev, keyword: event.target.value }))}
            autoComplete="off"
            placeholder={t("Search")}
            classNames={{
              root: "flex-grow w-full",
              input: "bg-white rounded-md border border-[#CCC] h-10 text-base",
            }}
            icon={<Icon name="search" size={20} className="text-gray" />}
          />
        </div>

        <div className="mb-10">
          <div className="overflow-auto">
            <Table className={styles.table} captionSide="bottom" striped withBorder>
              <thead>
                <tr>
                  <th className="w-[160px]">{t("Name")}</th>
                  <th className="w-[220px]">{t("Contact")}</th>
                  {/*<th className="w-[500px]">{t("Description")}</th>*/}
                  <th className="w-[220px]">{t("School")}</th>
                  <th className="w-[220px]">{t("Work experience")}</th>
                  <th>{t("Tags")}</th>
                  <th className="!text-center w-[132px]">{t("Updated on")}</th>
                  <th className="w-[140px]">{t("Status")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.results?.map((e: any) => {
                  return (
                    <tr key={e.id}>
                      <td>
                        <Link href={`/profile/${e.userId}`}>{e.userName}</Link>
                      </td>
                      <td>{e.contactInfo}</td>
                      {/*<td>*/}
                      {/*  <RawText className="max-h-[180px] overflow-auto">{e.message}</RawText>*/}
                      {/*</td>*/}
                      <td>{e.schools?.join(", ")}</td>
                      <td>{e.workExperience}</td>
                      <td>
                        {e.tags?.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {e.tags?.map((tag) => (
                              <Badge color="gray" variant="dot" radius="sm" key={tag}>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="text-center">{formatDateGMT(e.modifiedOn, "HH:mm DD/MM/YYYY")}</td>
                      <td>{getMentorStateBadge(e.state)}</td>
                      <td>
                        <div className="flex gap-2 items-center">
                          {e.state === MentorState.Pending && (
                            <Tooltip label={t("Approve")} withArrow>
                              <ActionIcon onClick={() => handleAccept(e.id)} color="green" variant="filled">
                                <Check width={20} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                          <Tooltip label={t("Delete")} withArrow>
                            <ActionIcon onClick={() => handleReject(e.id)} color="red" variant="filled">
                              <Trash width={20} />
                            </ActionIcon>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {data?.results?.length ? (
            <div className="mt-8 pb-8">
              <Pagination
                pageIndex={filter.pageIndex}
                currentPageSize={data.results?.length}
                totalItems={data.rowCount}
                totalPages={data.pageCount}
                label={""}
                pageSize={filter.pageSize}
                onChange={(page) => {
                  setFilter((prev) => ({
                    ...prev,
                    pageIndex: page,
                  }));
                }}
              />
            </div>
          ) : (
            <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
          )}
        </div>
      </Container>
    </div>
  );
};

export default MentorSetting;
