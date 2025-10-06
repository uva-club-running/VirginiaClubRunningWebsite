function Community() {
  return (
    <>
      <div id="community" className="relative w-screen">
        <img
          src="assets/community_splash.png"
          alt="Banner"
          className="w-screen h-screen object-cover"
        />
        <div className="absolute inset-0 flex items-start justify-center">
          <div className="h-full flex flex-col justify-center items-center">
            <h1 className="text-franklin text-4xl md:text-5xl lg:text-6xl text-white font-bold">
              Community.
            </h1>
            <h2 className="mt-2 text-center text-vaorange-500 text-2xl md:text-3xl lg:text-4xl font-bodoni italic">
              More than just running.
            </h2>
            <p className="mt-10 md:mt-20 mb-10 mx-15 md:mx-40 lg:mx-80 text-center text-white text-lg md:text-xl font-franklin italic">
              The club enjoys a close-knit social community in addition to its
              training. We host team parties, enjoy group dinner after practice
              every evening, organize intramural teams for soccer and dodgeball,
              and go on day trips to Kings Dominion, Carter Mountain, and other
              nearby attractions. We’re a close-knit group that loves to welcome
              new members—we hope you can find your place with us! Oh, and we've
              got some killer anthems, too.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Community;
