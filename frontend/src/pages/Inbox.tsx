import React from "react";

const Inbox: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Inbox</h1>
      <div className="text-gray-300">
        <p>
          Welcome to your inbox. This is where your incoming tasks will appear.
        </p>
        {/* Add your inbox functionality here */}
      </div>
    </div>
  );
};

export default Inbox;
