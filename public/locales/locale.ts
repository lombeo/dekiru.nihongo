import { default as en_common, default as vi_common } from "./vi/common.json";

let all = { ...vi_common, ...en_common };

const GetObjectKey: { [key in keyof typeof all]: key } = Object.keys(all).reduce<any>(
  (pv, cv) => ((pv[cv] = cv), pv),
  {}
);

export const LocaleKeys = GetObjectKey;
