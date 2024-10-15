import React from 'react';
import {Radio as RadioMantine, RadioProps} from '@mantine/core';

function Radio(props: RadioProps) {
    return (
        <RadioMantine {...props}/>
    );
}

export default Radio;