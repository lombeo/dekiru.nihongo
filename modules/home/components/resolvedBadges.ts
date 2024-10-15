import _, { cloneDeep, isNil } from "lodash";

const resolvedBadges = (_badges: any, summary: any) => {
  const badges = cloneDeep(_badges) || [];
  const numberFormat = new Intl.NumberFormat();
  badges.forEach((e) => {
    switch (e.badgeType) {
      case "EasyTraining":
        e.currentPoint = summary.training?.numOfEasySolved || 0;
        break;
      case "MediumTraining":
        e.currentPoint = summary.training?.numOfMediumSolved || 0;
        break;
      case "HardTraining":
        break;
      case "Learning":
        e.currentPoint = summary.course?.totalCompletedCourses || 0;
        break;
      case "JoiningContest":
        e.currentPoint = summary.contest?.totalJoinedContests || 0;
        break;
      case "WritingBlog":
        e.currentPoint = summary.sharing?.totalPublishedBlogs || 0;
        break;
      case "Training":
        e.currentPoint = (summary.training?.numOfEasySolved || 0) + (summary.training?.numOfMediumSolved || 0);
        break;
      case "FirstTimeLoggedIn":
        break;
      case "Top1Contest":
        e.currentPoint = summary.contest?.totalCompletedContestsInTop1 || 0;
        break;
      case "Top3Contest":
        e.currentPoint = summary.contest?.totalCompletedContestsInTop3 || 0;
        break;
      case "Top10Contest":
        e.currentPoint = summary.contest?.totalCompletedContestsInTop10 || 0;
        break;
      case "Top20Contest":
        e.currentPoint = summary.contest?.totalCompletedContestsInTop20 || 0;
        break;
      case "BlogShares":
        e.currentPoint = summary.sharing?.maxBlogShares || 0;
        break;
      case "BlogViews":
        e.currentPoint = summary.sharing?.maxBlogViews || 0;
        break;
    }
    if (e.currentPoint >= e.requiredPoint) {
      e.hasBeenAchieved = true;
    }
    e.progressPercent = (e.currentPoint * 100) / (e.requiredPoint || 1);
    if (e.progressPercent > 100) {
      e.progressPercent = 100;
    }
  });
  return [
    {
      id: 60,
      badgeType: "FirstTimeLoggedIn",
      badgeIconUrl: "/Upload/Badges/first-time-logged-in.png",
      localizedDataByLanguage: {
        en: {
          description: "Logged in the system the first time",
          badgeName: "First time logged-in",
        },
        vn: {
          description: "Đăng nhập hệ thống lần đầu",
          badgeName: "Đăng nhập hệ thống lần đầu",
        },
      },
      currentPoint: 1,
      requiredPoint: 1,
      progressPercent: 100,
      hasBeenAchieved: true,
    },
    ..._.orderBy(
      _.chain(badges)
        .groupBy("badgeType")
        .flatMap((group) => {
          const groupOrdered = _.orderBy(group, "requiredPoint", "desc");
          const indexDone = groupOrdered.findIndex((x) => x.hasBeenAchieved);
          const progressItem = groupOrdered[indexDone - 1];
          const doneItem = groupOrdered[indexDone];
          return [doneItem, progressItem, groupOrdered[group.length - 1]].filter((e) => !isNil(e)).splice(0, 2);
        })
        .compact()
        .value(),
      ["hasBeenAchieved", "badgeType"],
      "desc"
    ).filter((e) => e.badgeType !== "FirstTimeLoggedIn" && e.badgeType !== "HardTraining"),
  ];
};

export default resolvedBadges;
