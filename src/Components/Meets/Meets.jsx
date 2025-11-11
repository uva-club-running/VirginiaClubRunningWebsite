import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import NavBar from "../Home/NavBar";

export default function Meets() {
    const [meets, setMeets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSemester, setExpandedSemester] = useState(null);

    useEffect(() => {
        const fetchMeets = async () => {
            try {
                let meetsSnap;
                try {
                    const meetsQuery = query(
                        collection(db, "Meets"),
                        orderBy("date", "asc")
                    );
                    meetsSnap = await getDocs(meetsQuery);
                } catch (orderError) {
                    console.warn("Could not order by date, fetching without order:", orderError);
                    meetsSnap = await getDocs(collection(db, "Meets"));
                }

                const meetsData = meetsSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Sort manually if Firestore order fails
                meetsData.sort((a, b) => {
                    const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date || 0);
                    const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date || 0);
                    return dateA - dateB;
                });

                setMeets(meetsData);
                setLoading(false);

                // Find current semester to expand by default
                const now = new Date();
                const currentSemester =
                    now.getMonth() + 1 >= 6 ? `Fall ${now.getFullYear()}` : `Spring ${now.getFullYear()}`;
                setExpandedSemester(currentSemester);
            } catch (error) {
                console.error("Error fetching meets:", error);
                setLoading(false);
            }
        };

        fetchMeets();
    }, []);

    const formatDate = (dateValue) => {
        if (!dateValue) return "TBD";
        const date =
            dateValue.toDate?.() ||
            (typeof dateValue === "string" ? new Date(dateValue) : dateValue);
        if (isNaN(date)) return "TBD";
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getSemesterKey = (dateValue) => {
        if (!dateValue) return "Unknown Semester";
        const date =
            dateValue.toDate?.() ||
            (typeof dateValue === "string" ? new Date(dateValue) : dateValue);
        if (isNaN(date)) return "Unknown Semester";
        const year = date.getFullYear();
        return date.getMonth() + 1 >= 6 ? `Fall ${year}` : `Spring ${year}`;
    };

    const grouped = meets.reduce((acc, meet) => {
        const key = getSemesterKey(meet.date);
        if (!acc[key]) acc[key] = [];
        acc[key].push(meet);
        return acc;
    }, {});

    const sortedSemesters = Object.keys(grouped).sort((a, b) => {
        const [semA, yearA] = a.split(" ");
        const [semB, yearB] = b.split(" ");
        const numA = parseInt(yearA, 10) * 2 + (semA === "Fall" ? 1 : 0);
        const numB = parseInt(yearB, 10) * 2 + (semB === "Fall" ? 1 : 0);
        return numB - numA; // newest first
    });

    if (loading) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: "#F9DCBF" }}>
                <NavBar />
                <div className="min-h-screen flex justify-center items-center">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-vablue-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F9DCBF" }}>
            <NavBar />

            {/* Splash Section */}
            <div
                className="relative w-screen"
                style={{
                    height: "70vh",
                    backgroundImage: "url(assets/splash_meet.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <h1 className="text-white text-5xl md:text-7xl lg:text-9xl font-bold font-franklin">
                        Meets
                    </h1>
                    <h2 className="mt-3 text-center text-vaorange-500 text-3xl md:text-5xl lg:text-7xl font-bodoni italic">
                        Hoos gonna give it to ya.
                    </h2>
                </div>
            </div>

            {/* Meets by Semester */}
            <div className="max-w-6xl mx-auto px-8 py-20">
                {sortedSemesters.map((semester) => (
                    <div
                        key={semester}
                        className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
                    >
                        <button
                            onClick={() =>
                                setExpandedSemester(
                                    expandedSemester === semester ? null : semester
                                )
                            }
                            className="w-full flex justify-between items-center px-8 py-5 bg-vablue-500 text-white text-2xl font-bold font-franklin"
                        >
                            <span>{semester}</span>
                            <span
                                className={`transform transition-transform duration-300 ${expandedSemester === semester ? "rotate-180" : ""
                                    }`}
                            >
                                ▼
                            </span>
                        </button>

                        {expandedSemester === semester && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-vaorange-500 text-darkblue">
                                            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                                                Meet
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                                                Results
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300">
                                        {grouped[semester].map((meet) => (
                                            <tr
                                                key={meet.id}
                                                className="hover:bg-white/60 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-gray-900 font-franklin">
                                                    {formatDate(meet.date)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 font-franklin font-semibold">
                                                    {meet.name || "TBD"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-700 font-franklin">
                                                    {meet.location || "TBD"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {meet.results?.trim() ? (
                                                        <a
                                                            href={meet.results}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-vablue-500 hover:text-vablue-700 font-franklin underline"
                                                        >
                                                            View Results
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400 italic font-franklin">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}

                {sortedSemesters.length === 0 && (
                    <div className="bg-white/60 rounded-2xl p-12 text-center text-gray-600 italic">
                        No meets scheduled yet.
                    </div>
                )}
            </div>
        </div>
    );
}
