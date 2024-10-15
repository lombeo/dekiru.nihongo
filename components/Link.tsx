import { useRouter } from "next/router";

const Link = (props: any) => {
  const router = useRouter();
  const onClick = (e: any) => {
    if (props.target === "_blank") return;
    e.preventDefault();
    router.push(props.href);
  };
  return <a onClick={onClick} {...props} />;
};

export default Link;
