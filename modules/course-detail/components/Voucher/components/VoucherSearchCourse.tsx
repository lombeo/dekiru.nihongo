import { Select } from "@edn/components";
import { LearnCourseService } from "@src/services";
import { useTranslation } from "next-i18next";
import { useCallback, useState } from "react";

let selectedValue = [];
const VoucherSearchCourse = (props: any) => {
  const { t } = useTranslation();
  const { handelChangeSearchParent, form, className = "", isRequired = false } = props;
  // const [selected, setSelected] = useState<any>();
  // const [data, setData] = useState<any>([]);
  // const [keyword, setKeyword] = useState<any>("");
  // const [debouncedKeyword] = useDebouncedValue(keyword, 1000);
  // const [isSearching, setIsSearching] = useState(false);
  // const [blur, setBlur] = useState(false)
  // const { t } = useTranslation();
  // const ref = useClickOutside(() => setBlur(true), ['mouseup', 'touchend'])
  // const { register, getValues, setValue, reset, control } = useForm({});

  // useEffect(() => {
  //     if (debouncedKeyword) {
  //         setIsSearching(true);
  //         LearnCourseService.getRecommendCourses({
  //             viewScope: 0,
  //             status: 0,
  //             pageSize: 12,
  //             pageIndex: 1,
  //             textSearch: debouncedKeyword,
  //         }).then((x: any) => {
  //             const response: any = x?.data;
  //             setData(response?.data?.results);
  //             setIsSearching(false);
  //         });
  //     }
  // }, [debouncedKeyword]);

  // const getCourseId = () => {
  //     if (!data) return [];
  //     return data.map((x: any) => {
  //         return {
  //             value: x.id,
  //             label: x?.title.toString(),
  //         };
  //     });
  // };

  // const onSelectAccount = (e: any) => {
  //     console.log("onSelect", e)
  //     const courseInfor = data?.find((x: any) => x.id == e);
  //     console.log("courseInfor-------", courseInfor);

  //     setSelected(courseInfor);

  //     if (courseInfor) {
  //         handelChangeSearchParent(courseInfor?.id);
  //     } else {
  //         handelChangeSearchParent(null);
  //     }
  // };

  // const onRemoveSelect = () => {
  //     setSelected(null);
  //     handelChangeSearchParent(null);
  // };

  // const onKeyWordChange = (keyWordChange: any) => {
  //     console.log("keywordChange", keyWordChange);

  //     setBlur(false)
  //     if (keyWordChange) {
  //         const courseInfor = data?.find((x: any) => x?.title == keyWordChange);
  //         if (
  //             courseInfor?.title !== keyWordChange
  //         ) {
  //             setKeyword(keyWordChange);
  //         }
  //     }
  //     if (!keyWordChange) {
  //         setKeyword('')
  //     }
  // };

  // const classNameSelect = blur ? { dropdown: "hidden" } : { dropdown: "" }
  // return (
  //     <div className={`${className}`} ref={ref}>
  //         <Controller
  //             name={"courseId"}
  //             control={control}
  //             render={({ field }) => {
  //                 return (
  //                     <>
  //                         {!selected && (
  //                             <Select
  //                                 {...field}
  //                                 label={t("Course Name")}
  //                                 placeholder={t("Course Name")}
  //                                 searchable
  //                                 clearable
  //                                 // onSelect={(e) => { console.log(e.target.value()); }}
  //                                 // onChange={onSelectAccount}
  //                                 onSearchChange={onKeyWordChange}
  //                                 disabled={isSearching}
  //                                 nothingFound={t(
  //                                     "You have not entered learn name"
  //                                 )}
  //                                 data={getCourseId()}
  //                                 classNames={classNameSelect}
  //                                 required={isRequired}
  //                                 {...form.getInputProps('courseId')}
  //                             />
  //                         )}
  //                         {selected && (
  //                             <>
  //                                 <SelectCourseItem data={selected} onRemove={onRemoveSelect} />
  //                                 <Divider />
  //                             </>
  //                         )}
  //                     </>
  //                 );
  //             }}
  //         />

  //     </div >
  // );
  const [data, setData] = useState([]);
  const searchCourse = useCallback((keyword = "") => {
    LearnCourseService.getRecommendCourses({
      viewScope: 0,
      status: 0,
      pageSize: 12,
      pageIndex: 1,
      textSearch: keyword,
    }).then((x: any) => {
      const dataFilter = x?.data.data.results;
      if (dataFilter.length > 0) {
        //Update modal data and remove duplicate item by id
        let searchData = dataFilter.map((current: any) => {
          current.label = current.title;
          current.value = current.id;
          selectedValue = selectedValue.filter((item: any) => {
            return item.id !== current.id;
          });
          return current;
        });
        setData([...selectedValue, ...searchData]);
      } else {
        setData(selectedValue);
      }
    });
  }, []);
  let searching: any;
  return (
    <Select
      className="pt-3"
      data={data}
      searchable
      label={t("Course Name")}
      onSearchChange={(val: string) => {
        //Use for handle search and delay 500ms before next key press
        clearTimeout(searching);
        if (val.length > 0) {
          searching = setTimeout(function () {
            searchCourse(val);
          }, 500);
        }
      }}
      clearSearchOnChange={true}
      onChange={(val: any) => {
        //Remove item when user removed selected item.
        selectedValue = selectedValue.filter((item: any) => {
          return val.includes(item.id);
        });
        //Add new item to temp selected value if value is added more
        data.map((item: any) => {
          let exist = selectedValue.findIndex((selectedVal: any) => {
            return selectedVal.id == item.id;
          });
          if (val.includes(item.id) && exist == -1) {
            selectedValue.push(item);
          }
        });
      }}
      placeholder={t("Course Name")}
      maxDropdownHeight={160}
      required={isRequired}
      {...form.getInputProps("courseId")}
    />
  );
};

export default VoucherSearchCourse;
