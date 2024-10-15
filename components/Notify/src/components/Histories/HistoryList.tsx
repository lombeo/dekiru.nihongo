import { Visible } from "@edn/components";
import HistoryItem from "./HistoryItem";
import HistoryNodata from "./HistoryNodata";

/**
 * Display list notify
 * @param props HistoryListProps: listNotify, isLoading
 * @returns List notify
 */
interface HistoryListProps {
  listNotify?: Array<any>;
  isLoading?: boolean;
  offset?: number;
  className?: string;
}
const HistoryList = (props: HistoryListProps) => {
  const { listNotify, className = "max-h-[calc(80vh_-_95px)]", isLoading, offset } = props;

  return (
    <>
      <Visible visible={listNotify && listNotify.length <= 0}>
        <HistoryNodata />
      </Visible>
      {listNotify && listNotify.length > 0 && (
        <ul className={`${className} overflow-y-auto list-none`}>
          {listNotify &&
            listNotify.map((item: any, index: number) => {
              return (
                <HistoryItem
                  offset={offset}
                  isLoading={isLoading}
                  notifyId={item?.id}
                  notifyItem={item}
                  key={item?.id}
                />
              );
            })}
        </ul>
      )}
    </>
  );
};

export default HistoryList;
