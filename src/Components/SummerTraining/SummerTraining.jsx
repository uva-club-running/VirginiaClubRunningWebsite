import NavBar from "../Home/NavBar";

export default function SummerTraining() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F9DCBF" }}>
            <NavBar />

            {/* Splash Section */}
            <div
                className="relative w-screen"
                style={{
                    height: "70vh",
                    backgroundImage: "url(assets/landing_splash.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <h1 className="text-white text-5xl md:text-7xl lg:text-9xl font-bold font-franklin">
                        Summer Training
                    </h1>
                    <h2 className="mt-3 text-center text-vaorange-500 text-3xl md:text-5xl lg:text-7xl font-bodoni italic">
                        sun's out, guns out
                    </h2>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-5xl mx-auto px-8 py-4 space-y-16 text-darkblue-500">
                {/* Intro */}
                <section>
                    <p className="text-lg leading-relaxed">
                        Whether you're training for another PR or just looking to
                        finish your first 5k, we've got you covered!

                        Our workout coordinators have put together training plans for
                        runners of all skill levels. If you have any questions,
                        feel free to {" "}<a
                            href="/contact#workout-coordinators"
                            className="text-vaorange-500 underline hover:text-vaorange-400"
                        >
                        reach out</a>{" "} to them.
                    </p>
                    <p className="text-lg leading-relaxed mt-2">
                        The training plans can be found below:
                    </p>
                    <p className="mt-4 text-lg leading-relaxed text-darkblue-500">
                        <a
                            href="/assets/summer_training/Couch_to_5k_Plan.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-[#0000EE]"
                        >
                            Couch to 5k Plan
                        </a>
                    </p>
                    <p className="mt-4 text-lg leading-relaxed text-darkblue-500">
                        <a
                            href="/assets/summer_training/Mens_Summer_Training.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-[#0000EE]"
                        >
                            Men's Summer Training
                        </a>
                    </p>
                    <p className="mt-4 text-lg leading-relaxed">
                        <a
                            href="/assets/summer_training/Womens_Summer_Training.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-[#0000EE]"
                        >
                            Women's Summer Training
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
