import { Flex, TextInput } from "@mantine/core";
import { LayoutSwitcher } from "@src/components/LayoutSwitcher";
import React from "react";
import { Search } from "tabler-icons-react";

const CourseFilter = (props) => {
  const { displayType, onChangeDisplayType, onChangeSearch, placeholder, width, size } = props;
  return (
    <>
      <Flex align="center" gap={2}>
        <TextInput
          size={size}
          placeholder={placeholder}
          icon={<Search size={16} />}
          style={{ width: width }}
          classNames={{
            input: "italic",
          }}
          onChange={onChangeSearch}
        />
        <LayoutSwitcher onChange={onChangeDisplayType} value={displayType} />
      </Flex>
    </>
  );
};
export default CourseFilter;
