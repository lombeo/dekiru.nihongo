import { Skeleton } from "@edn/components";
import { SaolaBaseProps } from "@edn/types/base";
import React from "react";

interface LineSkeletonProps extends SaolaBaseProps {
  width?: string;
  gap?: number;
  radius?: "sm" | "md" | "xl" | "lg";
  height?: number;
  rowCount?: number;
  circle?: any
}
const LineSkeleton = (props: LineSkeletonProps) => {
  const { radius, height, width, className, rowCount = 1, circle = false } = props;
  return (
    <>
      {[...Array(rowCount)].map((val: any, idx) => (
        <Skeleton
          key={idx}
          height={height}
          mt={6}
          width={width}
          radius={radius}
          className={className}
          circle={circle}
        />
      ))}
    </>
  );
};

export default LineSkeleton;
