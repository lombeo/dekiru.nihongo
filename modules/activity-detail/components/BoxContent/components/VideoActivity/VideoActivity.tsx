import { Notify } from "@edn/components/Notify/AppNotification";
import { useLocalStorage } from "@mantine/hooks";
import { Container } from "@src/components";
import RawText from "@src/components/RawText/RawText";
import { ACTIVITY_LEARN_STATUS, ACTIVITY_SUB_CHANEL } from "@src/constants/activity/activity.constant";
import { useProfileContext } from "@src/context/Can";
import usePageVisibility from "@src/hooks/usePageVisibility";
import { LearnCourseService } from "@src/services";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useResizeDetector } from "react-resize-detector";

export interface VideoActivityProps {
  data: any;
  onReady?: Function;
  onStart?: Function;
  onEnded?: Function;
  statusContentActivity?: any;
  isExpired: boolean;
}

const SEEKING_ALOW = 5; // minutes

const VideoActivity = (props: VideoActivityProps) => {
  const { t } = useTranslation();

  const { data, onReady, onStart, onEnded, isExpired } = props;

  const url = data.activityData?.videoPathM3U8 ?? data.activityData?.videoPathMp4 ?? data.activityData?.url;

  const [trackLang, setTrackLang] = useState<any>(null);
  const subtitles = data.activityData?.subtitles;
  const [playedSeconds, setPlayedSeconds] = useState<number>(0);
  const player = useRef<any>();
  const [playing, setPlaying] = useState(true);
  const { height, ref } = useResizeDetector();
  const pageHidden = usePageVisibility();
  const [videoProgress, setVideoProgress] = useLocalStorage({
    key: `video-${data.activityData?.activityId}`,
    defaultValue: 0,
  });
  const { profile } = useProfileContext();

  const isInProgress = data.progressActivityStatus === ACTIVITY_LEARN_STATUS.INPROGRESS;
  const isCompleted = data.progressActivityStatus === ACTIVITY_LEARN_STATUS.COMPLETED;

  useEffect(() => {
    if (pageHidden) {
      Notify.warning(t("Video paused because you are lost focus"));
      setPlaying(false);
    }
  }, [pageHidden]);

  useEffect(() => {
    const textTracks = player?.current?.getInternalPlayer()?.textTracks;
    for (let i = 0; textTracks?.length && i < textTracks.length; i++) {
      // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
      if (textTracks[i].language === trackLang) {
        textTracks[i].mode = "showing";
      } else {
        textTracks[i].mode = "hidden";
      }
    }
  }, [trackLang]);

  const onReadyEvent = () => {
    onReady && onReady();
  };
  const onStartEvent = async () => {
    if (isInProgress || isExpired || !profile || !data?.isEnrolled) return;
    const response = await LearnCourseService.markAsComplete({
      status: ACTIVITY_LEARN_STATUS.INPROGRESS,
      activityId: data.activityData?.activityId,
      courseId: data.activityData?.activity?.courseId,
    });
    if (response.data.success) {
      PubSub.publish(ACTIVITY_SUB_CHANEL.MARK_INPROGRESS_ACTIVITY, {
        activityId: data.activityData?.activityId,
      });
    }
    onStart && onStart();
  };

  const onEndedEvent = async () => {
    if (isCompleted || isExpired || !profile || !data?.isEnrolled) return;
    const response = await LearnCourseService.markAsComplete({
      status: ACTIVITY_LEARN_STATUS.COMPLETED,
      activityId: data.activityData?.activityId,
      courseId: data.activityData?.activity?.courseId,
    });
    if (response.data.success) {
      PubSub.publish(ACTIVITY_SUB_CHANEL.MARK_COMPLETE_ACTIVITY, {
        activityId: data.activityData?.activityId,
      });
    }
    onEnded && onEnded();
  };

  const onPlay = () => {
    setPlaying(true);
    if (subtitles) {
      const textTracks = player?.current?.getInternalPlayer()?.textTracks;
      if (!textTracks) return;
      const track = [...textTracks].find((x: any) => {
        return x.mode === "showing";
      });
      if (track) setTrackLang(track.language);
      else {
        const subtitle = subtitles.find((x: any) => {
          return x.default === true;
        });
        if (subtitle) setTrackLang(subtitle.lang);
      }
    }
  };

  const onDuration = (e: number) => {
    if (videoProgress > 0 && videoProgress < e) {
      player.current.seekTo(videoProgress);
    }
  };

  const onProgress = (progress) => {
    setVideoProgress(progress.playedSeconds);
    setPlayedSeconds(parseInt(progress.playedSeconds.toString()));
  };

  const tracks = subtitles?.map((x: any) => {
    const src = LearnCourseService.getVideoSubtitles(data.activityData?.activityId, x.lang);
    return {
      kind: "subtitles",
      src,
      srcLang: x.lang,
      label: x.label,
    };
  });

  player?.current?.getInternalPlayer()?.textTracks?.addEventListener("change", onPlay);

  const description = data.activityData?.description;

  return (
    <div>
      <div className="bg-[#2D2E31]">
        <Container>
          <div
            id="video-wrapper"
            ref={ref}
            className="aspect-video lg:max-h-[calc(100vh_-_160px)] mx-auto"
            style={{ aspectRatio: "16/9" }}
          >
            <ReactPlayer
              url={url}
              controls
              ref={player}
              onProgress={onProgress}
              onDuration={onDuration}
              onPlay={onPlay}
              playing={playing}
              onReady={onReadyEvent}
              onStart={onStartEvent}
              onEnded={onEndedEvent}
              width="100%"
              height="100%"
              //getCurrentTime={(value: any) => console.log('value >> ', value)}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload",
                    crossOrigin: "true",
                  },
                  tracks: tracks ?? [],
                },
              }}
              onContextMenu={(e: any) => e.preventDefault()}
              onSeek={(e) => {
                const delta = e - playedSeconds;
                //console.log(delta)
                if (delta > SEEKING_ALOW * 100) {
                  //console.log(e, playedSeconds, delta)
                  player.current.seekTo(playedSeconds);
                }
              }}
            />
          </div>
        </Container>
      </div>
      <Container>
        <RawText content={description} className="my-6 break-words" />
      </Container>
    </div>
  );
};

export default VideoActivity;
