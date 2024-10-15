import React from 'react';
import {DividerProps, Divider as DividerMantine} from "@mantine/core";
function Divider(props: DividerProps) {
    return (
        <DividerMantine {...props}/>
    );
}

export default Divider;