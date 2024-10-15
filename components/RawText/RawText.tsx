import { TextLineCamp } from "@edn/components/TextLineCamp";
import { CDN_URL } from "@src/config";
import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";
import { isNil } from "lodash";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-css";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-tomorrow.css";
import { HTMLAttributes, useEffect } from "react";
import styles from "./RawText.module.scss";

interface RawTextProps extends HTMLAttributes<HTMLDivElement> {
  content?: string;
  line?: number;
  configs?: any;
}
const RawText = (props: RawTextProps) => {
  const {
    className = "",
    line,
    content,
    children,
    configs = {
      ADD_TAGS: ["iframe", "video", "source"],
    },
    ...rest
  } = props;
  DOMPurify.addHook("afterSanitizeAttributes", function (node) {
    if ("target" in node) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener");
      let href = node.getAttribute("href");
      if (href && !href.startsWith("http")) {
        href = window.location.origin + href;
        node.setAttribute("href", href);
      }
    }
    if ("src" in node) {
      let href = node.getAttribute("src");
      if (href && !href.startsWith("http") && !href.startsWith("data")) {
        href = CDN_URL + href;
        node.setAttribute("src", href);
      }
    }
  });
  const html = DOMPurify.sanitize(content?.replace(/\bwhite-space: pre\b/g, "") || (children as any), configs) as any;

  useEffect(() => {
    Prism.highlightAll();
  }, [html]);

  if (!isNil(line)) {
    return (
      <TextLineCamp line={line}>
        <div {...rest} className={clsx(className, styles.root)} dangerouslySetInnerHTML={{ __html: html }} />
      </TextLineCamp>
    );
  }

  return <div {...rest} className={clsx(className, styles.root)} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default RawText;
