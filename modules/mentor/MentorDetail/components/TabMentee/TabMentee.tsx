import { Pagination, TextOverflow } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Button, CheckIcon, Menu, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { Close } from "@src/components/Svgr/components";
import CodelearnInactive from "@src/components/Svgr/components/CodelearnInactive";
import EmptyChatLarge from "@src/components/Svgr/components/EmptyChatLarge";
import { LearnMentorService } from "@src/services/LearnMentor";
import { MentorState } from "@src/services/LearnMentor/types";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Dots, Trash } from "tabler-icons-react";

interface TabMenteeProps {
  onAddRejectMentee?: () => void;
}

const TabMentee = (props: TabMenteeProps) => {
  const { onAddRejectMentee } = props;
  const [data, setData] = useState<any>(null);
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ pageIndex: 1, pageSize: 10 });

  const isEmpty = data && data.rowCount <= 0;
  const countEmptySpan = data?.results
    ? data.results.length > 2
      ? 2 - (data.results.length % 2 === 0 ? 2 : data.results.length % 2)
      : 2 - data.results.length
    : 0;

  const fetchMentees = async () => {
    const res = await LearnMentorService.getUserMentees(filter);
    setLoading(false);
    if (res?.data?.success) {
      setData(res?.data?.data);
    }
  };

  useEffect(() => {
    fetchMentees();
  }, []);

  return (
    <div className="flex flex-col">
      {!loading && isEmpty ? (
        <div className="text-gray py-6 flex items-center flex-col justify-center">
          <EmptyChatLarge className="max-w-full" width={471} height={366} />
          <p className="text-base mt-5 mb-0">
            {t("You haven't received a friend request yet, let's make friends to exchange and learn.")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4 pb-4">
            {data?.results?.map((data: any) => (
              <MenteeItem
                data={data}
                key={data.id}
                onAdded={() => {
                  fetchMentees();
                  onAddRejectMentee?.();
                }}
                onRejected={() => {
                  fetchMentees();
                  onAddRejectMentee?.();
                }}
              />
            ))}
            {isDesktop &&
              countEmptySpan > 0 &&
              Array.apply(null, Array(countEmptySpan)).map((e, key) => (
                <div
                  key={key}
                  className="border flex bg-[#FAFAFA] p-4 rounded-lg relative shadow-[0px_2px_2px_0px_rgba(0,0,0,0.10)] items-center justify-center"
                >
                  <CodelearnInactive width={57} height={72} />
                </div>
              ))}
          </div>
          {data?.results && (
            <Pagination
              pageIndex={filter.pageIndex}
              currentPageSize={data.results?.length}
              totalItems={data?.rowCount}
              totalPages={data.pageCount}
              label={""}
              pageSize={20}
              onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex: pageIndex }))}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TabMentee;

const MenteeItem = (props: any) => {
  const { data, onAdded, onRejected } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleAccept = async () => {
    setLoading(true);
    const res = await LearnMentorService.updateMenteeState({
      id: data.id,
      state: MentorState.Approved,
    });
    setLoading(false);
    if (res.data?.success) {
      Notify.success(t("Accept successfully!"));
      onAdded();
    } else if (res.data?.message) {
      Notify.error(t(res.data?.message));
    }
  };

  const handleReject = () => {
    confirmAction({
      message: t("Are you sure you want delete mentee?"),
      onConfirm: async () => {
        setLoading(true);
        const res = await LearnMentorService.deleteMentee(data.id);
        if (res.data?.success) {
          Notify.success(t("Delete successfully!"));
          onRejected();
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
        setLoading(false);
      },
    });
  };

  return (
    <div className="border max-w-full flex gap-5 bg-white px-5 py-5 rounded-lg relative shadow-md">
      <Avatar
        className="mt-1"
        userExpLevel={data?.menteeExpLevel?.levelNo}
        src={data?.menteeAvatar}
        userId={data?.menteeId}
        size={60}
      />
      <div className="max-w-full flex flex-col w-full">
        <div className="flex gap-4 justify-between">
          <Link href={`/profile/${data.menteeId}`} className="flex">
            <TextOverflow className=" font-semibold hover:text-primary">{data.menteeUserName}</TextOverflow>
          </Link>
          {data?.state === MentorState.Approved && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon>
                  <Dots />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => handleReject()} icon={<Trash color="red" size={14} />}>
                  {t("Remove mentee")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </div>
        {data?.state === MentorState.Pending && data?.message ? (
          <Tooltip multiline label={data?.message} withArrow>
            <div>
              <TextLineCamp line={1} className="flex text-[#65656D] text-sm gap-5 mb-2">
                {data?.message}
              </TextLineCamp>
            </div>
          </Tooltip>
        ) : null}
        {data?.state === MentorState.Pending && (
          <div className="mt-auto grid grid-cols-2 gap-4 w-full">
            <Tooltip label={t("Accept")} withArrow>
              <Button
                variant="filled"
                className="rounded-lg hover:opacity-60"
                onClick={() => handleAccept()}
                size="sm"
                disabled={loading}
                fullWidth
              >
                <CheckIcon width={20} height={20} color="white" />
              </Button>
            </Tooltip>
            <Tooltip label={t("Delete")} withArrow>
              <Button
                variant="filled"
                className="bg-[#E9EBFB] rounded-lg text-primary hover:bg-[#E9EBFB] hover:opacity-60"
                disabled={loading}
                onClick={() => handleReject()}
                size="sm"
                fullWidth
              >
                <Close width={30} height={30} color="inherit" />
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};
