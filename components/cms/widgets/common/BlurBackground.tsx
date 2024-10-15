import styles from "./BlurBackground.module.css";
export function BlurBackground({
  url,
  children,
}: {
  url: string;
  children: any;
}) {
  return (
    <div
      className={styles.banner}
      style={{
        backgroundImage: `url("/bg-challenge.png")`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
      }}
    >
      <div className={styles.overlay} />
      <div
        className={styles.inner}
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
