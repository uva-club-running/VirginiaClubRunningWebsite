
function Practice() {
    return (
        <div id="practice" className="relative w-screen">
            <img
                src="src/assets/practice_splash.png"
                alt="Banner"
                className="w-screen h-screen object-cover"
            />
            <div className="absolute flex justify-start inset-0 items-start">
                <div className="flex-row ml-[2%] mt-[5%]">
                    <h1 className="text-center text-white text-2xl md:text-4xl lg:text-7xl font-bold font-franklin bg-opacity-50 top-4">
                        Practices.
                    </h1>
                    <h1 className="mt-3 text-center text-vaorange-500 text-xl md:text-3xl lg:text-5xl font-bodoni italic">Building
                        character -
                        and muscles.</h1>
                    <div className="w-230 p-4 rounded mt-5">
                        <p className="text-white text-sm md:text-sm lg:text-2xl font-franklin italic">The club practices
                            Monday through
                            Thursday at
                            Nameless Field, near Memorial Gym. Practices are held at 5:00pm during the fall. During the
                            spring, practices will be held at 5:00pm on Monday/Thursday, and 4:00pm Tuesday/Wednesday.
                            After the clock shifts on March 9th, the time for all days will be 5:00pm.</p>
                        <p className="mt-6 text-white text-lg md:text-sm lg:text-2xl font-franklin italic">No practices
                            are mandatory; some
                            runners attend only a few practices a week while many of our runners attend as many as
                            possible. Members also frequently organize their own runs on weekends, and many track their
                            runs on Strava.</p>
                    </div>
                </div>
                <div className="w-full h-full flex justify-center items-center">
                    <iframe className="widget" allowTransparency frameBorder='0' height='500' scrolling='no'
                            src='https://www.strava.com/clubs/289895/latest-rides/4b7a2cbb9790cbe9ca665bbd27ac0e68ada5c4b5?show_rides=true'
                            width='300'></iframe>
                </div>
            </div>
            <div
                onClick={() => {
                    document.getElementById("meets")?.scrollIntoView({behavior: "smooth"});
                }}
            >
                <img
                    src="src/assets/down_arrow.svg"
                    alt="Scroll down"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-20 animate-bounce cursor-pointer z-50 transition-transform duration-300 hover:scale-110"
                />
            </div>
        </div>
    )
}

export default Practice;