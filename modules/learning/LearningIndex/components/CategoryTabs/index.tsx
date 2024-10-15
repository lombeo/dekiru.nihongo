import { Menu, Tabs } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import useWindowDimensions from "@src/hooks/useWindowDimensions";
import { ArrowChervonBigDown } from "@src/components/Svgr/components";

type CategoryTabsProps = {
  filter: {
    keyword: string;
    courseState: number;
    courseViewLimit: number;
    pageIndex: number;
    pageSize: number;
    categoryId: string;
  };
  setFilter: Dispatch<
    SetStateAction<{
      keyword: string;
      courseState: number;
      courseViewLimit: number;
      pageIndex: number;
      pageSize: number;
      categoryId: string;
    }>
  >;
  categoryList: any;
};

const CategoryTabs: React.FC<CategoryTabsProps> = ({ filter, setFilter, categoryList }) => {
  const { t } = useTranslation();
  const [visibleCategoryList, setVisibleCategoryList] = useState({});
  const { width, height } = useWindowDimensions();
  const categoryListHasData = categoryList && categoryList.filter((item) => item?.countCourse > 0);

  const isInViewport = (el) => {
    const rect = el?.getBoundingClientRect();
    const categoryListRect = document.getElementsByClassName("category-list")[0].getBoundingClientRect();

    return (
      rect?.top >= 0 &&
      rect?.left >= 0 &&
      rect?.bottom <= (height || document.documentElement.clientHeight) &&
      rect?.right <= categoryListRect.right - 48
    );
  };

  const checkTabsIsInViewport = () => {
    const element = document.getElementsByClassName(`category-item`);

    categoryListHasData?.map((item, index) => {
      const checked = isInViewport(element[index]);
      setVisibleCategoryList((prev) => {
        return { ...prev, [`category-${item?.id}`]: checked };
      });
    });
  };

  useEffect(() => {
    checkTabsIsInViewport();
  }, [categoryList]);

  return (
    <div className="hidden md:block">
      <Tabs
        defaultValue={(status as string) === "all" ? "" : (status as string)}
        value={filter?.categoryId as string}
        onTabChange={(value) => {
          setFilter((prev) => ({ ...prev, categoryId: value === "all" ? "" : value }));
        }}
        className={`category-list ${styles["tab-list"]}`}
        unstyled
      >
        <Tabs.List>
          <Tabs.Tab value="all" className={filter?.categoryId === "" ? styles["active-tab"] : ""}>
            {t("All Courses")}
          </Tabs.Tab>
          {categoryListHasData?.map((item) => (
            <Tabs.Tab
              value={item?.id.toString()}
              key={`category-${item?.id}`}
              className={`category-item ${filter?.categoryId === item?.id.toString() ? styles["active-tab"] : ""} ${
                !visibleCategoryList[`category-${item?.id}`] && "invisible select-none"
              }`}
            >
              {item?.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {Object.values(visibleCategoryList).some((item) => item === false) && (
          <Menu shadow="lg" width={200} position="bottom-end" withinPortal withArrow>
            <Menu.Target>
              <div className="w-12 absolute right-0 top-1/2 -translate-y-1/2 bg-white flex justify-end items-center">
                <button className="flex justify-center items-center">
                  <ArrowChervonBigDown />
                </button>
              </div>
            </Menu.Target>
            <Menu.Dropdown className="max-h-fit">
              {categoryListHasData?.map((item) => (
                <Tabs.Tab
                  value={item?.id.toString()}
                  key={`category-${item?.id}`}
                  className={`category-item ${styles["menu-tab"]} ${
                    filter?.categoryId === item?.id.toString() ? styles["active-tab"] : ""
                  } ${visibleCategoryList[`category-${item?.id}`] && "invisible select-none hidden"}`}
                >
                  {item?.name}
                </Tabs.Tab>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}
      </Tabs>
    </div>
  );
};

export default CategoryTabs;
