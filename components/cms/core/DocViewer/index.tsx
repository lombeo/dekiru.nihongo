import Icon from "@edn/font-icons/icon";
import { ActionIcon, LoadingOverlay, Modal } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { IframeGoogleDoc } from "./IframeGoogleDoc";

const getPreviewEmbeddedUrl = (url: any) => "https://docs.google.com/gview?url=" + url + "&embedded=true";

export const DocPreview = (props: any) => {
  const { url, dataName, onClose, opened } = props;
  const iframeRef = useRef<any>(null);
  const interval = useRef<any>();
  const [onLoading, setOnLoading] = useState(true);

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
    }, 3000);

    return clearCheckingInterval;
  }, []);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{dataName}</div>
          <a rel="noreferrer" href={url} target="_blank" className="">
            <ActionIcon size="md">
              <Icon name="arrow_download" />
            </ActionIcon>
          </a>
        </div>
      }
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
          padding: "0px",
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
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* <iframe
            src={getPreviewEmbeddedUrl(url)}
            ref={iframeRef}
            onLoad={onIframeLoaded}
            style={{ width: "100%", height: "98%" }}
            onError={updateIframeSrc}
            // frameborder="0"
          ></iframe> */}
        <IframeGoogleDoc url={url} />
      </div>
    </Modal>
  );
};
