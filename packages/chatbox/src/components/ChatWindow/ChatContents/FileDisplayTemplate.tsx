import Icon from "@edn/font-icons/icon";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";

/**
 *
 * @param props
 * @returns display list files in chat
 */
const FileDisplayTemplate = (props: any) => {
  const { files } = props;

  return (
    <div className="flex flex-col gap-2">
      {files &&
        files.length > 0 &&
        files.map((fileData: any) => {
          if (FunctionBase.isJsonString(fileData)) {
            fileData = JSON.parse(fileData);
          }
          const isBlank = !!fileData.name && fileData.name.match(".pdf") != null;
          return (
            <div
              key={fileData.url}
              className={`message-file ${fileData.type}-attachment flex py-2`}
              data-content={`'${JSON.stringify(fileData)}'`}
            >
              {fileData.type == "image" ? (
                <a className="block w-[200px] max-w-[200px]" href={fileData.url} target="_blank" rel="noreferrer">
                  <img
                    className="max-h-[400px] max-w-[200px] overflow-hidden object-contain"
                    src={fileData.url}
                    alt={fileData.name}
                  />
                </a>
              ) : (
                <></>
              )}
              {fileData.type == "video" ? (
                <video className="max-h-[400px] max-w-[200px] max-w-full overflow-hidden" controls>
                  <source src={fileData.url} type="video/mp4" />
                </video>
              ) : (
                <></>
              )}
              {fileData.type == "file" ? (
                <a
                  className="flex gap-2 hover:text-blue-pressed text-inherit"
                  href={fileData.url}
                  target={isBlank ? "_blank" : "_self"}
                  download
                  rel="noreferrer"
                >
                  <span className="text-gray flex items-start">
                    <Icon size={40} name="description" />
                  </span>
                  <div style={{ wordBreak: "break-word" }} className="text-inherit text-sm overflow-hidden text-left">
                    {fileData.name}
                  </div>
                </a>
              ) : (
                <></>
              )}
            </div>
          );
        })}
    </div>
  );
};
export default FileDisplayTemplate;
