import { createStylesServer, ServerStyles } from "@mantine/next";
import resolveBasePath from "@src/helpers/path-helper";
import Document, { DocumentContext } from "next/document";

// optional: you can provide your cache as a fist argument in createStylesServer function
const stylesServer = createStylesServer();

export default class _Document extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    // Add your app specific logic here
    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <ServerStyles html={initialProps.html} server={stylesServer} key="styles" />,
        <link href={resolveBasePath("/fonts/muli.css")} rel="stylesheet" key="styles" />,
        <link href={resolveBasePath("/fonts/cherish.css")} rel="stylesheet" key="jakarta-styles" />,
        <link href={resolveBasePath("/highlight/default.css")} rel="stylesheet" key="highlight" />,
      ],
    };
  }
}
