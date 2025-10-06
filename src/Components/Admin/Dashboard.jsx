import { useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("meets");
  const [events, setEvents] = useState([]);

  const addEvent = (newEvent) => {
    if (newEvent && !events.includes(newEvent)) {
      setEvents([...events, newEvent]);
    }
  };

  return (
    <div className="min-h-screen bg-darkblue-500 p-6 text-white font-franklin">
      {" "}
      <h1 className="text-4xl font-bold mb-8 text-center text-vaorange-500">
        Club Running Admin Dashboard{" "}
      </h1>
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        {["meets", "records", "philanthropy"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              activeTab === tab
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
        {activeTab === "records" && (
          <RecordSection events={events} addEvent={addEvent} />
        )}
        {activeTab === "philanthropy" && <PhilanthropyForm />}
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-vablue-500 shadow-xl rounded-2xl p-6">
      {" "}
      <h2 className="text-2xl font-semibold mb-6 text-vaorange-500">{title}</h2>
      {children}{" "}
    </div>
  );
}

function MeetForm() {
  return (
    <Card title="Add Meet">
      {" "}
      <form className="space-y-4">
        {" "}
        <input
          type="text"
          placeholder="Meet Name"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:border-vaorange-500 focus:ring-2 focus:ring-vaorange-500"
        />{" "}
        <input
          type="date"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white focus:border-vaorange-500 focus:ring-2 focus:ring-vaorange-500"
        />{" "}
        <input
          type="text"
          placeholder="Location"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:border-vaorange-500 focus:ring-2 focus:ring-vaorange-500"
        />{" "}
        <button
          type="submit"
          className="w-full rounded-lg bg-vaorange-500 py-2 text-darkblue font-bold hover:bg-orange-400 transition"
        >
          Add Meet{" "}
        </button>{" "}
      </form>{" "}
    </Card>
  );
}

function RecordSection({ events, addEvent }) {
  const [newEvent, setNewEvent] = useState("");
  let records;
  getDocs(collection(db, "Records")).then((doc) => {
    records = doc;
  });

  const handleEventSubmit = (e) => {
    e.preventDefault();
    addEvent(newEvent);
    setNewEvent("");
  };

  return (
    <div className="space-y-10">
      {/* Add Record */}{" "}
      <Card title="Add Record">
        {" "}
        <form className="space-y-4">
          {" "}
          <input
            type="text"
            placeholder="Athlete Name"
            className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:border-vaorange-500 focus:ring-2 focus:ring-vaorange-500"
          />{" "}
          <select className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white focus:border-vaorange-500 focus:ring-2 focus:ring-vaorange-500">
            {events.map((event, idx) => (
              <option key={idx} value={event}>
                {event}{" "}
              </option>
            ))}{" "}
          </select>{" "}
          <input
            type="text"
            placeholder="Time (e.g. 15:32)"
            className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:border-vaorange-500 focus:ring-2 focus:ring-vaorange-500"
          />{" "}
          <button
            type="submit"
            className="w-full rounded-lg bg-vaorange-500 py-2 text-darkblue font-bold hover:bg-orange-400 transition"
          >
            Add Record{" "}
          </button>{" "}
        </form>{" "}
      </Card>
      {/* Manage Events */}
      <Card title="Manage Events">
        <form onSubmit={handleEventSubmit} className="space-y-4">
          <input
            type="text"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            placeholder="New Event (e.g. Half Marathon)"
            className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:border-vaorange-500 focus:ring-2 focus:ring-vaorange-500"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-green-500 py-2 text-darkblue font-bold hover:bg-green-400 transition"
          >
            Add Event
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-vaorange-500 mb-2">
            Current Events
          </h3>
          <ul className="list-disc list-inside text-white">
            {events.map((event, idx) => (
              <li key={idx}>{event}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}

function PhilanthropyForm() {
  return (
    <Card title="Add Philanthropy Event">
      {" "}
      <form className="space-y-4">
        {" "}
        <input
          type="text"
          placeholder="Event Name"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:border-vaorange-500 focus:ring-2 focus:ring-vaorange-500"
        />{" "}
        <input
          type="date"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white focus:border-vaorange-500 focus:ring-2 focus:ring-vaorange-500"
        />{" "}
        <input
          type="text"
          placeholder="Partner Organization"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:border-vaorange-500 focus:ring-2 focus:ring-vaorange-500"
        />{" "}
        <button
          type="submit"
          className="w-full rounded-lg bg-vaorange-500 py-2 text-darkblue font-bold hover:bg-orange-400 transition"
        >
          Add Event{" "}
        </button>{" "}
      </form>{" "}
    </Card>
  );
}
