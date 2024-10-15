/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/link-passhref */
import { DEFAULT_AVATAR_URL, DEFAULT_FRAME_AVATAR_URL } from "@src/constants/common.constant";
import clsx from "clsx";
import { isNil } from "lodash";
import Link from "../Link";

interface AvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  src: string | null;
  userExpLevel?: any;
  userId?: number;
  className?: string;
}

const Avatar = (props: AvatarProps) => {
  const { className, userId, userExpLevel, src, size = "md" } = props;

  let width = 0;
  if (size === "xs") {
    width = 30;
  } else if (size === "sm") {
    width = 36;
  } else if (size === "md") {
    width = 40;
  } else if (size === "lg") {
    width = 44;
  } else if (size === "xl") {
    width = 52;
  } else if (!isNil(size)) {
    width = size;
  }

  return (
    <Link
      href={`/profile/${userId}`}
      className={clsx({
        "pointer-events-none": !userId,
      })}
    >
      <div
        style={{ marginTop: width / 5 }}
        className={clsx(`relative h-min w-fit cursor-pointer inline-block flex-none`, className)}
      >
        {userExpLevel && (
          <img
            className="absolute z-20 left-1/2 top-[47.5%] -translate-y-1/2 -translate-x-1/2"
            alt="frame-avatar"
            src={userExpLevel.iconUrl || DEFAULT_FRAME_AVATAR_URL}
            width="auto"
            height={(width * 140) / 100}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = DEFAULT_FRAME_AVATAR_URL;
            }}
          />
        )}
        <img
          className="bg-white rounded-full overflow-hidden aspect-square object-cover"
          src={src || userExpLevel?.defaultUserAvatarUrl || DEFAULT_AVATAR_URL}
          alt="avatar"
          width={width}
          height={width}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = userExpLevel?.defaultUserAvatarUrl || DEFAULT_AVATAR_URL;
          }}
        />
      </div>
    </Link>
  );
};

export default Avatar;
