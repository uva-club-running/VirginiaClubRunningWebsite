import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import NavBar from "../Home/NavBar";
import AllAmericans from "./AllAmericans";

export default function Records() {
  const [recordsByType, setRecordsByType] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordSnap = await getDocs(collection(db, "Records"));
        const records = [];

        // --- 1. Gather all records and collect unique event IDs ---
        const recordData = recordSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        const uniqueEventIds = [
          ...new Set(recordData.map((r) => r.eventId).filter(Boolean)),
        ];

        // --- 2. Fetch all Events referenced by those IDs in parallel ---
        const eventMap = {};
        await Promise.all(
          uniqueEventIds.map(async (eventId) => {
            const eventRef = doc(db, "Events", eventId);
            const eventSnap = await getDoc(eventRef);
            if (eventSnap.exists()) {
              eventMap[eventId] = eventSnap.data();
            }
          })
        );

        // --- 3. Merge record data with event info ---
        for (const data of recordData) {
          const eventData = eventMap[data.eventId];
          if (!eventData) continue;

          records.push({
            ...data,
            event: eventData.name || "Unknown Event",
            type: eventData.type || "Unknown",
          });
        }

        // --- 4. Group by type, then by event + category (keep most recent record) ---
        const grouped = records.reduce((acc, rec) => {
          if (!acc[rec.type]) acc[rec.type] = {};

          const eventKey = `${rec.event}_${rec.category}`;

          // Get timestamp in milliseconds for comparison
          const recTimestamp = rec.dateAdded?.toMillis?.() || rec.dateAdded?.seconds * 1000 || 0;
          const existingTimestamp = acc[rec.type][eventKey]?.dateAdded?.toMillis?.() ||
            acc[rec.type][eventKey]?.dateAdded?.seconds * 1000 || 0;

          if (
            !acc[rec.type][eventKey] ||
            recTimestamp > existingTimestamp
          ) {
            acc[rec.type][eventKey] = rec;
          }

          return acc;
        }, {});

        // --- 5. Convert grouped object to arrays per type ---
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

  // --- Helper to group by gender ---
  const groupRecordsByGender = (records) => {
    // Sort men's records alphabetically
    const menRecords = records
      .filter((r) => r.category === "Men")
      .sort((a, b) => (a.event || "").localeCompare(b.event || ""));

    // Get all women's records
    const allWomenRecords = records.filter((r) => r.category === "Women");

    // Create a map of women's records by event name for quick lookup
    const womenMap = new Map();
    allWomenRecords.forEach((r) => {
      womenMap.set(r.event, r);
    });

    // Get set of men's event names
    const menEventNames = new Set(menRecords.map((r) => r.event));

    // Build ordered women's records: first match men's order, then add women's-only at end
    const orderedWomenRecords = [];

    // Add women's records matching men's events in men's order
    menRecords.forEach((menRecord) => {
      const womenRecord = womenMap.get(menRecord.event);
      if (womenRecord) {
        orderedWomenRecords.push(womenRecord);
      }
    });

    // Add women's-only events at the end, sorted alphabetically
    const womenOnlyRecords = allWomenRecords
      .filter((r) => !menEventNames.has(r.event))
      .sort((a, b) => (a.event || "").localeCompare(b.event || ""));

    orderedWomenRecords.push(...womenOnlyRecords);

    return { menRecords, womenRecords: orderedWomenRecords };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-vablue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Define the order for event types
  const typeOrder = ["Cross Country", "Track", "Field", "Road Races", "Club Elections"];

  // Sort recordsByType entries by the defined order
  const sortedRecordsByType = Object.entries(recordsByType).sort(([typeA], [typeB]) => {
    const indexA = typeOrder.indexOf(typeA);
    const indexB = typeOrder.indexOf(typeB);
    // If type not in order list, put it at the end
    const orderA = indexA === -1 ? Infinity : indexA;
    const orderB = indexB === -1 ? Infinity : indexB;
    return orderA - orderB;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9DCBF' }}>
      <NavBar />

      {/* Splash Section - Fixed Background */}
      <div
        className="relative w-screen"
        style={{
          height: '70vh',
          backgroundImage: 'url(assets/landing_splash.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <h1 className="text-white text-5xl md:text-7xl lg:text-9xl font-bold font-franklin">
            Records
          </h1>
          <h2 className="mt-3 text-center text-vaorange-500 text-3xl md:text-5xl lg:text-7xl font-bodoni italic">
            Hoos represent.
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-20">
        {sortedRecordsByType.map(([type, records], index) => {
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
                      <RecordCard key={idx} record={record} color="men" />
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
                      <RecordCard key={idx} record={record} color="women" />
                    ))
                  )}
                </div>
              </div>

              {/* Divider */}
              <Divider />
            </div>
          );
        })}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold font-franklin text-gray-900 mb-4 capitalize tracking-tight">
            All Americans
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-vaorange-500 to-vablue-500 mx-auto rounded-full"></div>
        </div>
        <AllAmericans></AllAmericans>
      </div>
    </div>
  );
}

function RecordCard({ record, color }) {
  const isMen = color === "men";
  return (
    <div
      className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20"
    >
      <div className="space-y-2">
        <h4
          className={`text-xl font-bold font-franklin text-gray-900 transition-colors duration-200 ${isMen
            ? "group-hover:text-vablue-500"
            : "group-hover:text-vaorange-500"
            }`}
        >
          {record.event}
        </h4>
        <p className="text-lg font-franklin italic text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
          {record.name}
        </p>
        <p
          className={`text-2xl font-bold font-franklin transition-colors duration-200 ${isMen
            ? "text-vaorange-500 group-hover:text-vablue-500"
            : "text-vablue-500 group-hover:text-vaorange-500"
            }`}
        >
          {formatTime(record.time)}
        </p>
        <p className="text-gray-600">{record.year}</p>
      </div>
    </div>
  );
}

function Divider() {
  return (
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
  );
}

// Format time string for display - just return the stored string
function formatTime(timeStr) {
  return timeStr || "";
}
