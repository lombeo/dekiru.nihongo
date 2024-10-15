import { useMediaQuery } from "@mantine/hooks";

const useIsLgScreen = () => {
  return useMediaQuery("(min-width: 73.75rem)");
};

export default useIsLgScreen;
