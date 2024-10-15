import { TextOverflow } from "@edn/components";
import { ActionIcon } from "@mantine/core";
import Link from "@src/components/Link";
import { ArrowDropdownDown, ArrowDropdownUp } from "@src/components/Svgr/components";
import clsx from "clsx";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

interface SyllabusMenuRootProps extends PropsWithChildren<any> {
  isActive?: boolean;
  onToggle?: () => any;
  href?: any;
}

const SyllabusMenuRoot = (props: SyllabusMenuRootProps) => {
  const { href, onToggle, isActive, children } = props;
  const router = useRouter();

  return (
    <div className="mt-[-1px] border-t cursor-pointer border-t-[#E1E1E1] overflow-hidden max-w-full flex justify-between py-3 items-center pl-4 pr-3">
      <Link
        href={href}
        className="max-w-[calc(100%_-_30px)]"
        onClick={(event: any) => {
          event.preventDefault();
          router.push(href);
          onToggle?.();
        }}
      >
        <TextOverflow
          className={clsx({ "text-blue-primary": isActive }, " pr-4 my-0 text-base font-semibold")}
          title={children as any}
        >
          {children}
        </TextOverflow>
      </Link>
      <ActionIcon onClick={onToggle} variant="light">
        {isActive ? (
          <ArrowDropdownDown size="3xl" className={"text-blue-primary flex-none"} />
        ) : (
          <ArrowDropdownUp size="3xl" className="flex-none" />
        )}
      </ActionIcon>
    </div>
  );
};

export default SyllabusMenuRoot;
