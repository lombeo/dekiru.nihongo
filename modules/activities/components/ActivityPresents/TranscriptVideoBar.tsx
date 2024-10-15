import { Select } from "@edn/components";
import { Divider, ScrollArea } from "@mantine/core";
import RawText from "@src/components/RawText/RawText";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
//@ts-ignore
import { useRouter } from "@src/hooks/useRouter";
import { WebVTTParser } from "webvtt-parser";
interface TranscriptVideoProps {
  subtitles: any;
  defaultLanguage?: string;
  getLanguageSelected?: Function;
  playedSeconds: any;
  onSeek: Function;
}

const TranscriptVideoBar = (props: TranscriptVideoProps) => {
  const parser = new WebVTTParser();
  const { t } = useTranslation();
  const { subtitles, defaultLanguage, getLanguageSelected, playedSeconds, onSeek } = props;
  const [langActive, setLangActive] = useState(defaultLanguage);
  const [transcriptVideo, setTranscriptVideo] = useState<any>();
  const [endTime, setEndTime] = useState(0);
  const router = useRouter();

  console.log(playedSeconds);

  let playSeconds;
  transcriptVideo?.forEach((cur) => {
    if (parseInt(cur?.startTime) <= playedSeconds && parseInt(cur?.endTime) >= playedSeconds) {
      playSeconds = parseInt(cur?.startTime);
    }
  });

  useEffect(() => {
    if (!defaultLanguage) {
      const item = subtitles?.find((x: any) => x?.default);
      onSelectChange(item?.lang);
    }
  }, []);

  useEffect(() => {
    setTranscriptContent(langActive);
  }, [langActive]);

  useEffect(() => {
    if (defaultLanguage) {
      onSelectChange(defaultLanguage);
    }
  }, [defaultLanguage]);

  useEffect(() => {
    let classColor = "bg-yellow-200";
    let element = document.getElementById(`data-start-time-${playSeconds}`);
    if (element) {
      Array.from(document.querySelectorAll(".cur-line")).forEach((el) => el.classList.remove(classColor));
      let end = element?.getAttribute("data-end-time");
      setEndTime(parseInt(end));
      element.classList.add(classColor);
    } else if (playedSeconds > endTime)
      Array.from(document.querySelectorAll(".cur-line")).forEach((el) => el.classList.remove(classColor));
  }, [playedSeconds, langActive, router]);

  const setTranscriptContent = (lang: string) => {
    const cues = getCuesByLanguage(lang);
    if (cues) setTranscriptVideo(cues);
  };

  const onSelectChange = (value: string) => {
    setLangActive(value);
    setTranscriptContent(value);
    getLanguageSelected && getLanguageSelected(value);
  };

  const getCuesByLanguage = (lang: string) => {
    const item = subtitles?.find((x: any) => x?.lang == lang);
    if (item) {
      const tree = parser.parse(item?.text, "metadata");
      return tree?.cues;
    }
    return null;
  };

  const onSeekClick = (value: any, e: any) => {
    // Array.from(document.querySelectorAll('.cur-line')).forEach((el) => el.classList.remove("bg-yellow-200"));
    // e.target.parentNode.parentNode.classList.add("bg-yellow-200")
    onSeek && onSeek(value);
  };

  const transcriptVideoRender = (transcriptVideo: any) => {
    if (transcriptVideo?.length > 0)
      return (
        <ScrollArea scrollbarSize={12}>
          {transcriptVideo?.map((cur: any, idx: any) => {
            //console.log('cur :>> ', cur?.startTime == playedSeconds);
            if (cur?.text && cur?.startTime) {
              return (
                <div
                  onClick={(e) => onSeekClick(cur?.startTime + 0.01, e)}
                  key={idx}
                  id={`data-start-time-${parseInt(cur?.startTime)}`}
                  data-start-time={parseInt(cur?.startTime)}
                  data-end-time={parseInt(cur?.endTime)}
                  className={`cur-line flex items-start gap-8 mb-4 cursor-pointer`}
                >
                  <div className="text-sm text-gray"> {FunctionBase.secondsToHms(cur?.startTime)}</div>
                  <div className="text-sm">
                    <RawText content={cur?.text} className={`whitespace-pre-line`} />
                  </div>
                </div>
              );
            }
          })}
        </ScrollArea>
      );
    else return <div className="text-center text-gray">{t("No transcript")}</div>;
  };

  return (
    <>
      <div className="mb-4 border shadow overflow-hidden bg-white h-full">
        <div className="px-2">
          <div className="rounded-xl flex justify-between items-center">
            <p className="text-sm font-semibold">{t("Transcript")}</p>

            {subtitles && langActive && (
              <>
                <Select
                  data={subtitles?.map((cur: any) => {
                    return { value: cur?.lang, label: t(cur.label) };
                  })}
                  value={langActive}
                  size={"xs"}
                  onChange={onSelectChange}
                  className="w-120"
                />
              </>
            )}
          </div>
        </div>
        <Divider />
        <div className="p-4 overflow-scroll" style={{ height: "calc(100% - 48px)" }}>
          {transcriptVideoRender(transcriptVideo)}
        </div>
      </div>
    </>
  );
};

export default TranscriptVideoBar;
