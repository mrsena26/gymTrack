import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  const startSession = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/sessions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    setMessage(JSON.stringify(data));
  };

  return (
    <div>
      <h1>Gym Tracker</h1>
      <button onClick={startSession}>Start Session</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
