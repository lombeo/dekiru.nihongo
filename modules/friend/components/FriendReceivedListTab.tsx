import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import CodelearnInactive from "@src/components/Svgr/components/CodelearnInactive";
import { useMediaQuery } from "@mantine/hooks";
import FriendItem from "@src/modules/friend/components/FriendItem";
import { Pagination } from "@mantine/core";
import _ from "lodash";

const FriendReceivedListTab = (props: any) => {
  const { data, onUpdated, page, status, onChangePage } = props;
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 73.75rem)");

  const isEmpty = data && data.rowCount <= 0;
  const countEmptySpan = data?.results
    ? data.results.length > 5
      ? 5 - (data.results.length % 5 === 0 ? 5 : data.results.length % 5)
      : 5 - data.results.length
    : 0;

  const handleRefresh = useCallback(
    _.debounce(() => {
      onUpdated();
    }, 800),
    []
  );

  return (
    <div className="py-6">
      {status === "success" && isEmpty ? (
        <div className="text-gray py-6 flex items-center flex-col justify-center">
          <p className="text-base mt-5 mb-0 text-red-500">
            {t("You haven't received a friend request yet, let's make friends to exchange and learn.")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-y-4 gap-x-6 pb-4">
            {data?.results?.map((data: any) => (
              <FriendItem
                data={data}
                key={data.id}
                onUpdated={(userId, relationshipStatus) => {
                  data.status = relationshipStatus;
                  handleRefresh();
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
                  <CodelearnInactive width={70} height={90} />
                </div>
              ))}
          </div>
          {data?.results && (
            <div className="mt-8 pb-8 flex justify-center">
              <Pagination value={page} total={data.pageCount} onChange={onChangePage} withEdges />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FriendReceivedListTab;
