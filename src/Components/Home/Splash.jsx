function Splash() {
  return (
    <div className="relative w-screen">
      <img
        src="assets/landing_splash.png"
        alt="Banner"
        className="w-screen h-[91.5vh] object-cover"
      />
      <div className="absolute inset-0 flex items-start justify-center">
        <div className="flex-row mt-16">
          <h1 className="text-white text-5xl md:text-7xl lg:text-9xl font-bold font-franklin bg-opacity-50 top-4">
            Club Running
          </h1>
          <h1 className="mt-3 text-center text-vaorange-500 text-5xl md:text-7xl lg:text-9xl font-bodoni italic">
            at UVA
          </h1>
        </div>
        <div
          onClick={() => {
            document
              .getElementById("practice")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <img
            src="assets/down_arrow.svg"
            alt="Scroll down"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-20 animate-bounce cursor-pointer z-50 transition-transform duration-300 hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
}

export default Splash;
