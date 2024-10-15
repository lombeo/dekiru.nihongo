import { List as ListMantine, ListProps } from "@mantine/core";
import React from "react";

const List = (props: ListProps) => {
  return <ListMantine {...props} />;
};

List.Item = ListMantine.Item;
export default List;
