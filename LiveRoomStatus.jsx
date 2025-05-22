import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function LiveRoomStatus() {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchStatus = () => {
      axios.get('http://localhost:5000/api/room-status')
        .then(res => setStatuses(res.data))
        .catch(err => console.error(err));
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">📡 Live Room Status</h2>
      {statuses.length === 0 ? (
        <p className="text-center text-gray-600">No active rooms currently.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statuses.map((status, index) => (
            <div key={index} className="bg-white shadow rounded p-4 border">
              <p><strong>🏫 Room:</strong> {status.room}</p>
              <p><strong>👤 User:</strong> {status.user}</p>
              <p><strong>📘 Subject:</strong> {status.subject}</p>
              <p><strong>🕒 Time:</strong> {status.time}</p>
              <p><strong>⏳ Remaining:</strong> {status.remaining}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
