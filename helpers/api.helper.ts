export class ApiHelper {
  static getListUri = <T>(
    domain: string,
    uriEnums: T
  ): {
    [key in keyof typeof uriEnums]: key;
  } => {
    return Object.keys(uriEnums).reduce(
      (obj: any, item: any) => Object.assign(obj, { [item]: domain + uriEnums[item] }),
      {}
    );
  };
}
