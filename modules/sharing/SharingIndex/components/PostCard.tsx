import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Card, Image, Text } from "@mantine/core";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import StarRatings from "@src/components/StarRatings";
import { UserUp } from "@src/components/Svgr/components";
import { CDN_URL } from "@src/config";
import { isEmpty } from "lodash";
import { Eye, Share } from "tabler-icons-react";
import DateTag from "./DateTag";
import TagSharing from "./TagSharing";

const PostCard = (props: any) => {
  const { blog } = props;
  const numberFormat = new Intl.NumberFormat();

  return (
    <Card shadow="md" className="flex py-3 pl-3 gap-6 flex-col lg:flex-row">
      <div className="lg:w-[265px] w-[100%] shadow-sm rounded-md relative">
        <Image
          alt=""
          src={
            blog && isEmpty(blog.imageUrl)
              ? "/default-image.png"
              : blog?.imageUrl?.startsWith("http")
              ? blog?.imageUrl
              : CDN_URL + blog?.imageUrl
          }
          radius="6px"
          height={202}
          fit="fill"
        />
        <DateTag dateTime={blog?.publishTime} className="w-11 h-11 left-1 bottom-1" />
      </div>
      <div className="lg:w-[80%]">
        <div className="h-[85%] pr-4">
          <div>
            <Link href={`/sharing/${blog.permalink}`}>
              <Text className="font-semibold text-lg">{blog.title}</Text>
            </Link>
            <div className="flex flex-none items-center gap-1">
              <StarRatings rating={blog?.rateSummary?.avgRate} />
              <span className="text-xs pt-[4px]">
                {(blog?.rateSummary?.avgRate || 0).toFixed(1)}{" "}
                <span className="text-[#a5adba]">({blog?.rateSummary?.totalUser || 0})</span>
              </span>
            </div>
            <TextLineCamp className="text-base mt-2" line={2}>
              {blog?.description}
            </TextLineCamp>
          </div>
          <div className="flex gap-3 pt-2 mb-2">
            {blog.tags.map((tag) => {
              return <TagSharing key={tag} tag={tag} />;
            })}
          </div>
        </div>
        <div className="flex md:justify-start justify-start pt-2 lg:flex-row gap-6 lg:gap-6 items-center pb-3 h-[15%]">
          <div className="flex gap-2 items-center">
            <ExternalLink href={`/profile/${blog.ownerId}`}>
              <div className="flex items-center gap-2">
                <UserUp width={25} height={25} />
                <Text size={14} color="#2B31CF" className="font-semibold">
                  {blog.ownerName}
                </Text>
              </div>
            </ExternalLink>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Eye size={14} color="#898989" />
              <Text size={14} color="#898989">
                {numberFormat.format(blog.finalTotalViews)}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Share size={14} color="#898989" />
              <Text size={14} color="#898989">
                {numberFormat.format(blog.finalTotalShares)}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default PostCard;
