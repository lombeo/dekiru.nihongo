import { Button } from "@edn/components";
import { Image } from "@mantine/core";
import { useTranslation } from "next-i18next";

1;

const NoActivity = (props: any) => {
  const { t } = useTranslation();
  const { width, height, img, alt, courseId } = props;

  const redirectToCMS = (e: any) => {
    e.preventDefault();
    window.location.href = `/cms/course/${courseId}`;
  };

  return (
    <>
      <div className="pt-10 pb-8">
        <div>
          <span className="flex justify-center">{t("There are some sessions without learning activities.")}</span>
          <span className="flex justify-center">{t("Please create activities for this learn!")}</span>
        </div>
        <div className="flex justify-center pt-5">
          <a href={`/cms/course/${courseId}`} onClick={redirectToCMS}>
            <Button>{t("Back to course")}</Button>
          </a>
        </div>
        <Image
          width={width ? width : "400px"}
          height={height ? height : "330px"}
          // className="rounded overflow-hidden"
          fit="contain"
          src={img ? img : `/images/no-data/NoActivity-min.png`}
          alt={alt ? alt : "nodata"}
          className="flex justify-center mx-auto"
        />
      </div>
    </>
  );
};

export default NoActivity;
