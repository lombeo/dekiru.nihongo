import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { InView } from "react-intersection-observer";

const BoxInView: React.FC<{ tab: string; onView: Dispatch<SetStateAction<string>>; children: JSX.Element, permalink: string }> = ({
  tab,
  onView,
  children,
  permalink
}) => {
  const router = useRouter();

  return (
    <InView
      as="div"
      rootMargin={"0px 0px -80% 0px"}
      onChange={(inView) => {
        if (inView) {
          onView(tab);
          router.replace(
            {
              pathname: `/learning/${permalink}`,
              query: {
                tab: tab,
              },
            },
            null,
            {
              shallow: true,
            }
          );
        }
      }}
    >
      {children}
    </InView>
  );
};

export default BoxInView;
