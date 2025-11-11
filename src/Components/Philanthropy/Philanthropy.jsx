import NavBar from "../Home/NavBar";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

function toJSDate(value) {
    if (!value) return null;
    if (typeof value.toDate === "function") return value.toDate(); // Firestore Timestamp
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
}

export default function Philanthropy() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Philanthropy"));
                const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const now = new Date();
                const filtered = fetched
                    .map(ev => ({ ...ev, _dateObj: toJSDate(ev.date) }))
                    .filter(ev => {
                        if (!ev.name || !ev._dateObj) return false;
                        const cutoff = new Date(ev._dateObj);
                        cutoff.setDate(cutoff.getDate() + 1);
                        return cutoff >= now;
                    })
                    .sort((a, b) => a._dateObj - b._dateObj);

                setEvents(filtered);
            } catch (error) {
                console.error("Error fetching philanthropy events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

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
                        Philanthropy
                    </h1>
                    <h2 className="mt-3 text-center text-vaorange-500 text-3xl md:text-5xl lg:text-7xl font-bodoni italic">
                        Run for a cause.
                    </h2>
                </div>
            </div>

            {/* Upcoming Events Section */}
            <div className="max-w-6xl mt-10 mx-auto px-8 pb-10">
                <h2 className="text-4xl font-franklin text-vaorange-500 mb-10 text-center">
                    Upcoming Community Events
                </h2>
                {loading ? (
                    <p className="text-center text-xl text-gray-600 italic">Loading events...</p>
                ) : events.length === 0 ? (
                    <p className="text-center text-xl text-gray-600 italic">
                        No upcoming events — check back soon!
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-12">
                        {events.map((event) => {
                            const dateObj = event._dateObj;
                            const dateText = dateObj
                                ? dateObj.toLocaleString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    timeZoneName: "short",
                                })
                                : "TBD";

                            return (
                                <div
                                    key={event.id || event.name}
                                    className="bg-white rounded-2xl shadow-md overflow-hidden p-6 space-y-4 transition-transform transform hover:scale-[1.02]"
                                >
                                    <h3 className="text-3xl font-franklin text-vaorange-500">
                                        {event.name}
                                    </h3>
                                    <p className="text-gray-700 font-medium">{dateText}</p>

                                    {event.description && (
                                        <p className="text-gray-800">{event.description}</p>
                                    )}

                                    {event.partner_org && (
                                        <p className="text-gray-600 italic">
                                            Partner Organization: {event.partner_org}
                                        </p>
                                    )}

                                    <div className="space-x-6">
                                        {event.link && (
                                            <a
                                                href={event.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block text-vaorange-500 underline font-semibold"
                                            >
                                                Learn More →
                                            </a>
                                        )}
                                        {event.flyer_link && (
                                            <a
                                                href={event.flyer_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block text-vaorange-500 underline font-semibold"
                                            >
                                                View Flyer →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Overview Section */}
            <div className="max-w-5xl mx-auto px-8 py-20 text-gray-800 space-y-6">
                <h2 className="text-4xl font-franklin text-vaorange-500 mb-10 text-center">
                    Philanthropy Overview
                </h2>
                <p className="text-lg leading-relaxed">
                    Each year, Club Running hosts philanthropy events that raise money for charities such as{" "}
                    <span className="font-semibold">Girls on the Run</span>,{" "}
                    <span className="font-semibold">Special Olympics</span>, and{" "}
                    <span className="font-semibold">UVA Children's Hospital</span>. Club members can get involved by registering
                    to compete in the events or volunteering to help organize. The efforts of our volunteers play a crucial role
                    in making each one such a tremendous success.
                </p>

                <p className="text-lg leading-relaxed">
                    <span className="font-semibold">October 2024's Philanthropy 5K</span> raised over{" "}
                    <span className="font-semibold">$500</span> for{" "}
                    <span className="font-semibold">Prolyfyck Run Crew</span>. Prizes included gift cards to local restaurants and{" "}
                    <span className="font-semibold">Ragged Mountain Running Store</span> merchandise.
                </p>

                <p className="text-lg leading-relaxed">
                    <span className="font-semibold">April 2024's Run-a-Thon and Relay Fest</span> raised over{" "}
                    <span className="font-semibold">$650</span> for Club Running. Prizes included gift cards to local restaurants
                    and Ragged Mountain Running Store merchandise. Further, the{" "}
                    <span className="font-semibold">Philanthropy Committee's Bake Sale and Lemonade Stand</span> raised an
                    additional <span className="font-semibold">$250</span> for the Club.
                </p>
            </div>

            {/* Committee Section */}
            <div className="bg-white py-20">
                <div className="max-w-5xl mx-auto px-8 text-center text-gray-800">
                    <h2 className="text-4xl font-franklin text-vaorange-500 mb-8">
                        Philanthropy Committee
                    </h2>
                    <p className="text-lg leading-relaxed mb-6">
                        Club members who are interested in taking on a more involved role in the club's philanthropy efforts can join
                        our philanthropy committee. Committee members help plan and organize philanthropic events alongside our
                        executive board.
                    </p>
                    <p className="text-lg leading-relaxed">
                        If you are interested in joining the philanthropy committee, contact our{" "}
                        <span className="font-semibold">philanthropy chair</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
