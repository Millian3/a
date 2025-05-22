import React, { useState } from 'react';
import axios from 'axios';

export default function AddEvent() {
  const [eventData, setEventData] = useState({
    room: '',
    subject: '',
    time: '',
    duration: '',
    type: 'Regular',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/events', eventData)
      .then(res => alert(res.data.message))
      .catch(err => alert('Error adding event'));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Add Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Room"
          value={eventData.room}
          onChange={(e) => setEventData({ ...eventData, room: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Subject"
          value={eventData.subject}
          onChange={(e) => setEventData({ ...eventData, subject: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="datetime-local"
          value={eventData.time}
          onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={eventData.duration}
          onChange={(e) => setEventData({ ...eventData, duration: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <select
          value={eventData.type}
          onChange={(e) => setEventData({ ...eventData, type: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="Regular">Regular</option>
          <option value="Exam">Exam</option>
          <option value="Event">Event</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Add Event
        </button>
      </form>
    </div>
  );
}
