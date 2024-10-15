import React, { useEffect, useRef, useState, useCallback } from 'react';

type IframeGoogleDocsProps = {
  url: string,
};

export function IframeGoogleDoc({ url }: IframeGoogleDocsProps) {

  const [iframeTimeoutId, setIframeTimeoutId] = useState<any>();
  const iframeRef: any = useRef(null);

  const getIframeLink  = useCallback(() => {
    return `https://docs.google.com/gview?url=${url}&embedded=true`;
  },[url])

  const updateIframeSrc = useCallback(() =>  {
    if (iframeRef.current) {
    iframeRef!.current!.src = getIframeLink();
  }}, [getIframeLink])


  useEffect(() => {
    const intervalId = setInterval(
      updateIframeSrc, 1000 * 3
    );
    setIframeTimeoutId(intervalId)
  }, [updateIframeSrc])

  function iframeLoaded() {
    clearInterval(iframeTimeoutId);
  }
 

return (
  <iframe
    onLoad={iframeLoaded}
    onError={updateIframeSrc}
    ref={iframeRef}
    style={{ width: "100%", height: "98%" }}
    src={getIframeLink()}
  />
);
}