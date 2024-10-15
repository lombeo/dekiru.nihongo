import { Switch, TextInput } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect } from "react";

export const InputCQDisplaySetting = (props: any) => {
  const { register, watch, setValue } = props;
  const { t } = useTranslation();
  const isGroupLeaderCommentOnly = watch("settings.isGroupLeaderCommentOnly");
  const isSetNumberOutSiteCommentToView = watch("settings.maxOutSideCommentsToView");
  useEffect(() => {
    if (!isGroupLeaderCommentOnly) {
      setValue("settings.allowOtherGroupMembersToVote", false);
    }
    if (isSetNumberOutSiteCommentToView && isSetNumberOutSiteCommentToView > 0) {
      setValue("settings.enableMaxOutSideCommentsToView", true);
    }
  }, [isGroupLeaderCommentOnly, isSetNumberOutSiteCommentToView]);

  const setAllowOutSideToViewComment = (value: any) => {
    if (value) {
      setValue("settings.enabledFields.isShowTheCommentOfStudentsInOtherGroups", true);
      setValue("settings.isShowTheCommentOfStudentsInOtherGroups", true);
    }
  };
  return (
    <>
      <div className="grid grid-cols-5 items-center">
        <div className="col-span-3">
          <div className="flex flex-col">
            <label className="font-bold">{t(LocaleKeys["Display setting"])}</label>
          </div>
        </div>
        <div className="col-span-1">
          <span>{t(LocaleKeys["Active"])}</span>
        </div>
        <div className="col-span-1">
          <span>{t(LocaleKeys["Default Value"])}</span>
        </div>
      </div>
      <div className="flex flex-col border  rounded divide-y ">
        <div className="grid grid-cols-5 items-center py-3">
          <div className="col-span-3 px-3">
            <div className="flex flex-col">
              <label className="text-sm">{t(LocaleKeys["Hide question contents before being started"])}</label>
            </div>
          </div>
          <div className="col-span-1 flex gap-2">
            <Switch size="md" {...register("settings.enabledFields.isHideContentBeforeStart")} />
          </div>
          <div className="col-span-1 flex gap-2">
            <Switch
              disabled={!watch("settings.enabledFields.isHideContentBeforeStart")}
              size="md"
              {...register("settings.isHideContentBeforeStart")}
            />
          </div>
        </div>

        <div className="grid grid-cols-5 items-center py-3">
          <div className="col-span-3 px-3">
            <div className="flex flex-col">
              <label className="text-sm">{t(LocaleKeys["Displays student's name in comments"])}</label>
            </div>
          </div>
          <div className="col-span-1 flex gap-2">
            <Switch size="md" {...register("settings.enabledFields.isShowUserInfoInComment")} />
          </div>
          <div className="col-span-1 flex gap-2">
            <Switch
              disabled={!watch("settings.enabledFields.isShowUserInfoInComment")}
              size="md"
              {...register("settings.isShowUserInfoInComment")}
            />
          </div>
        </div>

        {/* <div className="grid grid-cols-5 items-center py-3">
          <div className="col-span-3 px-3">
            <label className="text-sm">
              {t(LocaleKeys["Allows inside group to view comments"])}
            </label>
          </div>
          <div className="col-span-1 flex gap-2">
            <Switch
              size="md"
              {...register(
                "settings.enabledFields.allowsInsideGroupToViewComments"
              )}
            />
          </div>
          <div className="col-span-1 flex gap-2">
            <Switch
              size="md"
              disabled={
                !watch(
                  "settings.enabledFields.allowsInsideGroupToViewComments"
                )
              }
              {...register("settings.allowsInsideGroupToViewComments")}
            />
          </div>
        </div> */}

        <div>
          <div className="grid grid-cols-5 items-center py-3">
            <div className="col-span-3 px-3">
              <div className="flex flex-col">
                <label className="text-sm">{t(LocaleKeys["Allows outside group to view comments"])}</label>
              </div>
            </div>
            <div className="col-span-1 flex gap-2">
              <Switch size="md" {...register("settings.enabledFields.isShowTheCommentOfStudentsInOtherGroups")} />
            </div>
            <div className="col-span-1 flex gap-2">
              <Switch
                size="md"
                disabled={!watch("settings.enabledFields.isShowTheCommentOfStudentsInOtherGroups")}
                {...register("settings.isShowTheCommentOfStudentsInOtherGroups")}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 items-center pb-3">
            <div className="col-span-3 px-3">
              <div className="flex flex-col">
                <label
                  className={
                    "text-sm pl-5 " + (!watch("settings.isShowTheCommentOfStudentsInOtherGroups") ? "opacity-70" : "")
                  }
                >
                  {t(LocaleKeys["Set number of outside comments to show to student"])}
                </label>
              </div>
            </div>
            <div className="col-span-1 flex gap-2">
              <Switch
                disabled={!watch("settings.isShowTheCommentOfStudentsInOtherGroups")}
                size="md"
                {...register("settings.enableMaxOutSideCommentsToView")}
              />
            </div>
            <div className="col-span-1 flex gap-2 w-20">
              <TextInput
                size="sm"
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                disabled={
                  !watch("settings.enableMaxOutSideCommentsToView") ||
                  !watch("settings.isShowTheCommentOfStudentsInOtherGroups")
                }
                {...register("settings.maxOutSideCommentsToView")}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 items-center py-3">
          <div className="col-span-3 px-3">
            <div className="flex flex-col">
              <label className="text-sm">{t(LocaleKeys["Must comment to view classmate's comments"])}</label>
            </div>
          </div>
          <div className="col-span-1">
            <div className="col-span-1 flex gap-2">
              <Switch size="md" {...register("settings.enabledFields.allowsInsideGroupToViewComments")} />
            </div>
          </div>
          <div className="col-span-1 flex gap-2">
            <div className="flex gap-3">
              <Switch
                size="md"
                disabled={!watch("settings.enabledFields.allowsInsideGroupToViewComments")}
                {...register("settings.allowsInsideGroupToViewComments")}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-5 items-center py-3">
            <div className="col-span-3 px-3">
              <div className="flex flex-col">
                <label className="text-sm">{t(LocaleKeys["Limit the number of comments a student can post"])}</label>
              </div>
            </div>
            <div className="col-span-1">
              <div className="col-span-1 flex gap-2">
                <Switch size="md" {...register("settings.enabledFields.isStudentCommentLimitation")} />
              </div>
            </div>
            <div className="col-span-1 flex gap-2">
              <div className="flex gap-3">
                <Switch
                  size="md"
                  disabled={!watch("settings.enabledFields.isStudentCommentLimitation")}
                  {...register("settings.isStudentCommentLimitation")}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 items-center pb-3">
            <div className="col-span-3 px-3">
              <div className="flex flex-col">
                <label
                  className={"text-sm pl-5 " + (!watch("settings.isStudentCommentLimitation") ? "opacity-70" : "")}
                >
                  {t(LocaleKeys["Limit the number of comments a student can post"])}
                </label>
              </div>
            </div>
            <div className="col-span-2 flex gap-2 w-20">
              <TextInput
                disabled={!watch("settings.isStudentCommentLimitation")}
                size="sm"
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                {...register("settings.maxNumberOfComment")}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-5 items-center py-3">
            <div className="col-span-3 px-3">
              <div className="flex flex-col">
                <label className="text-sm">{t(LocaleKeys["Allow only group leaders to post comments"])}</label>
              </div>
            </div>
            <div className="col-span-1">
              <div className="col-span-1 flex gap-2">
                <Switch size="md" {...register("settings.enabledFields.isGroupLeaderCommentOnly")} />
              </div>
            </div>
            <div className="col-span-1 flex gap-2">
              <div className="flex gap-3">
                <Switch
                  size="md"
                  onClick={(event) => setAllowOutSideToViewComment(event.currentTarget.checked)}
                  disabled={!watch("settings.enabledFields.isGroupLeaderCommentOnly")}
                  {...register("settings.isGroupLeaderCommentOnly")}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 items-center pb-3">
            <div className="col-span-3 px-3">
              <div className="flex flex-col">
                <label className={"text-sm pl-5 " + (!watch("settings.isGroupLeaderCommentOnly") ? "opacity-70" : "")}>
                  {t(LocaleKeys["Allow other group members to vote"])}
                </label>
              </div>
            </div>
            <div className="col-span-1">
              <div className="col-span-1 flex gap-2">
                <Switch size="md" {...register("settings.enabledFields.allowOtherGroupMembersToVote")} />
              </div>
            </div>
            <div className="col-span-1 flex gap-2">
              <div className="flex gap-3">
                <Switch
                  disabled={!watch("settings.isGroupLeaderCommentOnly")}
                  size="md"
                  {...register("settings.allowOtherGroupMembersToVote")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
