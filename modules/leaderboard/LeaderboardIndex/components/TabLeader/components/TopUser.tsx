import React from "react";
import TopUserCard from "./TopUserCard";

interface TopUser {
  users: any;
}

function TopUser(props: TopUser) {
  const { users } = props;

  return (
    <>
      {users && (
        <div className="flex justify-center gap-2 min-h-[300px] items-end flex-wrap lg:justify-between">
          <TopUserCard user={users[1]} cssCard={"h-[280px]"} cssFooter={"bg-[#a7b1b1]"} />
          <TopUserCard user={users[0]} cssCard={"h-[300px]"} cssFooter={"bg-[#eaa30b]"} />
          <TopUserCard user={users[2]} cssCard={"h-[265px]"} cssFooter={"bg-[#cb8e66]"} />
        </div>
      )}
    </>
  );
}

export default React.memo(TopUser);
