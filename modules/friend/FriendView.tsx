import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { Tabs, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import FriendInvitesListTab from "@src/modules/friend/components/FriendInvitesListTab";
import FriendList from "@src/modules/friend/components/FriendList";
import FriendReceivedListTab from "@src/modules/friend/components/FriendReceivedListTab";
import FriendYouMayKnow, { FriendYouMayKnowRef } from "@src/modules/friend/components/FriendYouMayKnow";
import SearchingTab from "@src/modules/friend/components/SearchingTab";
import { FriendService } from "@src/services/FriendService/FriendService";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { trim } from "lodash";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";

const FriendView = () => {
  const { t } = useTranslation();

  const [tab, setTab] = useState("Friend");
  const [query, setQuery] = useState("");
  const [pageFriends, setPageFriends] = useState(1);
  const [pageFriendReceived, setPageFriendReceived] = useState(1);
  const [pageFriendInvites, setPageFriendInvites] = useState(1);
  const [dataSearch, setDataSearch] = useState<any>();

  const refFriendYouMayKnow = useRef<FriendYouMayKnowRef>(null);

  const fetchSearch = async () => {
    let _query = trim(query);
    if (_query.length < 2) return null;
    const res = await FriendService.searchUser({
      filter: _query,
    });
    setDataSearch(res.data);
    setTab("Searching");
  };

  const {
    data: dataFriends,
    refetch: refetchFriends,
    status: statusFriends,
  } = useQuery({ queryKey: ["fetchFriends", pageFriends], queryFn: () => fetchFriends() });

  const fetchFriends = async () => {
    try {
      const res = await FriendService.listFriend({
        pageIndex: pageFriends,
        pageSize: 20,
      });
      return res?.data?.data;
    } catch (e) {}
    return null;
  };

  const {
    data: dataFriendInvites,
    refetch: refetchFriendInvites,
    status: statusFriendInvites,
  } = useQuery({ queryKey: ["fetchFriendInvites", pageFriendInvites], queryFn: () => fetchFriendInvites() });

  const fetchFriendInvites = async () => {
    try {
      const res = await FriendService.listFriendInvites({
        pageIndex: 1,
        pageSize: 20,
      });
      return res?.data?.data;
    } catch (e) {}
    return null;
  };

  const {
    data: dataFriendReceived,
    refetch: refetchFriendReceived,
    status: statusFiendReceived,
  } = useQuery({ queryKey: ["fetchFriendReceived", pageFriendReceived], queryFn: () => fetchFriendReceived() });

  const fetchFriendReceived = async () => {
    try {
      const res = await FriendService.listFriendReceived({
        pageIndex: pageFriendReceived,
        pageSize: 20,
      });
      return res?.data?.data;
    } catch (e) {}
    return null;
  };

  const handleChangeTab = (tab: any) => {
    setTab(tab);
    if (tab !== "Searching") {
      setQuery("");
    }
    switch (tab) {
      case "Friend":
        setPageFriends(1);
        pageFriends === 1 && refetchFriends();
        //todo fetch suggest
        break;
      case "Requests":
        setPageFriendReceived(1);
        pageFriendReceived === 1 && refetchFriendReceived();
        break;
      case "Sent":
        setPageFriendInvites(1);
        pageFriendInvites === 1 && refetchFriendInvites();
        break;
      default:
        return;
    }
  };

  const tabs = [
    {
      value: "Friend",
      label: `${t("All Friends")} ${
        dataFriends?.rowCount
          ? `(${dataFriends.rowCount}${dataFriends.maxSetting != 0 ? `/${dataFriends.maxSetting}` : ""})`
          : ""
      }`,
    },
    {
      value: "Requests",
      label: `${t("Friend Requests")} ${dataFriendReceived?.rowCount ? `(${dataFriendReceived.rowCount})` : ""}`,
    },
    {
      value: "Sent",
      label: `${t("Sent Requests")} ${dataFriendInvites?.rowCount ? `(${dataFriendInvites.rowCount})` : ""}`,
    },
  ];

  if (tab === "Searching") {
    tabs.push({ value: "Searching", label: t("Searching") });
  }

  const handleUnfriend = (data: any) => {
    confirmAction({
      message: t("Are you sure you want to unfriend {{name}}?", {
        name: data?.userName,
      }),
      onConfirm: async () => {
        const friendId = data?.userId;
        const res = await FriendService.unFriend({
          userId: friendId,
        });
        if (res.data?.success) {
          Notify.success(t("Unfriend successfully."));
          refetchFriends();
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  return (
    <div>
      <Container>
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("Friends"),
            },
          ]}
        />
        <div className="flex flex-col rounded-md overflow-hidden mb-20 mt-2">
          <div className="flex md:flex-row flex-col gap-4 justify-between">
            <div className="text-2xl font-semibold">{t("Friends")}</div>
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.keyCode == 13) {
                  fetchSearch();
                }
              }}
              autoComplete="off"
              placeholder={t("Search")}
              classNames={{
                root: "md:max-w-[268px] w-full",
                input: "rounded-md bg-white border-[#CCCCCC] boder",
              }}
              icon={<Icon name="search" size={20} className="text-gray" />}
            />
          </div>
          <Tabs
            classNames={{
              root: "mt-5",
              tabLabel: "font-semibold md:text-base text-sm",
              tabsList: "border-none shadow-[inset_0_-2px_#CBCBCD]",
              tab: "md:w-auto w-full bg-white border-b-[#CBCBCD] rounded-t-md border-t border-solid border-r border-l !border-t-[#BDBFEA] !border-l-[#BDBFEA] !border-r-[#BDBFEA] !aria-selected:border-b-[#2C31CF]  aria-selected:hover:bg-[#E3F1FF] aria-selected:bg-[#E3F1FF]",
            }}
            value={tab}
            onTabChange={handleChangeTab}
          >
            <Tabs.List>
              {tabs.map((x: any) => (
                <Tabs.Tab
                  className={clsx("py-2 mb-2 md:mb-0 mr-3", {
                    "!text-primary": x.value == tab,
                  })}
                  key={x.value}
                  value={x.value}
                >
                  {x.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
          <div>
            {tab === "Friend" && statusFriends === "success" && (
              <FriendList
                onChangePage={setPageFriends}
                data={dataFriends}
                page={pageFriends}
                onUnfriend={handleUnfriend}
              />
            )}
            {tab === "Requests" && (
              <FriendReceivedListTab
                onChangePage={setPageFriendReceived}
                data={dataFriendReceived}
                page={pageFriendReceived}
                status={statusFiendReceived}
                onUpdated={() => {
                  refetchFriendReceived();
                  refetchFriends();
                }}
              />
            )}
            {tab === "Sent" && (
              <FriendInvitesListTab
                onChangePage={setPageFriendInvites}
                data={dataFriendInvites}
                page={pageFriendInvites}
                status={statusFriendInvites}
                onUpdated={() => {
                  refetchFriendInvites();
                  refetchFriends();
                  refFriendYouMayKnow.current?.refetch();
                }}
              />
            )}
            {tab === "Searching" && (
              <SearchingTab
                onAdded={() => {
                  refetchFriends();
                  refetchFriendReceived();
                  fetchSearch();
                }}
                onReject={() => {
                  refetchFriendReceived();
                  fetchSearch();
                }}
                onCancelInvite={() => {
                  refetchFriendReceived();
                  refetchFriends();
                  fetchSearch();
                }}
                onUnfriend={() => {
                  refetchFriends();
                  fetchSearch();
                }}
                onInvited={() => {
                  refetchFriendInvites();
                  fetchSearch();
                }}
                data={dataSearch?.data}
              />
            )}
            {dataFriends && (dataFriends.maxSetting == 0 || dataFriends.rowCount < dataFriends.maxSetting) ? (
              <div
                className={clsx({
                  hidden: ["Sent", "Searching"].includes(tab),
                })}
              >
                <FriendYouMayKnow
                  ref={refFriendYouMayKnow}
                  onInvited={() => {
                    refetchFriendInvites();
                  }}
                  onCancelInvite={() => {
                    refetchFriendInvites();
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FriendView;
