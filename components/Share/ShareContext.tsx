import React, { useContext, useState } from "react";
import { Share, ShareProps } from "./Share";

export interface ShareContextProps {
  opened?: boolean;
  params?: ShareProps;
  setOpened?: (opened: boolean) => void;
  share?: (params: ShareProps) => void;
}

export const ShareContext = React.createContext<ShareContextProps>({});

export function ShareContextProvider(props: any) {
  const [opened, setOpened] = useState(false);
  const [params, setParams] = useState<ShareProps>();

  const share = (params: ShareProps) => {
    setParams(params);
    setOpened(true);
  };

  return (
    <ShareContext.Provider
      value={{
        opened,
        params,
        share,
        setOpened,
      }}
    >
      {props.children}
      <Share />
    </ShareContext.Provider>
  );
}

export function useShareContext() {
  const { share, setOpened, opened, params } = useContext(ShareContext);
  return { share, setOpened, opened, params };
}
