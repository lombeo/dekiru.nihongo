const propTypesTemplate = ({ imports, componentName, jsx, exports }, { tpl }) => {
  return tpl`
import * as React from "react";
import ISvgProps, { getSize } from "../config/types";

function ${componentName}(props: ISvgProps) {
  return ${jsx};
}

${exports}
  `;
};

module.exports = propTypesTemplate;
