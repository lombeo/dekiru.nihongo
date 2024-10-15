import CmsService from "@src/services/CmsService/CmsService";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

export const VideoPreview = (props: any) => {
  const { url, subtitles, activityId, getDuration = null } = props;
  const [trackLang, setTrackLang] = useState<any>();

  const player = useRef<any>();

  useEffect(() => {
    const textTracks = player?.current?.getInternalPlayer()?.textTracks;
    for (var i = 0; textTracks?.length && i < textTracks.length; i++) {
      // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
      if (textTracks[i].language === trackLang) {
        textTracks[i].mode = "showing";
      } else {
        textTracks[i].mode = "hidden";
      }
    }
  }, [trackLang]);

  const tracks = subtitles?.map((x: any) => {
    const src = CmsService.getVideoSubtitles(activityId, x?.lang);
    return {
      kind: "subtitles",
      label: x?.label,
      src,
      srcLang: x?.lang,
      mode: trackLang === x?.lang ? "showing" : "hidden",
    };
  });

  const onPlay = () => {
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

  return (
    <div className="w-full h-full flex justify-center" style={{ aspectRatio: "16/9" }}>
      {/* @ts-ignore */}
      <ReactPlayer
        ref={player}
        width="100%"
        height="100%"
        onPlay={onPlay}
        controls
        config={{
          file: {
            attributes: {
              crossOrigin: "anonymous",
            },
            tracks: tracks ?? [],
          },
        }}
        onDuration={(value: any) => getDuration && getDuration(value)}
        url={url}
        playing={false}
        loop
        muted
      />
    </div>
  );
};
