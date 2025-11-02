import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";

const db = getFirestore();

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("meets");

  return (
    <div className="min-h-screen bg-darkblue-500 p-6 text-white font-franklin">
      <h1 className="text-4xl font-bold mb-8 text-center text-vaorange-500">
        Club Running Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        {["meets", "records", "philanthropy"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-medium transition ${activeTab === tab
              ? "bg-vaorange-500 text-darkblue font-bold"
              : "bg-vablue-500 text-white hover:bg-vaorange-500 hover:text-darkblue"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Forms */}
      <div className="max-w-2xl mx-auto space-y-10">
        {activeTab === "meets" && <MeetForm />}
        {activeTab === "records" && <RecordSection />}
        {activeTab === "philanthropy" && <PhilanthropyForm />}
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-vablue-500 shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-6 text-vaorange-500">{title}</h2>
      {children}
    </div>
  );
}

function MeetForm() {
  return (
    <Card title="Add Meet">
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Meet Name"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
        />
        <input
          type="date"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white focus:ring-2 focus:ring-vaorange-500"
        />
        <input
          type="text"
          placeholder="Location"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-vaorange-500 py-2 text-darkblue font-bold hover:bg-orange-400 transition"
        >
          Add Meet
        </button>
      </form>
    </Card>
  );
}

function hhmmssToMillis(hhmmss) {
  const [hours, minutes, seconds] = hhmmss.split(":").map(Number);
  return ((hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)) * 1000;
}

// --- Firestore Helpers ---
async function getUniqueEvents() {
  const snapshot = await getDocs(collection(db, "Events"));
  const events = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.name && data.type) {
      events.push({ name: data.name, type: data.type });
    }
  });

  return events;
}

async function addEventToDB(eventName, eventType) {
  try {
    const eventRef = doc(collection(db, "Events"), eventName); // use eventName as ID
    await setDoc(eventRef, {
      name: eventName,
      type: eventType,
    });
    return eventRef.id; // returns eventName
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
}

async function addRecord(recordData) {
  try {
    const docRef = await addDoc(collection(db, "Records"), recordData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding record:", error);
    throw error;
  }
}

// --- Record Section ---
function RecordSection() {
  const [newEvent, setNewEvent] = useState("");
  const [eventType, setEventType] = useState("");
  const [events, setEvents] = useState([]);
  const [record, setRecord] = useState({
    event: "",
    time: "",
    name: "",
    category: "",
    year: 2025,
  });

  useEffect(() => {
    getUniqueEvents().then(setEvents);
  }, []);

  // Submit a new event to Firestore
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!newEvent.trim() || !eventType.trim()) {
      alert("Please enter both an event name and type.");
      return;
    }

    const newEventObj = { name: newEvent, type: eventType };
    setEvents((prev) => [...prev, newEventObj]);
    await addEventToDB(newEvent, eventType);
    setNewEvent("");
    setEventType("");
  };

  // Handle Record inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Submit record
  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    const toPersist = {
      ...record,
      time: hhmmssToMillis(record.time),
      year: parseInt(record.year, 10),
    };

    setRecord({
      event: "",
      time: "",
      name: "",
      category: "",
      year: 2025,
    });

    await addRecord(toPersist);
  };

  // Group events by type
  const groupedEvents = events.reduce((groups, event) => {
    const { type } = event;
    if (!groups[type]) groups[type] = [];
    groups[type].push(event.name);
    return groups;
  }, {});

  return (
    <div className="space-y-10">
      {/* Add Record */}
      <Card title="Add Record">
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            value={record.name}
            onChange={handleChange}
            placeholder="Athlete Name(s)"
            className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
          />

          <select
            name="event"
            value={record.event}
            onChange={handleChange}
            className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white focus:ring-2 focus:ring-vaorange-500"
          >
            <option value="">Select Event</option>
            {events.map((event, idx) => (
              <option key={idx} value={event.name}>
                {event.name}
              </option>
            ))}
          </select>

          <input
            name="time"
            type="text"
            value={record.time}
            onChange={handleChange}
            placeholder="Time (e.g. 00:15:32)"
            className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
          />

          <select
            name="category"
            value={record.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white focus:ring-2 focus:ring-vaorange-500"
          >
            <option value="">Select Category</option>
            <option value="Men">Men's</option>
            <option value="Women">Women's</option>
          </select>

          <input
            name="year"
            type="text"
            value={record.year}
            onChange={handleChange}
            placeholder="Year (2025)"
            className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-vaorange-500 py-2 text-darkblue font-bold hover:bg-orange-400 transition"
          >
            Add Record
          </button>
        </form>
      </Card>

      {/* Manage Events */}
      <Card title="Manage Events">
        <form onSubmit={handleEventSubmit} className="space-y-4">
          <input
            type="text"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            placeholder="New Event (e.g. Half Marathon)"
            className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
          />

          <select
            name="type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white focus:ring-2 focus:ring-vaorange-500"
          >
            <option value="">Select Type</option>
            <option value="Cross Country">Cross Country</option>
            <option value="Track">Track</option>
            <option value="Road Races">Road Races</option>
            <option value="All-Americans">All-Americans</option>
            <option value="Club Elections">Club Elections</option>
          </select>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-500 py-2 text-darkblue font-bold hover:bg-green-400 transition"
          >
            Add Event
          </button>
        </form>

        {/* Grouped Events */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-vaorange-500 mb-2">
            Current Events
          </h3>

          {Object.keys(groupedEvents).length === 0 ? (
            <p className="text-gray-400">No events yet.</p>
          ) : (
            Object.entries(groupedEvents).map(([type, eventList]) => (
              <div key={type} className="mb-4">
                <h4 className="text-vaorange-400 font-semibold">{type}</h4>
                <ul className="list-disc list-inside ml-4 text-white">
                  {eventList.map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

// --- Philanthropy Form ---
function PhilanthropyForm() {
  return (
    <Card title="Add Philanthropy Event">
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Event Name"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
        />
        <input
          type="date"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white focus:ring-2 focus:ring-vaorange-500"
        />
        <input
          type="text"
          placeholder="Partner Organization"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-vaorange-500 py-2 text-darkblue font-bold hover:bg-orange-400 transition"
        >
          Add Event
        </button>
      </form>
    </Card>
  );
}
