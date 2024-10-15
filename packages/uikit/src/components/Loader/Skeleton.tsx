import { Skeleton as SekeletonMantine, SkeletonProps } from '@mantine/core'
import React from 'react'

const Skeleton = (props: SkeletonProps) => {
  return <SekeletonMantine {...props} />
}

interface SkeletonCardProps {
  rowCount?: number
}

export default Skeleton
