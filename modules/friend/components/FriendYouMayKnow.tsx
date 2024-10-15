import { RelationShipStatusEnum } from "@chatbox/constants";
import { useMediaQuery } from "@mantine/hooks";
import CodelearnInactive from "@src/components/Svgr/components/CodelearnInactive";
import { FriendService } from "@src/services/FriendService/FriendService";
import { selectProfile } from "@src/store/slices/authSlice";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import FriendItem from "./FriendItem";

export interface FriendYouMayKnowRef {
  refetch: () => void;
}

const FriendYouMayKnow = forwardRef<FriendYouMayKnowRef, any>((props, ref) => {
  const { onInvited, onCancelInvite } = props;

  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 73.75rem)");

  const profile = useSelector(selectProfile);

  const [filter, setFilter] = useState({
    exceptUserIds: [],
  });

  useImperativeHandle(ref, () => ({
    refetch: () => {
      setData([]);
      setFilter({
        exceptUserIds: [],
      });
    },
  }));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const res = await FriendService.listSuggestFriend(filter);
    setLoading(false);
    const newData = res?.data?.data || [];
    if (res?.data?.success) {
      setData([...data.filter((old) => !newData.some((e) => e.userId === old.userId)), ...newData]);
    }
  };

  const isEmpty = data && data.length <= 0;
  const countEmptySpan = data
    ? data.length > 5
      ? 5 - (data.length % 5 === 0 ? 5 : data.length % 5)
      : 5 - data.length
    : 0;

  useEffect(() => {
    fetch();
  }, [filter]);

  const handleInvited = useCallback(
    _.debounce(() => {
      onInvited();
    }, 800),
    []
  );

  const handleCancelInvite = useCallback(
    _.debounce(() => {
      onCancelInvite();
    }, 800),
    []
  );

  if (isEmpty) return null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="font-semibold mb-0 text-lg">{t("People you may know")}</div>
      </div>
      <div>
        <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-y-4 gap-x-6">
          {data?.map((data: any) => (
            <FriendItem
              data={data}
              onInvited={(userId) => {
                setData((prev) => {
                  prev.forEach((e) => {
                    if (e.userId === userId) {
                      e.status = RelationShipStatusEnum.Requested;
                      e.ownerId = profile?.userId;
                    }
                  });
                  return [...prev];
                });
                handleInvited();
              }}
              onCancelInvite={(userId) => {
                setData((prev) => {
                  prev.forEach((e) => {
                    if (e.userId === userId) {
                      e.status = RelationShipStatusEnum.None;
                      e.ownerId = profile?.userId;
                    }
                  });
                  return [...prev];
                });
                handleCancelInvite();
              }}
              key={data.id}
            />
          ))}
          {isDesktop &&
            countEmptySpan > 0 &&
            Array.apply(null, Array(countEmptySpan)).map((e, key) => (
              <div
                key={key}
                className="border flex bg-[#FAFAFA] p-4 rounded-lg relative shadow-[0px_2px_2px_0px_rgba(0,0,0,0.10)] items-center justify-center"
              >
                <CodelearnInactive width={70} height={90} />
              </div>
            ))}
        </div>
      </div>
      {/*<div className="mx-auto mt-4 h-[36px]">*/}
      {/*  <Button*/}
      {/*    size="sm"*/}
      {/*    variant="default"*/}
      {/*    loading={loading}*/}
      {/*    onClick={() => setFilter((prev) => ({ ...prev, exceptUserIds: data.map((e) => e.userId) }))}*/}
      {/*  >*/}
      {/*    {t("See more")}*/}
      {/*  </Button>*/}
      {/*</div>*/}
    </div>
  );
});

FriendYouMayKnow.displayName = "FriendYouMayKnow";
export default FriendYouMayKnow;
