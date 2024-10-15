import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Button, clsx, Flex, Loader, ScrollArea, Select, Text } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { OrganizationRoleEnum, StatusMemberEnum } from "@src/constants/organization/organization.constant";
import useDebounce from "@src/hooks/useDebounce";
import { IdentityService } from "@src/services/IdentityService";
import { selectProfile } from "@src/store/slices/authSlice";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import TreeView from "react-accessible-treeview";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash } from "tabler-icons-react";
import MenuContextOrgItem from "./components/MenuContextOrgItem";
import { ModalAddOrganization } from "./components/ModalAddOrganization";
import { ModalAddUsers } from "./components/ModalAddUsers";

const OrganizationIndex = () => {
  const { t } = useTranslation();

  const profile = useSelector(selectProfile);

  const [filter, setFilter] = useState({
    role: 0,
  });
  const filterDebounce = useDebounce(filter);
  const [openModalAddOrganization, setOpenModalAddOrganization] = useState(false);
  const [openModalAddUsers, setOpenModalAddUsers] = useState(false);
  const [idTarget, setIdTarget] = useState<any>();
  const [treeData, setTreeData] = useState<any>([]);
  const [dataDetail, setDataDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCanCreateRoot, setIsCanCreateRoot] = useState(false);

  const refSelectedOrgItem = useRef<any>(null);

  const fetch = async () => {
    const res = await IdentityService.getOrganizationDetail(filter);
    if (res?.data?.success) {
      const data = res?.data?.data;
      setTreeData([
        {
          name: "",
          id: 0,
          children: data?.listSubOrganization?.results?.map((item) => {
            return item.id;
          }),
          parent: null,
        },
        ...data?.listSubOrganization?.results?.map((item) => {
          return {
            metadata: item,
            name: item.name,
            children: [],
            id: item.id,
            parent: item.parentId ?? 0,
            isBranch: true,
          };
        }),
      ]);
      if (data.listSubOrganization.results[0]?.id) {
        setIdTarget(data.listSubOrganization.results[0]?.id ?? 0);
      } else {
        setLoading(false);
      }
    }
  };

  const fetchRoleCreateRoot = async () => {
    const resDataDetail = await IdentityService.checkCreateOrganization();
    if (resDataDetail?.data?.success) {
      // setIsCanCreateRoot(resDataDetail?.data?.data.organization);
      if (resDataDetail?.data?.data) {
        setIsCanCreateRoot(true);
      } else setIsCanCreateRoot(false);
    }
  };

  const fetchDetail = async () => {
    if (!idTarget && idTarget !== 0) return;
    const resDataDetail = await IdentityService.getOrganizationDetail({
      role: filter.role,
      parentId: idTarget,
    });
    if (resDataDetail?.data?.success) {
      setDataDetail(resDataDetail?.data?.data.organization);
    } else {
      setDataDetail(null);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        const res = await IdentityService.removeUserOrganization({
          organizationId: idTarget,
          memberId: userId,
        });
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          fetchDetail();
        } else {
          Notify.error(t(res?.data?.message));
        }
      },
    });
  };

  const handleUpdateRole = async (role: number, userId: number) => {
    confirmAction({
      message: t("Are you sure to change role?"),
      title: t("Notice"),
      labelConfirm: t("Ok"),
      allowCancel: false,
      onConfirm: async () => {
        const res = await IdentityService.organizationUpdateRoleMember({
          role,
          memberId: userId,
          organizationId: dataDetail?.id,
        });
        if (res?.data.success) {
          Notify.success(t("Update successfully!"));
          await new Promise((r) => setTimeout(r, 1000));
          fetchDetail();
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  const handleDeleteOrganization = async (id: any) => {
    if (!id) return;
    confirmAction({
      message: t("Do you sure delete organization?"),
      title: t("Notice"),
      labelConfirm: t("Ok"),
      onConfirm: async () => {
        const res = await IdentityService.deleteOrganization(id);
        if (res?.data.success) {
          setTreeData((pre) => {
            let data = pre.filter((ele) => {
              return !(ele.id === id || ele.parent === id);
            });

            return data.map((pre) => {
              if (pre.children.includes(id)) {
                return {
                  ...pre,
                  metadata: {
                    ...pre.metadata,
                    totalSubOrganization: pre.metadata.totalSubOrganization - 1,
                  },
                  children: pre.children.filter((e) => {
                    return e !== id;
                  }),
                };
              }
              return pre;
            });
          });

          const current = treeData.find((e) => e.id === id);

          setIdTarget(
            (prev) =>
              current?.parent ||
              treeData[treeData.findIndex((ele) => ele.id === id) + 1]?.id ||
              treeData[treeData.findIndex((ele) => ele.id === id) - 1]?.id ||
              0
          );
          Notify.success(t("Delete successfully!"));
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  const handleExitOrganization = async () => {
    confirmAction({
      message: t("Do you want exit organization?"),
      title: t("Notice"),
      labelConfirm: t("Ok"),
      onConfirm: async () => {
        const res = await IdentityService.removeUserOrganization({
          organizationId: idTarget,
          memberId: profile?.userId,
        });
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          await new Promise((r) => setTimeout(r, 1000));
          fetch();
          fetchDetail();
        } else {
          Notify.error(t(res?.data?.message));
        }
      },
    });
  };

  useEffect(() => {
    fetch();
    fetchRoleCreateRoot();
  }, []);

  useEffect(() => {
    fetchDetail();
  }, [idTarget, filterDebounce]);

  const loadedAlertElement = useRef(null);
  const [nodesAlreadyLoaded, setNodesAlreadyLoaded] = useState([]);

  const updateTreeData = (list, id, children) => {
    const data = list.map((node) => {
      if (node.id === id) {
        node.children = children.map((el) => {
          return el.id;
        });
      }
      return node;
    });
    return data.concat(children);
  };
  console.log(treeData);

  const onLoadData = async ({ element }) => {
    if (element.children.length > 0) {
      setIdTarget(element.id);
      return;
    }
    const res = await IdentityService.getOrganizationDetail({
      parentId: element.id,
    });
    if (res?.data?.success) {
      //setDataDetail(res?.data?.data?.organization);
      setIdTarget(res?.data?.data?.organization?.id);
      const elements = res.data?.data?.listSubOrganization?.results?.map((item) => ({
        metadata: item,
        name: item.name,
        children: [],
        id: item.id,
        parent: item.parentId ?? 0,
        isBranch: true,
      }));
      setTreeData((value) => updateTreeData(value, element.id, elements));
    }
  };

  const wrappedOnLoadData = async (props) => {
    const nodeHasNoChildData = props.element.children.length === 0;
    const nodeHasAlreadyBeenLoaded = nodesAlreadyLoaded.find((e) => e.id === props.element.id);

    await onLoadData(props);

    if (nodeHasNoChildData && !nodeHasAlreadyBeenLoaded) {
      const el = loadedAlertElement.current;
      setNodesAlreadyLoaded([...nodesAlreadyLoaded, props.element]);
      el && (el.innerHTML = `${props.element.name} loaded`);
    }
  };

  return (
    <div className="pb-20">
      {openModalAddOrganization && (
        <ModalAddOrganization
          onClose={() => setOpenModalAddOrganization(false)}
          initData={refSelectedOrgItem.current}
          onSuccess={(data) => {
            setIdTarget(data?.id);
            const targetData = refSelectedOrgItem.current;
            if (!targetData?.parentId && !targetData?.isEdit) {
              setTreeData((pre) => {
                pre[0] = {
                  ...pre[0],
                  children: [data?.id, ...(pre[0].children || [])],
                };
                return [
                  pre[0],
                  {
                    metadata: data,
                    name: data?.name,
                    children: [],
                    id: data?.id,
                    parent: 0,
                    isBranch: true,
                  },
                  ...pre.filter((ele) => {
                    return ele.id != 0;
                  }),
                ];
              });
            } else if (targetData?.isEdit) {
              setTreeData((pre) => {
                const indexEdit = pre.findIndex((ele) => ele.id === targetData.id);
                pre[indexEdit] = {
                  ...pre[indexEdit],
                  name: data?.name,
                  metadata: data,
                };
                return pre;
              });
              fetchDetail();
            } else {
              setTreeData((pre) => {
                return [
                  {
                    metadata: data,
                    name: data?.name,
                    children: [],
                    id: data?.id,
                    parent: targetData?.parentId,
                    isBranch: true,
                  },
                  ...pre.map((node) => {
                    if (node.id === targetData?.parentId) {
                      node.children = [data?.id, ...node.children];
                      node.metadata.totalSubOrganization = node.metadata.totalSubOrganization + 1;
                    }
                    return node;
                  }),
                ];
              });
            }
          }}
        />
      )}
      {openModalAddUsers && (
        <ModalAddUsers
          onClose={() => setOpenModalAddUsers(false)}
          fetch={fetchDetail}
          organization={dataDetail}
          organizationId={idTarget}
        />
      )}
      <Container size="xl">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                title: t("Organization"),
              },
            ]}
          />
        </Flex>
        <Text className="text-2xl font-semibold">{t("Organization Management")}</Text>

        <div className="bg-white shadow-md mt-6 p-0">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-[30%] border-r-2">
              <div className="flex gap-4 px-4 border-b-2 justify-between py-5">
                <Text className="font-semibold uppercase">{t("List organization")}</Text>
                {isCanCreateRoot && (
                  <Button
                    onClick={() => {
                      refSelectedOrgItem.current = null;
                      setOpenModalAddOrganization(true);
                    }}
                  >
                    {t("Create")}
                  </Button>
                )}
              </div>
              <div>
                <ScrollArea h={510}>
                  <div className="flex flex-col gap-2">
                    {treeData?.length > 0 && (
                      <TreeView
                        data={treeData}
                        aria-label="Checkbox tree"
                        onLoadData={wrappedOnLoadData}
                        multiSelect
                        propagateSelect
                        togglableSelect
                        propagateSelectUpwards
                        nodeRenderer={({ element, isExpanded, getNodeProps, level, handleExpand }: any) => {
                          return (
                            <div
                              style={{ marginLeft: 30 * (level - 1) }}
                              className={clsx(
                                `cursor-pointer p-3 font-semibold grid grid-cols-[1fr_24px] items-center gap-2 `,
                                idTarget === element.id ? "text-blue-700" : ""
                              )}
                            >
                              <div {...(getNodeProps({ onClick: handleExpand }) as any)}>
                                <div className="items-center grid grid-cols-[28px_1fr] gap-2">
                                  {element.metadata.totalSubOrganization > 0 ? (
                                    <ActionIcon className="text-inherit" radius="xl">
                                      {isExpanded ? <ChevronDown width={16} /> : <ChevronRight width={16} />}
                                    </ActionIcon>
                                  ) : (
                                    <div></div>
                                  )}

                                  <TextLineCamp
                                    className="w-fit"
                                    data-tooltip-id={"global-tooltip"}
                                    data-tooltip-place="top"
                                    data-tooltip-content={element.name}
                                  >
                                    {element.name}
                                  </TextLineCamp>
                                </div>
                              </div>
                              {element?.metadata?.isManager && (
                                <MenuContextOrgItem
                                  isDelete={element.metadata.ownerId === profile?.userId}
                                  onEdit={() => {
                                    refSelectedOrgItem.current = {
                                      ...element?.metadata,
                                      isEdit: true,
                                    };
                                    setOpenModalAddOrganization(true);
                                  }}
                                  onDelete={() => handleDeleteOrganization(element?.id)}
                                />
                              )}
                            </div>
                          );
                        }}
                      />
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="lg:w-[70%] border-t-2 pt-4 mt-4 py-4 lg:border-0 lg:pt-0">
              {loading ? (
                <div className="flex justify-center pt-36">
                  <Loader />
                </div>
              ) : !dataDetail ? (
                <div className="flex justify-center pt-20">
                  <Text className="font-semibold text-lg">{t("You are not join any Organization")}</Text>
                </div>
              ) : (
                <>
                  <div className="border-b-2 h-28 pb-6 px-4 flex  flex-col justify-between item-center">
                    <div className="flex flex-col gap-1">
                      <Text
                        className="text-xl font-semibold text-ellipsis overflow-hidden"
                        data-tooltip-id={"global-tooltip"}
                        data-tooltip-place="left"
                        data-tooltip-content={dataDetail?.name}
                        lineClamp={1}
                      >
                        {dataDetail?.name}
                      </Text>
                      <div className="flex items-center gap-2">
                        <Text className="text-sm">{t("Created by")}:</Text>
                        <Link href={`/profile/${dataDetail?.ownerId}`} className="text-base text-blue-500">
                          {dataDetail.ownerName}
                        </Link>
                      </div>
                    </div>
                    <div className="flex gap-4 justify-between">
                      <div className="flex gap-4">
                        {dataDetail?.isManager && (
                          <>
                            <Button
                              leftIcon={<Plus />}
                              onClick={() => {
                                refSelectedOrgItem.current = {
                                  parentId: idTarget,
                                };
                                setOpenModalAddOrganization(true);
                              }}
                            >
                              {t("Add Sub Organization")}
                            </Button>
                            <Button leftIcon={<Plus />} onClick={() => setOpenModalAddUsers(true)}>
                              {t("Add member")}
                            </Button>
                          </>
                        )}
                        <Select
                          value={_.toString(filter.role)}
                          onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, role: +value }))}
                          data={[
                            {
                              value: "0",
                              label: t("All"),
                            },
                            {
                              value: "1",
                              label: t("Manager"),
                            },
                            {
                              value: "2",
                              label: t("Member"),
                            },
                          ]}
                        />
                      </div>

                      {dataDetail?.isManager && (
                        <div className="flex gap-4">
                          <Button
                            className="p-0 w-[40px]"
                            color="green"
                            onClick={() => {
                              refSelectedOrgItem.current = {
                                ...dataDetail,
                                isEdit: true,
                                parentId: idTarget,
                              };
                              setOpenModalAddOrganization(true);
                            }}
                          >
                            <Pencil color="white" />
                          </Button>
                          {dataDetail.ownerId === profile?.userId && (
                            <Button
                              className="p-0 w-[40px]"
                              color="red"
                              onClick={() => handleDeleteOrganization(idTarget)}
                            >
                              <Trash />
                            </Button>
                          )}
                        </div>
                      )}
                      {dataDetail?.canLeave && (
                        <Button color="red" onClick={handleExitOrganization}>
                          {t("Exit")}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <ScrollArea h={510}>
                      <div className="border-b h-[50px] bg-blue-300">
                        <div className="flex justify-between p-4">
                          <div className="w-[5%]">
                            <Text className="font-semibold">#</Text>
                          </div>
                          <div className="w-[15%]">
                            <Text className="font-semibold">{t("Username")}</Text>
                          </div>
                          <div className="w-[15%]">
                            <Text className="font-semibold">{t("Role")}</Text>
                          </div>
                          <div className="w-[15%]">
                            <Text className="font-semibold">{t("Status")}</Text>
                          </div>
                          <div className="w-[15%]">
                            <Text className="font-semibold">{t("Action")}</Text>
                          </div>
                        </div>
                      </div>
                      {dataDetail?.listMembers?.map((member: any, index: number) => {
                        return (
                          <div key={member.userId} className="border-b">
                            <div className="flex justify-between p-4">
                              <div className="w-[5%]">
                                <Text>{index + 1}</Text>
                              </div>
                              <div className="w-[15%]">
                                <Link href={`/profile/${member.userId}`} className="text-base text-blue-500">
                                  {member.userName}
                                </Link>
                              </div>
                              <div className="w-[15%]">
                                {member.status === StatusMemberEnum.Waiting ||
                                profile?.userId === member.userId ||
                                dataDetail.ownerId !== profile?.userId ? (
                                  <Text>
                                    {member.role === OrganizationRoleEnum.Member ? t("Member") : t("Manager")}
                                  </Text>
                                ) : (
                                  <Select
                                    withinPortal
                                    value={member.role === OrganizationRoleEnum.Member ? "2" : "1"}
                                    data={[
                                      { value: "1", label: t("Manager") },
                                      { value: "2", label: t("Member") },
                                    ]}
                                    allowDeselect={false}
                                    onChange={(value) => handleUpdateRole(+value, member.userId)}
                                  />
                                )}
                              </div>
                              <div className="w-[15%]">
                                <Text>{member.status === StatusMemberEnum.Waiting ? t("Waiting") : t("Accepted")}</Text>
                              </div>
                              <div className="w-[15%]">
                                {((dataDetail?.isManager &&
                                  !member.isOwner &&
                                  profile?.userId != member.userId &&
                                  member.role !== OrganizationRoleEnum.Manager) ||
                                  (dataDetail.ownerId === profile?.userId && !member.isOwner)) && (
                                  <Trash
                                    className="cursor-pointer"
                                    color="red"
                                    onClick={() => handleDeleteUser(member.userId)}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </ScrollArea>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrganizationIndex;
