import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ShowKeys() {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/keys')
      .then(response => setKeys(response.data))
      .catch(error => console.error('Error fetching keys:', error));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">🔑 Key Logs</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="border px-4 py-2">🏫 Room</th>
              <th className="border px-4 py-2">👤 Accessed By</th>
              <th className="border px-4 py-2">🕒 Last Accessed</th>
            </tr>
          </thead>
          <tbody>
            {keys.length > 0 ? (
              keys.map((key, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{key.room}</td>
                  <td className="border px-4 py-2">{key.accessed_by}</td>
                  <td className="border px-4 py-2">{key.last_accessed}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center text-gray-500">
                  No key logs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
