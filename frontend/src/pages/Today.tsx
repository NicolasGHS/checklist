import React from "react";

const Today: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Today</h1>
      <div className="text-gray-300">
        <p>Focus on today's tasks and priorities.</p>
        {/* Add your today's tasks functionality here */}
      </div>
    </div>
  );
};

export default Today;
