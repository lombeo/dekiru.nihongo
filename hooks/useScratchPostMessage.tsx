const useScratchPostMessage = (iframeId: string) => {
  return (message: string, payload?: any) => {
    const iframe = document.getElementById(iframeId) as any;
    if (!iframe) return;
    iframe.contentWindow.postMessage({ type: "codelearn", message, payload }, "*");
  };
};

export default useScratchPostMessage;

export enum SCRATCH_POST_MESSAGE {
  "load-project" = "load-project",
  "save-project" = "save-project",
  "run" = "run",
  "stop" = "stop",
  "full-screen" = "full-screen",
  "set-show-btn-full-screen" = "set-show-btn-full-screen",
  "change-language" = "change-language"
}

export enum SCRATCH_RECEIVE_MESSAGE {
  "init-success" = "init-success",
  "vm-status" = "vm-status",
  "save-project-response" = "save-project-response",
}
