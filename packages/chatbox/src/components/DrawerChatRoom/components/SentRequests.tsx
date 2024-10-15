import React from "react";
import Avatar from "@src/components/Avatar";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import styles from "../ChatRoomList.module.scss";
import { useSelector } from "react-redux";
import { selectInvites } from "@src/store/slices/friendSlice";

const SentRequests = () => {
  const { t } = useTranslation();
  const data = useSelector(selectInvites);

  return (
    <div>
      <span className="font-semibold">{t("Sent Requests")}</span>
      {data?.results?.length <= 0 ? (
        <div className="text-gray text-center py-6">
          <p className="text-lg mt-0">{t("Haven't sent any invitations yet")}</p>
        </div>
      ) : (
        <ul className={`flex flex-col gap-3 none-list overflow-hidden overflow-y-auto mb-6 mt-3`}>
          {data?.results?.map((e: any) => (
            <Item data={e} key={e.id} />
          ))}
        </ul>
      )}
    </div>
  );
};

const Item = (props: any) => {
  const { data } = props;

  return (
    <li className={`${styles["user-item"]}`}>
      <div className={`${styles["wrap-user-item"]}`}>
        <Avatar userExpLevel={data.userExpLevel} src={data.avatarUrl} userId={data.userId} size="md" />
        <div className={styles["wrap-user-info"]}>
          <div className="flex flex-col">
            <h4
              className="m-0 text-md truncate font-normal"
              title={FunctionBase.escapeForTitleAttribute(data.userName)}
            >
              {data.userName}
            </h4>
          </div>
        </div>
      </div>
    </li>
  );
};

export default SentRequests;
