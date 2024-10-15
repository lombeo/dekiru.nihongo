import Icon from "@edn/font-icons/icon";
import { ActionIcon, LoadingOverlay, Modal } from "@mantine/core";
import { useProfileContext } from "@src/context/Can";
import { useEffect, useRef, useState } from "react";

export const DocPreview = (props: any) => {
  const { url, dataName, onClose, opened } = props;
  const iframeRef = useRef<any>(null);
  const interval = useRef<any>();
  const [onLoading, setOnLoading] = useState(true);
  const { profile } = useProfileContext();

  const getPreviewEmbeddedUrl = (e: any) => "https://docs.google.com/gview?url=" + e + "&embedded=true";

  const clearCheckingInterval = () => {
    clearInterval(interval.current);
  };

  const onIframeLoaded = () => {
    clearCheckingInterval();
    setOnLoading(false);
  };

  useEffect(() => {
    interval.current = setInterval(() => {
      try {
        if (iframeRef.current.contentWindow.document.body.innerHTML === "") {
          iframeRef.current.src = getPreviewEmbeddedUrl(url);
        }
      } catch (e) {
        onIframeLoaded();
      }
    }, 4000);

    return clearCheckingInterval;
  }, []);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{dataName}</div>
          {profile ? (
            <a rel="noreferrer" href={url} target="_blank" className="">
              <ActionIcon size="md">
                <Icon name="download" />
              </ActionIcon>
            </a>
          ) : (
            <ActionIcon size="md" className="cursor-default">
              <Icon name="download" />
            </ActionIcon>
          )}
        </div>
      }
      fullScreen
      styles={() => ({
        inner: {
          padding: "0px",
          display: "block",
        },
        modal: {
          margin: "0px !important",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          borderRadius: "0px",
          display: "flex",
          flexDirection: "column-reverse",
          padding: "0px !important",
        },
        header: {
          padding: "0px 20px",
        },
        body: {
          height: "100%",
        },
        title: {
          width: "100%",
        },
      })}
    >
      {onLoading && <LoadingOverlay visible={onLoading} />}
      <iframe
        src={getPreviewEmbeddedUrl(url)}
        ref={iframeRef}
        onLoad={onIframeLoaded}
        style={{ width: "100%", height: "98%" }}
        // frameborder="0"
      ></iframe>
      {/* <a rel="noreferrer" href={url} target="_blank" className="" style={{ position: "absolute", right: "6%", bottom: "2%" }}>
                <ActionIcon size="md" >
                    <Icon name="download" />
                </ActionIcon>
            </a> */}
    </Modal>
  );
};
