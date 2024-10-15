const Scratch = () => {
  return (
    <div>
      <iframe
        src={process.env.NEXT_PUBLIC_SCRATCH_URL}
        style={{}}
        height="100%"
        width="100%"
        className="w-full h-[calc(100vh_-_68px)] min-h-[740px] overflow-auto border-none"
      />
    </div>
  );
};

export default Scratch;
