import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="h-screen w-full bg-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Checklist App</h1>
        <p className="text-xl text-gray-300 mb-8">
          Organize your tasks and stay productive
        </p>
        <div className="space-x-4">
          <Link
            to="/inbox"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block transition-colors"
          >
            Go to Inbox
          </Link>
          <Link
            to="/today"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-block transition-colors"
          >
            View Today's Tasks
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
