import { Button } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { Flex, Grid, Image } from "@mantine/core";
import Link from "components/Link";
import { useTranslation } from "next-i18next";

const NoDataGrid = (props) => {
  const { img, alt, width, height, hrefAll, noTitle, des } = props;
  const { t } = useTranslation();
  return (
    <>
      <Flex className="pt-12 pb-12" justify="center" align="center">
        <Grid>
          <Image
            width={width ? width : "80%"}
            height={height ? height : "auto"}
            className="mx-auto"
            classNames={{
              image: "mt-0 mx-auto mb-4",
            }}
            fit="cover"
            // src={img ? img : `/images/no-data/NodataGrid-min.png`}
            src={img ? img : `/images/no-data/box-no-data-min.png`}
            alt={alt ? alt : "nodata"}
          />
          {noTitle && (
            <>
              <Flex justify="center">
                <span>
                  <span className="font-semibold mr-1">{t(noTitle)}</span>
                  {des && t(des)}
                </span>
              </Flex>
            </>
          )}
          <Flex justify="center" className="p-4">
            {hrefAll && (
              <Link href={hrefAll}>
                <Button className="items-center" leftIcon={<Icon name="book"></Icon>}>
                  <span>{t("See all")}</span>
                </Button>
              </Link>
            )}
          </Flex>
        </Grid>
      </Flex>
    </>
  );
};
export default NoDataGrid;
