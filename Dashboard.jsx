import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/showkeys")}
          className="btn bg-blue-500 text-white p-2 rounded"
        >
          Show Keys
        </button>
        <button
          onClick={() => navigate("/registeradmin")}
          className="btn bg-yellow-500 text-white p-2 rounded"
        >
          Manage Admins
        </button>
        <button
          onClick={() => navigate("/addevent")}
          className="btn bg-green-500 text-white p-2 rounded"
        >
          Add Event
        </button>
        <button
          onClick={() => navigate("/liveroomstatus")}
          className="btn bg-purple-500 text-white p-2 rounded"
        >
          Live Room Status
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
