import React, { useState } from 'react';
import axios from 'axios';
import './AddEvent.css';

const AddEvent = () => {
  const [form, setForm] = useState({
    eventName: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    roomNumber: '',
    eventType: 'regular',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/events', form);
      alert('Event added successfully!');
      setForm({
        eventName: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        roomNumber: '',
        eventType: 'regular',
      });
    } catch (err) {
      console.error(err);
      alert('Error adding event.');
    }
  };

  return (
    <div className="add-event-container">
      <h2>Add Event</h2>
      <form onSubmit={handleSubmit} className="add-event-form">
        <input name="eventName" placeholder="Event Name" value={form.eventName} onChange={handleChange} required />
        <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange} required />
        <input name="startTime" type="time" value={form.startTime} onChange={handleChange} required />
        <input name="endTime" type="time" value={form.endTime} onChange={handleChange} required />
        <input name="roomNumber" placeholder="Room Number" value={form.roomNumber} onChange={handleChange} required />

        <select name="eventType" value={form.eventType} onChange={handleChange}>
          <option value="regular">Regular</option>
          <option value="exam">Exam</option>
          <option value="event">Event</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddEvent;
