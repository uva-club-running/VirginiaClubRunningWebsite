import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import NavBar from "../Home/NavBar";

export default function Records() {
  const [recordsByType, setRecordsByType] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordSnap = await getDocs(collection(db, "Records"));
        const records = [];

        for (const recordDoc of recordSnap.docs) {
          const data = recordDoc.data();

          if (!data.event) continue;
          const eventRef = doc(db, "Events", data.event);
          const eventSnap = await getDoc(eventRef);

          let eventType = "Unknown";
          if (eventSnap.exists()) {
            eventType = eventSnap.data().type || "Unknown";
          }

          records.push({
            ...data,
            type: eventType,
          });
        }

        // Group by type and then by event & category to pick lowest time
        const grouped = records.reduce((acc, rec) => {
          if (!acc[rec.type]) acc[rec.type] = {};

          const eventKey = `${rec.event}_${rec.category}`;

          if (
            !acc[rec.type][eventKey] ||
            rec.time < acc[rec.type][eventKey].time
          ) {
            acc[rec.type][eventKey] = rec; // keep record with lowest time
          }

          return acc;
        }, {});

        // Convert grouped object back to array per type
        const groupedByType = Object.fromEntries(
          Object.entries(grouped).map(([type, events]) => [
            type,
            Object.values(events),
          ])
        );

        setRecordsByType(groupedByType);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);


  const groupRecordsByGender = (records) => {
    const menRecords = records.filter((r) => r.category === "Men");
    const womenRecords = records.filter((r) => r.category === "Women");
    return { menRecords, womenRecords };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold">
        Loading records...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100">
      <NavBar />

      <div className="max-w-6xl mx-auto px-8 py-20">
        {Object.entries(recordsByType).map(([type, records], index) => {
          const { menRecords, womenRecords } = groupRecordsByGender(records);

          return (
            <div key={type} className="mb-20">
              {/* Title */}
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold font-franklin text-gray-900 mb-4 capitalize tracking-tight">
                  {type}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-vaorange-500 to-vablue-500 mx-auto rounded-full"></div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Men's Records */}
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold font-franklin text-vablue-500 uppercase tracking-wide">
                      Men's Records
                    </h3>
                  </div>
                  {menRecords.length === 0 ? (
                    <p className="text-center text-gray-500 italic">
                      No men's records yet.
                    </p>
                  ) : (
                    menRecords.map((record, idx) => (
                      <div
                        key={idx}
                        className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20"
                      >
                        <div className="space-y-2">
                          <h4 className="text-xl font-bold font-franklin text-gray-900 group-hover:text-vablue-500 transition-colors duration-200">
                            {record.event}
                          </h4>
                          <p className="text-lg font-franklin italic text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                            {record.name}
                          </p>
                          <p className="text-2xl font-bold font-franklin text-vaorange-500 group-hover:text-vablue-500 transition-colors duration-200">
                            {formatTime(record.time)}
                          </p>
                          <p className="text-gray-600">{record.year}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Women's Records */}
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold font-franklin text-vaorange-500 uppercase tracking-wide">
                      Women's Records
                    </h3>
                  </div>
                  {womenRecords.length === 0 ? (
                    <p className="text-center text-gray-500 italic">
                      No women's records yet.
                    </p>
                  ) : (
                    womenRecords.map((record, idx) => (
                      <div
                        key={idx}
                        className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20"
                      >
                        <div className="space-y-2">
                          <h4 className="text-xl font-bold font-franklin text-gray-900 group-hover:text-vaorange-500 transition-colors duration-200">
                            {record.event}
                          </h4>
                          <p className="text-lg font-franklin italic text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                            {record.name}
                          </p>
                          <p className="text-2xl font-bold font-franklin text-vablue-500 group-hover:text-vaorange-500 transition-colors duration-200">
                            {formatTime(record.time)}
                          </p>
                          <p className="text-gray-600">{record.year}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Divider */}
              {index < Object.entries(recordsByType).length - 1 && (
                <div className="relative mt-20">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                      <div className="w-2 h-2 bg-vaorange-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTime(ms) {
  if (typeof ms !== "number" || isNaN(ms)) return ms;
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;
  return `${minutes}:${seconds.toString().padStart(2, "0")}.${Math.floor(
    millis / 100
  )}`;
}
