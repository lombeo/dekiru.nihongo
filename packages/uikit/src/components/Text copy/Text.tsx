import { TextProps } from '@mantine/core'
import React from 'react'
import { Text as TextMantine } from '@mantine/core'


const Text = (props: TextProps) => {
  const { weight, size, className, color } = props
  const fontWeight = `font-${weight}`
  return (
    <TextMantine {...props} className={[size, fontWeight, className, color].join(' ')} />
  )
}

export default Text
