import React from 'react';
import {GroupProps, Group as GroupMantine} from "@mantine/core";
function Group(props: GroupProps) {
    return (
        <GroupMantine {...props}/>
    );
}

export default Group;