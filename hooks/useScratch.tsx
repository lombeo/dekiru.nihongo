import { setStatus } from "@src/store/slices/scratchSlice";
import _ from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useScratchPostMessage, { SCRATCH_POST_MESSAGE, SCRATCH_RECEIVE_MESSAGE } from "./useScratchPostMessage";

interface useScratchProps {
  saveProjectCb?: (projectData: any) => void;
  idFrame?: string;
}

const useScratch = (props: useScratchProps) => {
  const { saveProjectCb, idFrame = "scratch-iframe" } = props;

  const router = useRouter();

  const dispatch = useDispatch();

  const [initSuccess, setInitSuccess] = useState(false);

  const scratchPostMessage = useScratchPostMessage(idFrame);

  useEffect(() => {
    if (!initSuccess) return;
    scratchPostMessage(SCRATCH_POST_MESSAGE["change-language"], router.locale)
  }, [initSuccess, router.locale]);

  const debounceSetStatus = useCallback(
    _.debounce((status) => {
      dispatch(setStatus(status));
    }, 300),
    []
  );

  const handleMessage = (data: any) => {
    const payload = data.payload;
    switch (data.message) {
      case SCRATCH_RECEIVE_MESSAGE["init-success"]:
        setInitSuccess(true);
        break;
      case SCRATCH_RECEIVE_MESSAGE["vm-status"]:
        dispatch(setStatus(payload));
        break;
      case SCRATCH_RECEIVE_MESSAGE["save-project-response"]:
        saveProjectCb(payload);
        break;
    }
  };

  useEffect(() => {
    const onMessage = (event: any) => {
      if (event.data?.type !== "scratch") {
        return;
      }
      handleMessage(event.data);
    };

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return { initSuccess };
};

export default useScratch;
