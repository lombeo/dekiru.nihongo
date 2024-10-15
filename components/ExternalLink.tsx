import React from "react";
import clsx from "clsx";

const ExternalLink = (props: any) => {
  return <a {...props} className={clsx("hover:opacity-80", props.className)} href={props.href} />;
};

export default ExternalLink;
