import React from "react";
import FriendItem from "@src/modules/friend/components/FriendItem";
import CodelearnInactive from "@src/components/Svgr/components/CodelearnInactive";
import { useMediaQuery } from "@mantine/hooks";

const SearchingTab = (props: any) => {
  const { data, onAdded, onReject, onInvited, onCancelInvite, onUnfriend } = props;
  const isDesktop = useMediaQuery("(min-width: 73.75rem)");

  const countEmptySpan = data?.results
    ? data.results.length > 5
      ? 5 - (data.results.length % 5 === 0 ? 5 : data.results.length % 5)
      : 5 - data.results.length
    : 0;

  return (
    <div className="py-6">
      <div className="grid lg:grid-cols-5 gap-y-4 gap-x-6">
        {data?.map((data: any) => (
          <FriendItem
            data={data}
            onAdded={onAdded}
            onInvited={onInvited}
            onReject={onReject}
            onUnfriend={onUnfriend}
            onCancelInvite={onCancelInvite}
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
  );
};

export default SearchingTab;
