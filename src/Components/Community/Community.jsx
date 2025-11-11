import NavBar from "../Home/NavBar";

export default function Community() {
    return (
        <div className="min-h-screen bg-[#F9DCBF] text-darkblue-500">
            <NavBar />

            {/* Social Splash */}
            <div
                className="relative w-screen"
                style={{
                    height: '50vh',
                    backgroundImage: "url('static/images/splash/social/social1.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center">
                    <h1 className="text-white text-6xl md:text-8xl font-bold font-franklin">
                        Social
                    </h1>
                    <h2 className="mt-4 text-vaorange-500 text-3xl md:text-5xl italic font-bodoni">
                        Frolic. Bond. Repeat.
                    </h2>
                </div>
            </div>

            {/* Social Section */}
            <div className="max-w-6xl mx-auto px-8 py-20 text-lg space-y-8">
                <section>
                    <h3 className="text-4xl font-franklin text-vaorange-500 mb-4">
                        Social
                    </h3>
                    <p>
                        We host parties every 2–3 weeks.
                    </p>
                    <p>
                        <strong>Frolicsome Fridays</strong> take the place of regular Friday practice.
                        Come play other sports (soccer, frisbee, spikeball) with fellow Club Runners!
                    </p>
                    <p>
                        We also organize events like apple picking, group fitness classes, Sunset Series trips,
                        and intramural teams for sports like soccer and volleyball.
                    </p>
                </section>
            </div>

            {/* Alumni / Parents Splash */}
            <div
                className="relative w-screen"
                style={{
                    height: '50vh',
                    backgroundImage: "url('static/images/splash/donate/pyramid.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center">
                    <h1 className="text-white text-6xl md:text-8xl font-bold font-franklin">
                        Alumni & Parents
                    </h1>
                    <h2 className="mt-4 text-vaorange-500 text-3xl md:text-5xl italic font-bodoni">
                        For the olds.
                    </h2>
                </div>
            </div>

            {/* Alumni Content */}
            <div className="max-w-6xl mx-auto px-8 py-20 text-lg space-y-8">
                <section>
                    <h3 className="text-4xl font-franklin text-vaorange-500 mb-4">
                        Connect with Club Running
                    </h3>
                    <p>
                        Recently graduated and already missing your Club Running pals? Parent of a Club Runner who wants to stay in the loop?
                        Join our{" "}
                        <a href="/contact#treasurer" className="text-vaorange-500 underline">
                            Alumni Listserv
                        </a>{" "}
                        to get semesterly recaps, racing opportunities, and other updates — just 3–4 emails per semester.
                    </p>
                    <p>
                        Check out our{" "}
                        <a href="https://www.instagram.com/hoosrunning/" className="text-vaorange-500 underline">
                            Instagram
                        </a>{" "}
                        and{" "}
                        <a href="https://www.youtube.com/@hoosrunning" className="text-vaorange-500 underline">
                            YouTube
                        </a>{" "}
                        to see what members are up to!
                    </p>
                </section>

                <section>
                    <h3 className="text-4xl font-franklin text-vaorange-500 mb-4">
                        Donate to Club Running
                    </h3>
                    <p>
                        Donations help fund our meets, subsidize member dues, and support community events. We’re deeply grateful for your support!
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Subsidize members’ social/racing dues</li>
                        <li>Organize meets at Lannigan Field and Panorama Farms</li>
                        <li>Host fundraising events benefiting the community</li>
                    </ul>
                    <p>
                        Contribute via{" "}
                        <a
                            href="https://account.venmo.com/u/running-club-uva"
                            className="text-vaorange-500 underline"
                        >
                            Venmo
                        </a>{" "}
                        or contact our{" "}
                        <a href="/contact#treasurer" className="text-vaorange-500 underline">
                            Treasurer
                        </a>{" "}
                        for other methods.
                    </p>
                </section>
            </div>

            {/* Charlottesville Splash Section */}
            <div
                className="relative w-screen"
                style={{
                    height: '50vh',
                    backgroundImage: "url('static/images/splash/charlottesville/1.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center">
                    <h1 className="text-white text-6xl md:text-8xl font-bold font-franklin">
                        Running in Charlottesville
                    </h1>
                    <h2 className="mt-4 text-vaorange-500 text-3xl md:text-5xl italic font-bodoni">
                        A beautiful place to exercise & explore.
                    </h2>
                </div>
            </div>

            {/* Charlottesville Routes */}
            <div className="max-w-6xl mx-auto px-8 py-20 space-y-24">
                {/* Short */}
                <section>
                    <h3 className="text-4xl font-franklin text-vaorange-500 mb-8">
                        Short (0–5 Miles)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-10">
                        {[
                            ["Guys’ Downtown", "2497676"],
                            ["Park Trails", "2497677"],
                            ["Stribling", "2497680"],
                            ["Becca’s Loop", "2497681"],
                            ["Girls’ Downtown", "2497682"],
                            ["Azalea", "2497686"],
                            ["Good Night, Mr. Jefferson...", "2497688"]
                        ].map(([name, id]) => (
                            <div key={id}>
                                <h4 className="text-2xl font-bold mb-2">{name}</h4>
                                <div className="aspect-video relative overflow-hidden rounded-lg shadow-md">
                                    <iframe
                                        src={`https://www.plotaroute.com/embedmap/${id}?units=miles`}
                                        className="absolute top-0 left-0 w-full h-full"
                                        frameBorder="0"
                                        scrolling="no"
                                        allowFullScreen
                                        title={name}
                                    ></iframe>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Medium */}
                <section>
                    <h3 className="text-4xl font-franklin text-vaorange-500 mb-8">
                        Medium (5–8 Miles)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-10">
                        {[
                            ["Post-It", "2497692"],
                            ["Foxhaven", "2497694"],
                            ["CHS", "2497695"],
                            ["Cow Pasture", "2497710"]
                        ].map(([name, id]) => (
                            <div key={id}>
                                <h4 className="text-2xl font-bold mb-2">{name}</h4>
                                <div className="aspect-video relative overflow-hidden rounded-lg shadow-md">
                                    <iframe
                                        src={`https://www.plotaroute.com/embedmap/${id}?units=miles`}
                                        className="absolute top-0 left-0 w-full h-full"
                                        frameBorder="0"
                                        scrolling="no"
                                        allowFullScreen
                                        title={name}
                                    ></iframe>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Long */}
                <section>
                    <h3 className="text-4xl font-franklin text-vaorange-500 mb-8">
                        Long (8+ Miles)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-10">
                        {[
                            ["Ridge Road 🚗", "2497711"],
                            ["Reservoir", "2497712"],
                            ["Rivanna Trail +", "2497714"],
                            ["Dick Woods 🚗", "2497719"]
                        ].map(([name, id]) => (
                            <div key={id}>
                                <h4 className="text-2xl font-bold mb-2">{name}</h4>
                                <div className="aspect-video relative overflow-hidden rounded-lg shadow-md">
                                    <iframe
                                        src={`https://www.plotaroute.com/embedmap/${id}?units=miles`}
                                        className="absolute top-0 left-0 w-full h-full"
                                        frameBorder="0"
                                        scrolling="no"
                                        allowFullScreen
                                        title={name}
                                    ></iframe>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Credit */}
                <p className="text-center text-gray-600">
                    All maps generated using{" "}
                    <a
                        href="https://www.plotaroute.com/routeplanner"
                        className="text-vaorange-500 underline"
                    >
                        Plot a Route
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
