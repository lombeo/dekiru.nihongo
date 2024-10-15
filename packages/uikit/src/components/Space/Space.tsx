import React from 'react';
import {Space as SpaceMantine, SpaceProps} from '@mantine/core';

function Space(props: SpaceProps) {
    return (
        <SpaceMantine {...props}/>
    );
}

export default Space;