import NextNProgress from "nextjs-progressbar";

export default function Progress() {
  return (
    <NextNProgress
      // color="rgba(255,255,255,0.68)"
      options={{
        showSpinner: false,
      }}
    />
  );
}
