import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function AllAmericans() {
    const [loading, setLoading] = useState(true);
    const [grouped, setGrouped] = useState({});
    const [sortedSemesters, setSortedSemesters] = useState([]);
    const [expandedSemesters, setExpandedSemesters] = useState([]);

    useEffect(() => {
        const fetchAllAmericans = async () => {
            try {
                const snapshot = await getDocs(collection(db, "AllAmericans"));
                const records = [];

                for (const docSnap of snapshot.docs) {
                    const data = docSnap.data();
                    let eventName = "";

                    // Fetch event name if eventId exists
                    if (data.eventId) {
                        const eventDoc = await getDoc(doc(db, "Events", data.eventId));
                        if (eventDoc.exists()) {
                            eventName = eventDoc.data().name || "";
                        }
                    }

                    records.push({
                        id: docSnap.id,
                        name: data.name,
                        event: eventName,
                        time: data.time,
                        place: data.place,
                        semester: data.semester,
                        year: data.year,
                    });
                }

                // Group records by semester-year (e.g. "Spring 2025")
                const groupedData = {};
                for (const rec of records) {
                    const key = `${rec.semester} ${rec.year}`;
                    if (!groupedData[key]) groupedData[key] = [];
                    groupedData[key].push(rec);
                }

                // Sort semesters chronologically (latest first)
                const sorted = Object.keys(groupedData).sort((a, b) => {
                    const [semA, yearA] = a.split(" ");
                    const [semB, yearB] = b.split(" ");
                    const semOrder = { Spring: 1, Fall: 2 };
                    if (parseInt(yearA) !== parseInt(yearB)) {
                        return parseInt(yearB) - parseInt(yearA);
                    }
                    return semOrder[semA] - semOrder[semB];
                });

                // Open the most recent two semesters by default
                const defaultExpanded = sorted.slice(0, 2);

                setGrouped(groupedData);
                setSortedSemesters(sorted);
                setExpandedSemesters(defaultExpanded);
            } catch (err) {
                console.error("Error fetching All-Americans:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllAmericans();
    }, []);

    const toggleSemester = (semester) => {
        setExpandedSemesters((prev) =>
            prev.includes(semester)
                ? prev.filter((s) => s !== semester)
                : [...prev, semester]
        );
    };

    if (loading) {
        return (
            <div className="text-center text-gray-500 font-franklin py-8">
                Loading All-Americans...
            </div>
        );
    }

    if (sortedSemesters.length === 0) {
        return (
            <div className="text-center text-gray-500 font-franklin py-8">
                No All-American records found.
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-8 lg:px-16">

            {sortedSemesters.map((semester) => (
                <div
                    key={semester}
                    className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
                >
                    {/* Dropdown header */}
                    <button
                        onClick={() => toggleSemester(semester)}
                        className="w-full flex justify-between items-center px-8 py-5 bg-vablue-500 text-white text-2xl font-bold font-franklin"
                    >
                        <span>{semester}</span>
                        <span
                            className={`transform transition-transform duration-300 ${expandedSemesters.includes(semester)
                                ? "rotate-180"
                                : ""
                                }`}
                        >
                            ▼
                        </span>
                    </button>

                    {/* Table content */}
                    {expandedSemesters.includes(semester) && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-vaorange-500 text-darkblue">
                                        <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                                            Athlete
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                                            Event
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                                            Place
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300">
                                    {grouped[semester].map((rec) => (
                                        <tr
                                            key={rec.id}
                                            className="hover:bg-white/60 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-gray-900 font-franklin font-semibold">
                                                {rec.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 font-franklin">
                                                {rec.event || "—"}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 font-franklin">
                                                {rec.time || "—"}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 font-franklin">
                                                {rec.place || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
