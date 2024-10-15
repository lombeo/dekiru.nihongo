import { Divider } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { useLocalStorage } from "@mantine/hooks";
import RawText from "@src/components/RawText/RawText";
import { ACTIVITY_LEARN_STATUS, ACTIVITY_SUB_CHANEL } from "@src/constants/activity/activity.constant";
import { CourseUserRole } from "@src/constants/courses/courses.constant";
import UserRole from "@src/constants/roles";
import { useProfileContext } from "@src/context/Can";
import { resolveLanguage, useHasAnyRole } from "@src/helpers/helper";
import usePageVisibility from "@src/hooks/usePageVisibility";
import { useRouter } from "@src/hooks/useRouter";
import ActivitiesLikeShare from "@src/modules/activities/components/ActivityTools/ActivitiesLikeShare";
import { LearnCourseService } from "@src/services";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useResizeDetector } from "react-resize-detector";
import ModalCompleteActivity from "../ActivityHeader/ModalCompleteActivity";
import TranscriptVideoBar from "./TranscriptVideoBar";

export interface VideoActivityProps {
  data: any;
  permalink: any;
  onReady?: Function;
  onStart?: Function;
  onEnded?: Function;
  statusContentActivity?: any;
  isExpired: boolean;
}

const SEEKING_ALOW = 5; // minutes

const VideoActivity = (props: VideoActivityProps) => {
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const { data, permalink, onReady, onStart, onEnded, isExpired } = props;
  const [trackLang, setTrackLang] = useState<any>(null);
  const subtitles = data.activityData?.subtitles;
  const [playedSeconds, setPlayedSeconds] = useState<number>(0);
  const player = useRef<any>();
  const [playing, setPlaying] = useState(true);
  const { height, ref } = useResizeDetector();
  const [enableTranscript, setEnableTranscript] = useState(router.query.transcript == "true");
  const pageHidden = usePageVisibility();
  const [videoProgress, setVideoProgress] = useLocalStorage({
    key: `video-${data.activityData?.activityId}`,
    defaultValue: 0,
  });
  const activityId = data.activityData?.activityId;
  const { profile } = useProfileContext();

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const isOwner = profile && data && profile.userId === data.courseOwner?.userId;

  const isManager =
    isOwner ||
    isManagerContent ||
    (profile &&
      data &&
      data?.courseUsers &&
      data.courseUsers.some((e) => e.userId == profile.userId && e.role === CourseUserRole.CourseManager));

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
    } else {
      // switch (data.data.message) {
      //   case "Learn_309":
      //     confirmAction({
      //       message: t("The course has expired"),
      //       title: t("Notice"),
      //       labelConfirm: t("Ok"),
      //       allowCancel: false,
      //
      //       withCloseButton: false,
      //     });
      //     break;
      //   default:
      //     break;
      // }
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

  const videoRender = () => {
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

    //console.log('playing', playing)

    return (
      <>
        <ReactPlayer
          url={data.activityData?.videoPathM3U8 ?? data.activityData?.videoPathMp4 ?? data.activityData?.url}
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
      </>
    );
  };

  const onEnableTranscriptChange = (value: boolean) => {
    let param = router.asPath.split("?")[0];
    if (value) {
      param += "?transcript=true";
    }
    router.push(param);
    setEnableTranscript(value);
  };

  const onSeek = (secons: any) => {
    player?.current?.seekTo(secons);
    setPlayedSeconds(parseInt(secons));
  };

  const description = resolveLanguage(data.activityData, locale)?.description || data.activityData?.description;

  return (
    <>
      <ModalCompleteActivity data={data} permalink={permalink} courseId={data.courseId} />
      <div className="px-5">
        <div className={`py-3 grid gap-4 ${enableTranscript ? "md:grid-cols-3" : "md:grid-cols-1"}`}>
          <div id="video-wrapper" ref={ref} className="md:col-span-2 aspect-video" style={{ aspectRatio: "16/9" }}>
            {videoRender()}
          </div>
          {enableTranscript && (
            <div style={{ height }}>
              <TranscriptVideoBar
                subtitles={subtitles}
                defaultLanguage={trackLang}
                getLanguageSelected={(value: string) => setTrackLang(value)}
                playedSeconds={playedSeconds}
                onSeek={onSeek}
              />
            </div>
          )}
        </div>
        {/* <ActivitiesSaveComment>
          <Chip defaultChecked={false} checked={enableTranscript} onChange={onEnableTranscriptChange} variant="filled">
            {t("Transcript")}
          </Chip>
        </ActivitiesSaveComment> */}
      </div>
      <Divider className="mt-2" />
      <div className="py-8 px-5">
        <RawText content={description} className="break-words" />
      </div>
      <Divider className="pb-4" />
      <ActivitiesLikeShare
        title={data.activityData?.activity?.title}
        activityId={activityId}
        isManager={data.isAdminContext}
      />
    </>
  );
};

export default VideoActivity;
