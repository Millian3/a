import React, { useState } from 'react';
import axios from 'axios';

export default function EventForm() {
  const [form, setForm] = useState({
    event_name: '',
    event_date: '',
    start_time: '',
    end_time: '',
    room_number: '',
    event_type: 'regular'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/events', form);
      alert('Event added! ID: ' + res.data.event_id);
    } catch (err) {
      console.error(err);
      alert('Error adding event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold">Add Event</h2>

      <input type="text" name="event_name" value={form.event_name} onChange={handleChange} placeholder="Event Name" className="w-full p-2 border" required />
      <input type="date" name="event_date" value={form.event_date} onChange={handleChange} className="w-full p-2 border" required />
      <input type="time" name="start_time" value={form.start_time} onChange={handleChange} className="w-full p-2 border" required />
      <input type="time" name="end_time" value={form.end_time} onChange={handleChange} className="w-full p-2 border" required />
      <input type="text" name="room_number" value={form.room_number} onChange={handleChange} placeholder="Room Number" className="w-full p-2 border" required />

      <select name="event_type" value={form.event_type} onChange={handleChange} className="w-full p-2 border">
        <option value="regular">Regular</option>
        <option value="exam">Exam</option>
        <option value="event">Event</option>
      </select>

      <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-600 rounded">Add Event</button>
    </form>
  );
}
