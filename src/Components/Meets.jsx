function Meets() {
    return (
        <>
            <div id="meets" className="relative w-screen h-screen">
                {/* Background image */}
                <img
                    src="src/assets/splash_meet.png"
                    alt="Banner"
                    className="w-full h-full object-cover"
                />

                {/* Overlay container */}
                <div className="absolute inset-0 flex w-full h-full">
                    {/* Left half */}
                    <div className="w-1/2 flex justify-center items-start pt-20">
                        <div className="flex flex-col items-center px-8">
                            <h1 className="text-franklin text-7xl text-white font-bold">Meets.</h1>
                            <h2 className="text-center text-vaorange-500 text-5xl font-bodoni italic">
                                Hoos gonna give it to ya.
                            </h2>
                        </div>
                    </div>

                    {/* Right half */}
                    <div className="w-1/2 flex justify-center items-start pt-20 px-8">
                        <p className="text-center text-white text-2xl font-franklin italic max-w-lg mr-20">
                            The club attends more than half a dozen cross country and track meets throughout the year,
                            including NIRCA Regional and National Championships. We have the opportunity to compete
                            against a variety of Division III and club teams from across the country, and the Hoos
                            represent well at almost every meet. The club offers runners of all skill levels an
                            opportunity to push themselves to race at a collegiate level without the time commitment of
                            a varsity team. See our meet schedule
                        </p>
                    </div>
                </div>
                <div
                    onClick={() => {
                        document.getElementById("community")?.scrollIntoView({behavior: "smooth"});
                    }}
                >
                    <img
                        src="src/assets/down_arrow.svg"
                        alt="Scroll down"
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-20 animate-bounce cursor-pointer z-50 transition-transform duration-300 hover:scale-110"
                    />
                </div>
            </div>
        </>
    )
}

export default Meets;