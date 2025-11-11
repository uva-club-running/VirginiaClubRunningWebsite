import NavBar from "../Home/NavBar";

export default function About() {
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
                        Join Us
                    </h1>
                    <h2 className="mt-3 text-center text-vaorange-500 text-3xl md:text-5xl lg:text-7xl font-bodoni italic">
                        Not a cult.
                    </h2>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-5xl mx-auto px-8 py-20 space-y-16 text-darkblue-500">
                {/* Intro */}
                <section>
                    <p className="text-lg leading-relaxed">
                        There are probably so many questions swirling around in your head
                        right now. What is Club Running? Are we{" "}
                        <a
                            href="https://www.reddit.com/r/UVA/comments/kgzqpk/is_club_running_a_cult/"
                            className="text-vaorange-500 underline hover:text-vaorange-400"
                        >
                            some kind of cult?
                        </a>{" "}
                        What does a typical week look like? And how do you join?
                    </p>
                    <p className="mt-4 text-lg leading-relaxed">
                        Well, gentle neophyte, press on! We’re here to answer these
                        questions and more.
                    </p>
                </section>

                {/* Quick Facts */}
                <section>
                    <h2 className="text-4xl font-franklin text-vaorange-500 mb-6">
                        Quick Facts
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-lg">
                        <li>
                            Club Running is an athletic{" "}
                            <a
                                href="https://studentengagement.virginia.edu/about-student-organizations-uva"
                                className="text-vaorange-500 underline hover:text-vaorange-400"
                            >
                                CIO
                            </a>{" "}
                            at the University of Virginia.
                        </li>
                        <li>
                            We have over 300 active members, though typical practices are
                            around 50 runners strong.
                        </li>
                        <li>We welcome runners of all skill levels.</li>
                        <li>
                            We hold near-daily practices during the semester, and attendance
                            is always optional.
                        </li>
                        <li>
                            Join our{" "}
                            <a
                                href="https://lists.virginia.edu/sympa/subscribe/club-running"
                                className="text-vaorange-500 underline hover:text-vaorange-400"
                            >
                                mailing list
                            </a>{" "}
                            to stay up-to-date on club events and announcements.
                        </li>
                        <li>
                            Follow us on{" "}
                            <a
                                href="https://www.instagram.com/hoosrunning/"
                                className="text-vaorange-500 underline hover:text-vaorange-400"
                            >
                                Instagram
                            </a>{" "}
                            and{" "}
                            <a
                                href="https://www.youtube.com/@hoosrunning"
                                className="text-vaorange-500 underline hover:text-vaorange-400"
                            >
                                YouTube
                            </a>{" "}
                            to see what we’re up to!
                        </li>
                    </ul>
                </section>

                {/* Practices */}
                <section>
                    <h2 className="text-4xl font-franklin text-vaorange-500 mb-6">
                        Practices
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-lg">
                        <li>
                            Practices are held Monday–Thursday at 5:00 PM (4:00 PM after
                            daylight savings) at{" "}
                            <a
                                href="https://goo.gl/maps/hjGxPD6B3YRXYb5m6"
                                className="text-vaorange-500 underline hover:text-vaorange-400"
                            >
                                Nameless Field
                            </a>
                            .
                        </li>
                        <li>
                            We break into pace groups for runs or workouts, depending on the
                            day.
                        </li>
                        <li>After weekday practice, we head to team dinner at Newcomb.</li>
                        <li>
                            Saturday workouts and informal Sunday long runs round out the
                            week.
                        </li>
                        <li>
                            Attendance is never required—just show up, meet people, and run!
                        </li>
                    </ul>
                </section>

                {/* Meets */}
                <section>
                    <h2 className="text-4xl font-franklin text-vaorange-500 mb-6">
                        Meets
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-lg">
                        <li>We compete at meets roughly every 2–3 weeks.</li>
                        <li>
                            Meets are typically held in nearby college towns across the
                            region.
                        </li>
                        <li>
                            We host our own{" "}
                            <a
                                href="/invitational"
                                className="text-vaorange-500 underline hover:text-vaorange-400"
                            >
                                Cavalier Invitational
                            </a>{" "}
                            each semester.
                        </li>
                        <li>
                            Nationals are hosted by NIRCA in November (fall) and April
                            (spring).
                        </li>
                        <li>
                            Check out our{" "}
                            <a
                                href="/meets"
                                className="text-vaorange-500 underline hover:text-vaorange-400"
                            >
                                current season’s meet schedule
                            </a>
                            .
                        </li>
                    </ul>
                </section>

                {/* Dues */}
                <section>
                    <h2 className="text-4xl font-franklin text-vaorange-500 mb-6">
                        Dues
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-lg">
                        <li>
                            Practices and dinners are open to everyone—no dues required.
                        </li>
                        <li>
                            To attend social events, pay <strong>$20</strong> in social dues.
                        </li>
                        <li>
                            Racing dues are <strong>$40</strong> per semester for meet
                            participation.
                        </li>
                        <li>Dues can be paid via Venmo or cash each semester.</li>
                        <li>
                            If dues present a financial hardship, contact our{" "}
                            <a
                                href="/contact#treasurer"
                                className="text-vaorange-500 underline hover:text-vaorange-400"
                            >
                                treasurer
                            </a>
                            .
                        </li>
                    </ul>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="text-4xl font-franklin text-vaorange-500 mb-6">
                        Contact Us
                    </h2>
                    <p className="text-lg">
                        Still have questions? Reach out to anyone on our{" "}
                        <a
                            href="/contact"
                            className="text-vaorange-500 underline hover:text-vaorange-400"
                        >
                            executive board
                        </a>
                        .
                    </p>
                </section>
            </div>
        </div>
    );
}
