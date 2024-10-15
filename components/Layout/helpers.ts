export const checkActiveRoute = (route: string, currentRoute: string) => {
  if (route.length == 1 && route === "/" && currentRoute.length > 1) {
    return false;
  }
  if (currentRoute.startsWith(route)) {
    return true;
  }
  return false;
};
