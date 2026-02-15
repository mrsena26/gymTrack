import { useEffect, useState } from "react";

function App() {
  const [activeSession, setActiveSession] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() =>{
    checkActiveSession();
  }, []);

  const checkActiveSession = async() => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/sessions/active/");
      if (response.ok){
        const data = await response.json();
        setActiveSession(data);
      }
    } catch(error){
      console.error("Error checking session", error);
    }
  
  };

  const startSession = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/sessions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    if(response.ok){
      const data = await response.json();
      setActiveSession(data);
    } else{
      const error = await response.json();
      setMessage(error.detail || "Error starting session");
    }

    const data = await response.json();
    setMessage(JSON.stringify(data));
  };

  const endSession = async () =>{
    const response = await fetch(
      `http://127.0.0.1:8000/api/sessions/${activeSession.id}/end/`,
      { method: "PATCH" });
      if (response.ok){
        setActiveSession(null);
      }
  };

  return (
    <div>
      <h1>Gym Tracker</h1>
      {activeSession ? (
        <div>
          <p>Session ongoing (ID: {activeSession.id})</p>
          <button onClick={endSession}>End Session</button>
        </div>
      ): (
        <button onClick={startSession}>Start Session</button>
      )}
      <p>{message}</p>
    </div>
  );
}

export default App;
