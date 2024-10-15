import { Card as CardMantine, CardProps } from '@mantine/core'
import React from 'react'

const Card = (props: CardProps) => {
  return <CardMantine {...props} />
}

Card.Section = CardMantine.Section

export default Card
