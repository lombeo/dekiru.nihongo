import Link from "@src/components/Link";

const TagSharing = (props: any) => {
  const { tag } = props;
  return (
    <div className="bg-[#EBEBEB] flex items-center px-3 rounded-md py-1 border border-[#ddd]">
      <Link href={`/sharing/tags/${tag}`} className="text-[#898980] text-xs">
        {tag}
      </Link>
    </div>
  );
};

export default TagSharing;
