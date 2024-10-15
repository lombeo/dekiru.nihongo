import { CloseButton } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectProfile } from "@src/store/slices/authSlice";
import { IdentityService } from "@src/services/IdentityService";
import { setEventProfile, getEventProfile } from "@src/store/slices/eventSlice";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export default function EventRequireUpdateProfileNoti({ onClose }: { onClose: any }) {
  const [isNeedUpdateProfile, setIsNeedUpdateProfile] = useState(null);

  const profile = useSelector(selectProfile);
  const eventProfile = useSelector(getEventProfile);

  const route = useRouter();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  useEffect(() => {
    if (profile) handleGetUserProfileForContest();
  }, [profile]);

  useEffect(() => {
    if (eventProfile) {
      if (eventProfile?.school?.grade === null || !eventProfile?.district?.id || !eventProfile?.school?.id) {
        setIsNeedUpdateProfile(true);
      } else {
        setIsNeedUpdateProfile(false);
      }
    }
  }, [eventProfile]);

  const handleGetUserProfileForContest = async () => {
    const res = await IdentityService.getUserProfileForContest({});
    const data = res?.data?.data;
    if (data) {
      dispatch(setEventProfile(data));
    }
  };

  return (
    <>
      {profile && (
        <>
          <div className="fixed left-[20px] bottom-[20px] z-50">
            {isNeedUpdateProfile !== null && (
              <div
                className={clsx("bg-[#FFEBEB] w-[183px] rounded-md p-[10px] text-sm text-[#F56060] leading-[22px]", {
                  "!w-fit": isNeedUpdateProfile === false,
                })}
              >
                <>
                  {isNeedUpdateProfile ? (
                    <>
                      Vui lòng{" "}
                      <span className="underline cursor-pointer" onClick={() => route.push("/user/information")}>
                        cập nhật hồ sơ
                      </span>{" "}
                      của bạn để xác thực thông tin
                    </>
                  ) : (
                    <>
                      {isNeedUpdateProfile === false && (
                        <span className="underline cursor-pointer" onClick={() => route.push("/user/information")}>
                          {t("Update profile here")}
                        </span>
                      )}
                    </>
                  )}
                </>
              </div>
            )}

            <CloseButton
              size="sm"
              className="w-5 h-5 absolute -top-[10px] -right-[10px] bg-white rounded-full"
              onClick={onClose}
            />
          </div>
        </>
      )}
    </>
  );
}
