import { Button } from "@edn/components";
import { Image } from "@mantine/core";
import { useTranslation } from "next-i18next";

const NoSection = (props: any) => {
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
          <span className="flex justify-center">{t("No learning section here.")}</span>
          <span className="flex justify-center">{t("Please create a new learning section for this learn.")}</span>
        </div>
        <div className="flex justify-center pt-6">
          <a href={`/cms/course/${courseId}`} onClick={redirectToCMS}>
            <Button>{t("Back to course")}</Button>
          </a>
        </div>
        <Image
          width={width ? width : "400px"}
          height={height ? height : "330px"}
          // className="rounded overflow-hidden"
          fit="contain"
          src={img ? img : `/images/no-data/NoSchedule-min.png`}
          alt={alt ? alt : "nodata"}
          className="flex justify-center pt-16 mx-auto"
        />
      </div>
    </>
  );
};

export default NoSection;
