const getHomeWebTourStep = (t, locale) => {
  return [
    {
      selector: "#t1",
      content: t("Here is your level on CodeLearn"),
      position: "right",
    },
    {
      selector: "#t2",
      content: t("Here is the list of your achievements"),
      position: "bottom",
    },
    {
      selector: "#t3",
      content: t("The badges of your achievements during your learning process"),
      position: "bottom",
    },
    {
      selector: "#t4",
      content: t("Refer the courses that match your learning path"),
      position: "bottom",
    },
    {
      selector: "#t5",
      content: t("Visit your in-progress courses here"),
      position: "bottom",
    },
    {
      selector: "#t6",
      content: t("Your completed courses are recorded here"),
      position: "bottom",
    },
    {
      selector: "#t7",
      content: t("Join the coding contest and get the gifts"),
      position: "bottom",
    },
    {
      selector: "#t71",
      content: t("Học hỏi kinh nghiệm và chia sẻ về đời sống lập trình với chuyên mục Chia sẻ"),
      position: "left",
      locale: "vi",
    },
    {
      selector: "#t8",
      content: t("The measurement of your programming skills"),
      position: "right",
    },
    {
      selector: "#t9",
      content: t("Check your daily activities on CodeLearn"),
      position: "left",
    },
  ].filter((item) => {
    return !(item.locale && item.locale !== locale);
  });
};

export default getHomeWebTourStep;
