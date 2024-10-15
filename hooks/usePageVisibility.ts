/*
 * This react hooks tracks page visibility using browser page visibility api.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 *
 * Use: const pageVisibilityStatus = usePageVisibility();
 * Return type: boolean
 */

import { useEffect, useState } from "react";

let hidden, visibilityChange;

export default function usePageVisibility() {
  const [visibilityStatus, setVisibilityStatus] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
      // @ts-ignore
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
      // @ts-ignore
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    function handleVisibilityChange() {
      setVisibilityStatus(document[hidden]);
    }

    document.addEventListener(visibilityChange, handleVisibilityChange);

    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange);
    };
  }, [document]);

  return visibilityStatus;
}
