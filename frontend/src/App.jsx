import { useEffect, useState } from "react";

function App() {
  const [activeSession, setActiveSession] = useState(null);
  const [message, setMessage] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [setInputs, setSetInputs] = useState({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
  !!localStorage.getItem("access")
);

  useEffect(() =>{
    fetchActiveSession();
  }, []);

  const fetchActiveSession = async() => {
    try {
    const data = await apiRequest(
      "http://127.0.0.1:8000/api/sessions/active/"
    );
    setActiveSession(data);
  } catch (err) {
    setActiveSession(null);
  }
  
  };

  const login = async () => {
    try{
      const data = await apiRequest(
        "http://127.0.0.1:8000/api/token/",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      }
      );
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      setIsAuthenticated(true);
      setUsername("");
      setPassword("");
      setMessage("");
      
      fetchActiveSession();
      
    }catch (err){
      setMessage(err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    setActiveSession(null);
    setUsername("");
    setPassword("");
  };

  const startSession = async () => {
    try {
      const data = await apiRequest(
        "http://127.0.0.1:8000/api/sessions/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      }
      );
      setActiveSession(data);
      setMessage("");
    }catch(err){
      setMessage(err.message);
    }

  };

  const endSession = async () =>{
    try {
    await apiRequest(
      `http://127.0.0.1:8000/api/sessions/${activeSession.id}/end/`,
      { method: "PATCH" }
    );

      setActiveSession(null);
    } catch (err) {
      setMessage(err.message);
    }
  };
  const addExercise = async() => {
    try{
       await apiRequest(
      "http://127.0.0.1:8000/api/exercises/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session: activeSession.id,
          name: exerciseName,
          muscle_group: muscleGroup
        })
      }
    );
    setExerciseName("");
    setMuscleGroup("");
    await fetchActiveSession();
    }catch(err){
      setMessage(err.message);
    }
  };

  const addSet = async (exerciseId) => {
    const reps = setInputs[exerciseId]?.reps;
    const weight = setInputs[exerciseId]?.weight;

    if(!reps || !weight)return;
    try {
      await apiRequest(
      "http://127.0.0.1:8000/api/sets/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exercise: exerciseId,
          reps: reps,
          weight: weight
        })
      }
    );

    setSetInputs(prev => ({
      ...prev,
      [exerciseId]: { reps: "", weight: "" }
    }));

    await fetchActiveSession();
    } catch(err){
      setMessage(err.message);
    }
};

const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem("access");
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : undefined 
  };
  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(()=>({}));

  if (!response.ok) {
    if(response.status ===401 && token){
      logout();
      throw new Error("Session experied. Please login again.");
    }
    throw new Error(data.detail || "Invalid credential");
  }

  return data;
};

  return (
    <div>
      <h1>Gym Tracker</h1>

      {!isAuthenticated ? (
        <div style={{ marginBottom: "20px" }}>
          <h2>Login</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>Login</button>

          <p>{message}</p>
        </div>
      ) : (
        <>
          <button onClick={logout}>Logout</button>

          {activeSession ? (
            <div style={{ marginBottom: "20px" }}>
              <p>Session ongoing (ID: {activeSession.id})</p>
              <button onClick={endSession}>End Session</button>

              <div style={{ marginBottom: "20px" }}>
                <h3>Add Exercise</h3>

                <input
                  type="text"
                  placeholder="Exercise name"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Muscle group"
                  value={muscleGroup}
                  onChange={(e) => setMuscleGroup(e.target.value)}
                />

                <button onClick={addExercise}>
                  Add Exercise
                </button>
              </div>

              {activeSession.exercises.map((exercise) => (
                <div key={exercise.id}>
                  <h3>
                    {exercise.name} ({exercise.muscle_group})
                  </h3>

                  {exercise.sets.map((set) => (
                    <div key={set.id}>
                      {set.reps} reps @ {set.weight}
                    </div>
                  ))}

                  <input
                    type="number"
                    placeholder="Reps"
                    value={setInputs[exercise.id]?.reps || ""}
                    onChange={(e) =>
                      setSetInputs((prev) => ({
                        ...prev,
                        [exercise.id]: {
                          ...prev[exercise.id],
                          reps: e.target.value
                        }
                      }))
                    }
                  />

                  <input
                    type="number"
                    placeholder="Weight"
                    value={setInputs[exercise.id]?.weight || ""}
                    onChange={(e) =>
                      setSetInputs((prev) => ({
                        ...prev,
                        [exercise.id]: {
                          ...prev[exercise.id],
                          weight: e.target.value
                        }
                      }))
                    }
                  />

                  <button onClick={() => addSet(exercise.id)}>
                    Add Set
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <button onClick={startSession}>Start Session</button>
          )}

          <p>{message}</p>
        </>
      )}
    </div>
  );
}

export default App;
