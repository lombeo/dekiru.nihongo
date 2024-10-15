import { OverlayLoading, Visible } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Button, CopyButton, Progress, Tooltip } from "@mantine/core";
import CertificateImage from "@src/components/Certificate/CertificateImage";
import { useProfileContext } from "@src/context/Can";
import { useRouter } from "@src/hooks/useRouter";
import Link from "components/Link";
import { toPng } from "html-to-image";
import { useTranslation } from "next-i18next";
import { useCallback, useMemo, useState } from "react";
import { Check, Copy, Download, Share } from "tabler-icons-react";
import styles from "./certificate.module.scss";

interface CertificateImageProps {
  courseTitleVN?: any;
  courseTitleEN?: any;
  finishedTime?: any;
  enrolmentUniqueId?: any;
  showButton?: any;
  userNameShare?: any;
  isDone?: boolean;
  progress?: number;
  percentageToComplete?: number;
}

const Certificate = (props: CertificateImageProps) => {
  const {
    courseTitleVN,
    courseTitleEN,
    finishedTime,
    enrolmentUniqueId,
    progress,
    percentageToComplete,
    isDone,
    userNameShare,
  } = props;
  const { profile } = useProfileContext();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const id = useMemo(() => new Date().toString(), []);

  const userName = userNameShare ? userNameShare : profile?.displayName || profile?.userName;

  const onButtonClickDownload = useCallback(() => {
    const imgCertificate = document.getElementById(id);

    setLoading(true);
    if (!imgCertificate) {
      return;
    }

    toPng(imgCertificate, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${courseTitleVN.toString()}.png`;
        link.href = dataUrl;
        link.click();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [courseTitleVN]);

  const pathShare = `/share/${enrolmentUniqueId}`;
  const urlShare = `${window.location.origin}${pathShare}`;

  const shareComponent = isDone ? (
    <Link href={pathShare}>
      <Button size="lg" leftIcon={<Share />} className="h-[48px] bg-navy-primary">
        {t("Share")}
      </Button>
    </Link>
  ) : (
    <Button size="lg" leftIcon={<Share />} disabled className="h-[48px]">
      {t("Share")}
    </Button>
  );

  return (
    <div className="flex flex-col">
      <CertificateImage
        finishedTime={finishedTime}
        enrolmentUniqueId={enrolmentUniqueId}
        courseTitleVN={courseTitleVN}
        courseTitleEN={courseTitleEN}
        isDone={isDone}
        id={id}
        userName={window?.location?.pathname?.includes("/share/") ? userName : profile ? userName : t("Learner's name")}
      />
      {!router.pathname.startsWith("/share") && (
        <div className={styles.progress}>
          <Progress striped value={progress} label="" size="lg" radius="sm" />
          <Tooltip
            classNames={{
              tooltip: "text-sm min-w-[30px] font-semibold h-[30px] px-1 text-center bg-[#13C296]",
              arrow: "!bottom-[-2px]",
            }}
            label={Math.ceil(progress)}
            opened
            zIndex={80}
            withArrow
            arrowSize={8}
            radius={30}
          >
            <div className="absolute top-0" style={{ left: `${progress}%` }}></div>
          </Tooltip>
          {percentageToComplete && percentageToComplete < 100 && (
            <div className="required-progress" style={{ width: `${percentageToComplete}%` }} />
          )}
        </div>
      )}
      {isDone && (
        <>
          <div className="flex gap-4 py-5 justify-center">
            {!router.pathname.startsWith("/share") && <>{shareComponent}</>}
            <Button
              leftIcon={<Download />}
              className="h-[48px] bg-navy-primary"
              disabled={!isDone}
              size="lg"
              onClick={onButtonClickDownload}
            >
              {t("Download")}
              <Visible visible={loading}>
                <OverlayLoading size={30} />
              </Visible>
            </Button>
          </div>
          <CopyButton value={urlShare} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="bottom">
                <div
                  onClick={copy}
                  className="cursor-pointer mx-auto border px-4 h-[36px] flex items-center rounded-md bg-[#eee] text-left md:w-3/4"
                >
                  <TextLineCamp>{urlShare}</TextLineCamp>
                  <ActionIcon color="dark">{copied ? <Check size={16} /> : <Copy size={16} />}</ActionIcon>
                </div>
              </Tooltip>
            )}
          </CopyButton>
        </>
      )}
    </div>
  );
};

export default Certificate;
