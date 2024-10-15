import React from 'react';
import { Stepper as StepperMantine, StepperProps } from '@mantine/core';

function Stepper(props: StepperProps) {
    return (
        <StepperMantine {...props}
        />
    );
}

Stepper.Step = StepperMantine.Step

export default Stepper;