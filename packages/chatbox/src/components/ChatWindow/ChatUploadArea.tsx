import Icon from "@edn/font-icons/icon";

const ChatUploadArea = (props: any) => {
  const { listFile, onRemoveFile, roomId } = props;
  //Render item
  const renderItem = (item: any, idx: number) => {
    if (item?.type == "video") {
      return (
        <li key={item?.url} title={item?.name} className="h-14 w-14 relative">
          <span
            onClick={() => onRemoveFile(idx)}
            className="absolute z-10 -top-1 -right-1 cursor-pointer rounded-full bg-red-500 inline-flex items-center justify-center text-white"
          >
            <Icon name="close" size={18} />
          </span>
          <div className="text-gray flex items-center justify-left">
            <video style={{ height: "45px", width: "46px", objectFit: "cover" }} src={item?.url}></video>
          </div>
          <p className="text-xs text-ink-primary overflow-hidden overflow-ellipsis whitespace-nowrap">{item?.name}</p>
        </li>
      );
    } else if (item?.type == "image") {
      return (
        <li key={item?.url} title={item?.name} className="h-14 w-14 relative">
          <span
            onClick={() => onRemoveFile(idx)}
            className="absolute z-10 -top-1 -right-1 cursor-pointer rounded-full bg-red-500 inline-flex items-center justify-center text-white"
          >
            <Icon name="close" size={18} />
          </span>
          <div className="text-gray flex items-center justify-left">
            <img style={{ height: "45px", width: "46px", objectFit: "cover" }} src={item?.url} alt={item?.name} />
          </div>
          <p className="text-xs text-ink-primary overflow-hidden overflow-ellipsis whitespace-nowrap">{item?.name}</p>
        </li>
      );
    } else {
      return (
        <li key={item?.url} title={item?.name} className="h-14 w-14 relative">
          <span
            onClick={() => onRemoveFile(idx)}
            className="absolute z-10 -top-1 -right-1 cursor-pointer rounded-full bg-red-500 inline-flex items-center justify-center text-white"
          >
            <Icon name="close" size={18} />
          </span>
          <div className="text-gray flex items-center justify-left">
            <Icon name="description" size={45} />
          </div>
          <p className="text-xs text-ink-primary overflow-hidden overflow-ellipsis whitespace-nowrap">{item?.name}</p>
        </li>
      );
    }
  };

  return (
    <div className={`display-file-upload-section px-1 py-1 ${listFile && listFile.length == 0 ? "hidden" : ""}`}>
      <ul
        id={`list-file-upload-${roomId}`}
        className="flex flex-nowrap gap-1 pt-1 overflow-x-auto"
        style={{ minHeight: "82px" }}
      >
        {listFile &&
          listFile.length > 0 &&
          listFile.map((item: any, idx: number) => {
            return renderItem(item, idx);
          })}
      </ul>
    </div>
  );
};

export default ChatUploadArea;
