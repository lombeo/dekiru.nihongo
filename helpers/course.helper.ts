import { CourseUserRoleEnum } from "constants/cms/course/course.constant";

export const CourseHelper = {
  getUserCourseRoleByRoleId: (roleId: any) => {
    return null;
  },
  convertUserRoleEnumObject: (obj: any) => {
    let results = [];
    for (const property in obj) {
      if (obj[property]) {
        results.push(CourseUserRoleEnum[property as keyof typeof CourseUserRoleEnum]);
      }
    }
    return results;
  },
  convertUserRoleArrayToObject: (arr: any) => {
    let obj: any = {
      Owner: false,
      Manager: false,
      Member: false,
    };
    const mappingObj = ["Owner", "Manager", "Member"];
    for (let i = 0; i < arr.length; i++) {
      const field = mappingObj[arr[i] - 1];
      obj[field] = true;
    }
    return obj;
  },
  getNewListByCheckboxValue: (
    currentList: any,
    element: any,
    checkBoxValue: any,
    listCompareField: any,
    elementCompareField: any = null
  ) => {
    if (checkBoxValue) {
      return [...currentList, element];
    }

    const elementField: any = elementCompareField ? elementCompareField : listCompareField;
    const index = currentList.findIndex((x: any) => x[listCompareField] == element[elementField]);
    if (index !== -1) {
      let newArr = [...currentList];
      newArr.splice(index, 1);
      return newArr;
    }
    return currentList;
  },
};
