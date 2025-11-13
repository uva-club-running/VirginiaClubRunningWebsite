import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, query, where, serverTimestamp, Timestamp } from "firebase/firestore";

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
        {["meets", "records", "philanthropy", "All Americans"].map((tab) => (
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
        {activeTab === "meets" && (
          <>
            <MeetForm />
            <UpdateMeetResults />
          </>
        )}
        {activeTab === "records" && <RecordSection />}
        {activeTab === "philanthropy" && <PhilanthropyForm />}
        {activeTab === "All Americans" && <AllAmericanForm />}
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
  const [meet, setMeet] = useState({
    name: "",
    date: "",
    location: "",
    results: "",
    year: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeet((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!meet.name.trim() || !meet.date || !meet.location.trim()) {
      alert("Please fill in meet name, date, and location.");
      return;
    }

    try {
      // Convert date string to Firestore Timestamp
      const dateObj = new Date(meet.date);
      // Set to midnight UTC to avoid timezone issues
      dateObj.setHours(0, 0, 0, 0);
      const timestamp = Timestamp.fromDate(dateObj);

      const meetData = {
        name: meet.name.trim(),
        date: timestamp,
        location: meet.location.trim(),
        dateAdded: serverTimestamp(),
        year: dateObj.getFullYear()
      };

      // Only add results field if it has a value
      if (meet.results.trim()) {
        meetData.results = meet.results.trim();
      }

      await addMeet(meetData);

      // Reset form
      setMeet({
        name: "",
        date: "",
        location: "",
        results: "",
      });

      alert("Meet added successfully!");
    } catch (error) {
      console.error("Error adding meet:", error);
      alert("Error adding meet. Please try again.");
    }
  };

  return (
    <Card title="Add Meet">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={meet.name}
          onChange={handleChange}
          placeholder="Meet Name"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
          required
        />
        <input
          type="date"
          name="date"
          value={meet.date}
          onChange={handleChange}
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white focus:ring-2 focus:ring-vaorange-500"
          required
        />
        <input
          type="text"
          name="location"
          value={meet.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
          required
        />
        <input
          type="url"
          name="results"
          value={meet.results}
          onChange={handleChange}
          placeholder="Results URL (optional)"
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

function UpdateMeetResults() {
  const [meets, setMeets] = useState([]);
  const [selectedMeetName, setSelectedMeetName] = useState("");
  const [resultsUrl, setResultsUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMeets = async () => {
      try {
        const meetsData = await getAllMeets();

        // Sort by year (descending) and then by date (ascending)
        meetsData.sort((a, b) => {
          const yearA = a.year || 0;
          const yearB = b.year || 0;
          if (yearA !== yearB) return yearB - yearA;
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date || 0);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date || 0);
          return dateA - dateB;
        });

        setMeets(meetsData);
      } catch (error) {
        console.error("Error fetching meets:", error);
      }
    };

    fetchMeets();
  }, []);

  // Group meets by year
  const groupedMeets = meets.reduce((groups, meet) => {
    const year = meet.year || "Unknown Year";
    if (!groups[year]) groups[year] = [];
    groups[year].push(meet);
    return groups;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMeetName.trim()) {
      alert("Please select a meet.");
      return;
    }

    if (!resultsUrl.trim()) {
      alert("Please enter a results URL.");
      return;
    }

    setLoading(true);
    try {
      await updateMeetResults(selectedMeetName, resultsUrl);
      setResultsUrl("");
      setSelectedMeetName("");
      alert("Meet results updated successfully!");

      // Refresh meets after update
      const meetsData = await getAllMeets();
      setMeets(meetsData);
    } catch (error) {
      console.error("Error updating meet results:", error);
      if (error.message === "Meet not found") {
        alert("Meet not found. Please check the meet name.");
      } else {
        alert("Error updating meet results. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Update Meet Results">
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={selectedMeetName}
          onChange={(e) => setSelectedMeetName(e.target.value)}
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white focus:ring-2 focus:ring-vaorange-500"
          required
        >
          <option value="">Select a Meet</option>
          {Object.entries(groupedMeets).map(([year, yearMeets]) => (
            <optgroup key={year} label={year}>
              {yearMeets.map((meet) => (
                <option key={meet.id} value={meet.name}>
                  {meet.name} — {meet.location || "TBD"}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <input
          type="url"
          value={resultsUrl}
          onChange={(e) => setResultsUrl(e.target.value)}
          placeholder="Results URL"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-vaorange-500 py-2 text-darkblue font-bold hover:bg-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Results"}
        </button>
      </form>
    </Card>
  );
}


// --- Firestore Helpers ---
async function getUniqueEvents() {
  const snapshot = await getDocs(collection(db, "Events"));
  const events = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.name && data.type) {
      events.push({ id: docSnap.id, name: data.name, type: data.type });
    }
  });
  return events;
}

async function addEventToDB(eventName, eventType) {
  try {
    const docRef = await addDoc(collection(db, "Events"), {
      name: eventName,
      type: eventType,
    });
    return docRef.id;
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

async function addMeet(meetData) {
  try {
    const docRef = await addDoc(collection(db, "Meets"), meetData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding meet:", error);
    throw error;
  }
}

async function addPhilanEvent(philanEventData) {
  try {
    const docRef = await addDoc(collection(db, "Philanthropy"), philanEventData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
}

async function updateMeetResults(meetName, resultsUrl) {
  try {
    // Find the meet by name
    const meetsRef = collection(db, "Meets");
    const q = query(meetsRef, where("name", "==", meetName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Meet not found");
    }

    // Update all matches (in case there are duplicates, though there shouldn't be)
    const updatePromises = [];
    querySnapshot.forEach((docSnapshot) => {
      const meetRef = doc(db, "Meets", docSnapshot.id);
      updatePromises.push(updateDoc(meetRef, { results: resultsUrl.trim() }));
    });

    await Promise.all(updatePromises);
    return querySnapshot.docs[0].id;
  } catch (error) {
    console.error("Error updating meet results:", error);
    throw error;
  }
}

async function getAllMeets() {
  try {
    const snapshot = await getDocs(collection(db, "Meets"));
    const meets = [];
    snapshot.forEach((docSnap) => {
      meets.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });
    return meets;
  } catch (error) {
    console.error("Error fetching meets:", error);
    throw error;
  }
}

async function addAllAmerican(allAmericanData) {
  try {
    const docRef = await addDoc(collection(db, "AllAmericans"), allAmericanData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding All American:", error);
    throw error;
  }
}

// --- Record Section ---
function RecordSection() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState("");
  const [eventType, setEventType] = useState("");
  const [record, setRecord] = useState({
    event: "",
    time: "",
    name: "",
    category: "",
    year: 2025,
  });

  // Fetch all events
  useEffect(() => {
    getUniqueEvents().then(setEvents);
  }, []);

  // Group events by type for dropdown display
  const groupedEvents = events.reduce((groups, event) => {
    const { type } = event;
    if (!groups[type]) groups[type] = [];
    groups[type].push(event);
    return groups;
  }, {});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new record
  const handleRecordSubmit = async (e) => {
    e.preventDefault();

    if (!record.event) {
      alert("Please select an event.");
      return;
    }

    const toPersist = {
      name: record.name,
      eventId: record.event, // store only the event ID
      category: record.category,
      year: parseInt(record.year, 10),
      time: record.time, // store time as string
      dateAdded: serverTimestamp(), // timestamp when record was added
    };

    await addRecord(toPersist);

    setRecord({
      event: "",
      time: "",
      name: "",
      category: "",
      year: 2025,
    });

    alert("Record added successfully!");
  };

  // Add a new event to Firestore
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!newEvent.trim() || !eventType.trim()) {
      alert("Please enter both an event name and type.");
      return;
    }
    const newEventObj = { id: await addEventToDB(newEvent, eventType), name: newEvent, type: eventType };
    setEvents((prev) => [...prev, newEventObj]);
    setNewEvent("");
    setEventType("");
  };

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
            {Object.entries(groupedEvents).map(([type, eventList]) => (
              <optgroup key={type} label={type}>
                {eventList.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </optgroup>
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
            <option value="Field">Field</option>
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
                  {eventList.map((event) => (
                    <li key={event.id}>{event.name}</li>
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
  const [philanEvent, setPhilanEvent] = useState({
    name: "",
    date: "",
    partner_org: "",
    description: "",
    link: "",
    flyer_link: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhilanEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!philanEvent.name.trim() || !philanEvent.date) {
      alert("Please fill in event name and date.");
      return;
    }

    try {
      // Convert date string to Firestore Timestamp
      const dateObj = new Date(philanEvent.date);
      // Set to midnight UTC to avoid timezone issues
      dateObj.setHours(0, 0, 0, 0);
      const timestamp = Timestamp.fromDate(dateObj);

      const philanEventData = {
        name: philanEvent.name.trim(),
        date: timestamp,
      };

      if (philanEvent.partner_org.trim()) {
        philanEventData.partner_org = philanEvent.partner_org.trim();
      }
      if (philanEvent.description.trim()) {
        philanEventData.description = philanEvent.description.trim();
      }
      if (philanEvent.link.trim()) {
        philanEventData.link = philanEvent.link.trim();
      }
      if (philanEvent.flyer_link.trim()) {
        philanEventData.flyer_link = philanEvent.flyer_link.trim();
      }

      await addPhilanEvent(philanEventData);

      // Reset form
      setPhilanEvent({
        name: "",
        date: "",
        partner_org: "",
        description: "",
        link: "",
        flyer_link: ""
      });

      alert("Meet added successfully!");
    } catch (error) {
      console.error("Error adding meet:", error);
      alert("Error adding meet. Please try again.");
    }
  }

  return (
    <Card title="Add Philanthropy Event">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={philanEvent.name}
          onChange={handleChange}
          placeholder="Event Name"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
        />
        <input
          type="date"
          name="date"
          value={philanEvent.date}
          onChange={handleChange}
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white focus:ring-2 focus:ring-vaorange-500"
        />
        <input
          type="text"
          name="partner_org"
          value={philanEvent.partner_org}
          onChange={handleChange}
          placeholder="Partner Organization"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
        />
        <input
          type="text"
          name="description"
          value={philanEvent.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
        />
        <input
          type="url"
          name="link"
          value={philanEvent.link}
          onChange={handleChange}
          placeholder="Link"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
        />
        <input
          type="url"
          name="flyer_link"
          value={philanEvent.flyer_link}
          onChange={handleChange}
          placeholder="Flyer Link (optional)"
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

function AllAmericanForm() {
  const [events, setEvents] = useState([]);
  const [allAmerican, setAllAmerican] = useState({
    name: "",
    event: "",
    time: "",
    place: "",
  });

  useEffect(() => {
    getUniqueEvents().then(setEvents);
  }, []);

  const groupedEvents = events.reduce((groups, event) => {
    const { type } = event;
    if (!groups[type]) groups[type] = [];
    groups[type].push(event);
    return groups;
  }, {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAllAmerican((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allAmerican.name.trim() || !allAmerican.event) {
      alert("Please fill in athlete name and event.");
      return;
    }

    const allAmericanData = {
      name: allAmerican.name.trim(),
      eventId: allAmerican.event, // link to event
      time: allAmerican.time.trim(),
      place: parseInt(allAmerican.place, 10),
      dateAdded: serverTimestamp(),
    };

    try {
      await addAllAmerican(allAmericanData);

      setAllAmerican({
        name: "",
        event: "",
        time: "",
        place: "",
      });

      alert("All American added successfully!");
    } catch (error) {
      console.error("Error adding All American:", error);
      alert("Error adding All American. Please try again.");
    }
  };

  return (
    <Card title="Add All American">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          value={allAmerican.name}
          onChange={handleChange}
          placeholder="Athlete Name(s)"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
          required
        />

        <select
          name="event"
          value={allAmerican.event}
          onChange={handleChange}
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white focus:ring-2 focus:ring-vaorange-500"
          required
        >
          <option value="">Select Event</option>
          {Object.entries(groupedEvents).map(([type, eventList]) => (
            <optgroup key={type} label={type}>
              {eventList.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <input
          name="time"
          type="text"
          value={allAmerican.time}
          onChange={handleChange}
          placeholder="Time (e.g. 00:15:32)"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
        />

        <input
          name="place"
          type="number"
          value={allAmerican.place}
          onChange={handleChange}
          placeholder="Place (e.g. 1)"
          className="w-full rounded-lg border border-vaorange-500 bg-darkblue-500 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-vaorange-500"
          required
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-vaorange-500 py-2 text-darkblue font-bold hover:bg-orange-400 transition"
        >
          Add All American
        </button>
      </form>
    </Card>
  );
}
