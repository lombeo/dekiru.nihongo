import { ActionIcon, CopyButton, Modal, TextInput, Tooltip } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton } from "react-share";
import { Check, Copy } from "tabler-icons-react";
import { useShareContext } from "./ShareContext";

export class ShareProps {
  url?: string;
  title?: string;
}

export function Share() {
  const { params, opened, setOpened } = useShareContext();
  const { title, url } = params ?? {};
  const { t } = useTranslation();

  return (
    <Modal size="lg" opened={opened} title={title} onClose={() => setOpened(false)}>
      <div className="flex justify-center pb-4 gap-6">
        <FacebookShareButton url={url}>
            <FacebookIcon size={50} round />
          </FacebookShareButton>
        <LinkedinShareButton url={url}>
          <LinkedinIcon size={50} round />
        </LinkedinShareButton>
        <TwitterShareButton url={url}>
          <TwitterIcon size={50} round />
        </TwitterShareButton>
      </div>
      <div className="relative">
        <TextInput
          classNames={{ input: "pr-12 text-base" }}
          size="lg"
          readOnly
          value={url}
          onFocus={(event) => event.target.select()}
        />
        <CopyButton value={url} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip label={t(copied ? "Copied" : "Copy")} withArrow position="right">
              <ActionIcon
                className="absolute right-2.5 top-1/2 !-translate-y-1/2"
                color={copied ? "teal" : "gray"}
                variant="subtle"
                onClick={copy}
              >
                {copied ? <Check width={24} /> : <Copy width={24} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </div>
    </Modal>
  );
}
