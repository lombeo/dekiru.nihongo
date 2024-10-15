import { Breadcrumbs, Text } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { Badge, Pagination, Select, Table, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import UserRole from "@src/constants/roles";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { FeedbackService } from "@src/services/FeedbackService";
import { selectProfile } from "@src/store/slices/authSlice";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Feedback = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const profile = useSelector(selectProfile);

  const isManager =
    useHasAnyRole([UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent]) ||
    profile?.userName === "support@codelearn.io";

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
    status: "Open",
    priority: "0",
  });

  const mapToStatusValue = (status: string) => {
    switch (status) {
      case "Open":
        return 0;
      case "Done":
        return 1;
      case "Resolve":
        return 2;
      case "Pending":
        return 3;
      case "Hide":
        return 4;
    }
  };

  const { data, refetch, status } = useQuery({
    queryKey: ["getListFeedback", filter],
    queryFn: async () => {
      try {
        const res = await FeedbackService.getListFeedback({
          ...filter,
          keyword: filter.keyword?.trim(),
          status: filter.status === "0" ? null : filter.status,
          priority: filter.priority === "0" ? null : filter.priority,
        });
        return {
          ...res.data,
          Data: res.data.Data,
        };
      } catch (e) {}
      return null;
    },
  });

  const handleUpdateStatus = (id: any, status: number) => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        const res = await FeedbackService.changeStatusFeedback({ id, status });
        if (res.data?.Success) {
          Notify.success(t("Update successfully!"));
          refetch();
        } else if (res.data?.Message) {
          Notify.error(t(res.data?.Message));
        }
      },
    });
  };

  useEffect(() => {
    const onRefetchFeedback = PubSub.subscribe("REFETCH_FEEDBACK", () => {
      refetch();
    });
    return () => {
      PubSub.unsubscribe(onRefetchFeedback);
    };
  }, []);

  useEffect(() => {
    if (!isManager) {
      router.push("/403");
    }
  }, [isManager]);

  const getPriorityBadge = (status: string) => {
    switch (status) {
      case "Low":
        return (
          <Badge size="md" color="blue">
            {t(status)}
          </Badge>
        );
      case "Medium":
        return (
          <Badge size="md" color="yellow">
            {t(status)}
          </Badge>
        );
      default:
        return (
          <Badge size="md" color="red">
            {t(status)}
          </Badge>
        );
    }
  };

  if (!isManager) return null;

  return (
    <div>
      <Container size="xl">
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("Suggestion list"),
            },
          ]}
        />
        <div className="mb-10">
          <div className="flex flex-wrap lg:flex-row flex-col justify-end gap-4 mb-4">
            <TextInput
              autoComplete="off"
              placeholder={t("Search")}
              classNames={{
                root: "flex-grow lg:w-fit w-full",
              }}
              id="search-keyword"
              onKeyDown={(event: any) => {
                if (event && event.key === "Enter") {
                  setFilter((prev) => ({ ...prev, pageIndex: 1, keyword: event.target.value }));
                }
              }}
              onBlur={(event: any) =>
                setFilter((prev) => ({
                  ...prev,
                  pageIndex: 1,
                  keyword: (document.getElementById("search-keyword") as any)?.value,
                }))
              }
              icon={<Icon name="search" size={20} className="text-gray" />}
            />
            <Select
              data={[
                { label: t("All status"), value: "0" },
                { label: t("Open"), value: "Open" },
                { label: t("Done"), value: "Done" },
                { label: t("Resolve"), value: "Resolve" },
                { label: t("Pending"), value: "Pending" },
                { label: t("Hidden"), value: "Hide" },
              ]}
              className="min-w-[160px]"
              clearable
              placeholder={t("Status")}
              value={filter.status}
              onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, status: value }))}
            />
            <Select
              data={[
                { label: t("All priority"), value: "0" },
                { label: t("Low"), value: "Low" },
                { label: t("Medium"), value: "Medium" },
                { label: t("High"), value: "High" },
              ]}
              className="min-w-[160px]"
              clearable
              placeholder={t("Priority")}
              value={filter.priority}
              onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, priority: value }))}
            />
          </div>

          <div className="overflow-auto">
            <Table className={styles.table} captionSide="bottom" striped withBorder>
              <thead>
                <tr>
                  <th className="!text-center">ID</th>
                  <th>{t("Name")}</th>
                  <th>{t("Phone number")}</th>
                  <th>{t("Content")}</th>
                  <th className="min-w-[128px]">{t("File")}</th>
                  <th className="min-w-[110px]">{t("Priority")}</th>
                  <th className="min-w-[120px]">{t("Status")}</th>
                  <th className="!text-center">{t("Created at")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.Data?.Results?.map((e) => ({ ...e, statusValue: mapToStatusValue(e.Status) })).map(
                  (e: any, index: number) => {
                    return (
                      <tr key={e.Id}>
                        <td className="text-center">{e.Id}</td>
                        <td>
                          {e.OwnerId ? (
                            <Link className="text-blue-primary hover:underline" href={`/profile/${e.OwnerId}`}>
                              <div className="break-words max-w-[250px]">{e.ContactEmail}</div>
                            </Link>
                          ) : (
                            <div className="break-words max-w-[250px]">{e.ContactEmail}</div>
                          )}
                        </td>
                        <td>{e.PhoneNumber}</td>
                        <td>
                          <div className="max-h-[200px] overflow-auto">{e.Content}</div>
                        </td>
                        <td>
                          {e.ListUrlAttachment && (
                            <a
                              href={e.ListUrlAttachment}
                              className="text-blue-primary"
                              download
                              target="_blank"
                              rel="noreferrer"
                            >
                              {t("File")}
                            </a>
                          )}
                        </td>
                        <td>{getPriorityBadge(e.Priority)}</td>
                        <td>
                          <Select
                            className="w-[126px]"
                            classNames={{ input: "pr-6" }}
                            value={_.toString(e.statusValue)}
                            data={[
                              { label: t("Open"), value: "0" },
                              { label: t("Done"), value: "1" },
                              { label: t("Resolve"), value: "2" },
                              { label: t("Pending"), value: "3" },
                              { label: t("Hidden"), value: "4" },
                            ]}
                            onChange={(value) => handleUpdateStatus(e.Id, +value)}
                          />
                        </td>
                        <td className="text-center">{formatDateGMT(e.CreateTime, "HH:mm DD/MM/YYYY")}</td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </Table>
          </div>
          {!!data?.Data?.Results?.length && (
            <div className="mt-8 pb-8 flex justify-center">
              <Pagination
                color="blue"
                withEdges
                value={data?.Data?.CurrentPage}
                total={data?.Data?.PageCount}
                onChange={(page) => {
                  setFilter((prev) => ({
                    ...prev,
                    pageIndex: page,
                  }));
                }}
              />
            </div>
          )}
          {status === "success" && !data?.Data?.Results?.length && (
            <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Feedback;
