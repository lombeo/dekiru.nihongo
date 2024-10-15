import React from 'react';
import { Anchor as AnchorMantine, AnchorProps } from "@mantine/core";

function Anchor(props: AnchorProps) {
    return (
        <AnchorMantine {...props} />
    );
}

export default Anchor;