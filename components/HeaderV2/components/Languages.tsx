import { HoverCard, Image, clsx } from "@mantine/core";
import { Down } from "@src/components/Svgr/components";
import { useRouter } from "next/router";
import { useState } from "react";

const Languages = () => {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;

  const [open, setOpen] = useState(false);

  const handleChangeLanguage = (nextLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: nextLocale });
    localStorage.setItem("locale", nextLocale);
  };

  return (
    <div className="hidden lg:flex">
      <HoverCard
        shadow="lg"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        width={148}
        classNames={{ dropdown: "px-1 py-2" }}
        position="bottom"
        withinPortal
        withArrow
      >
        <HoverCard.Target>
          <div className="cursor-pointer flex items-center gap-1 uppercase text-sm font-semibold text-white">
            {locale}
            <Down
              className={clsx("", {
                "rotate-180": open,
              })}
              width={16}
              height={16}
            />
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <div className="flex flex-col gap-2">
            {[
              {
                label: "English",
                id: "en",
                image: "/images/flags/cl_en.png",
              },
              {
                label: "Tiếng Việt",
                id: "vi",
                image: "/images/flags/cl_vi.png",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2.5 px-2 py-1 rounded-md cursor-pointer font-semibold text-sm hover:text-navy-primary"
                onClick={() => handleChangeLanguage(item.id)}
              >
                <Image
                  alt={item.label}
                  src={item.image}
                  width={25}
                  height={25}
                  className="cursor-pointer radius-full"
                />
                {item.label}
              </div>
            ))}
          </div>
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
};

export default Languages;
