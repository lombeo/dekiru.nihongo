import React from 'react';
import {Textarea as TextareaMantine, TextareaProps} from '@mantine/core';
function Textarea(props:TextareaProps) {
    return (
        <TextareaMantine{...props}/>
    );
}

export default Textarea;