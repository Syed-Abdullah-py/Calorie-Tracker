import React, { useState, useEffect, useRef } from 'react';
import '../css/Exercise.css';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

function Exercise() {
    const [seconds, setSeconds] = useState(0);
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [heartRate, setHeartRate] = useState('');
    const [bodyTemp, setBodyTemp] = useState('');
    const intervalRef = useRef(null);
    const totalTimeRef = useRef(0);
    const location = useLocation();
    const user = location.state;
    const Navigate = useNavigate();

    useEffect(() => {
        if (running && !paused) {
        intervalRef.current = setInterval(() => {
            setSeconds((s) => s + 1);
        }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [running, paused]);

    const handleStartPause = () => {
        if (!running) {
        setRunning(true);
        setPaused(false);
        } else {
        setPaused((prev) => !prev);
        }
    };

    const handleStop = () => {
        clearInterval(intervalRef.current);
        setRunning(false);
        setPaused(false);
        totalTimeRef.current = seconds;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        gender: user.gender,
        age: user.age,
        height: user.height,
        weight: user.weight,
        email: user.email,
        heartRate,
        bodyTemp,
        duration: totalTimeRef,
    };

    try {
        const response = await fetch('http://192.168.1.17:5000/home/exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (response.ok) {
        alert(`Calories Burnt: ${result.calories_burnt}`);
        setSeconds(0);
        setHeartRate('');
        setBodyTemp('');
        Navigate('/home', { state: user });
        } else {
        alert(`Error: ${result.message}`);
        }
    } catch (err) {
        alert('Submission failed: ' + err.message);
    }
    };


  const formatTime = (secs) => {
    const hrs = String(Math.floor(secs / 3600)).padStart(2, '0');
    const mins = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const secsRem = String(secs % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secsRem}`;
  };

  return (
    <div className="exercise-container card">

      {/* Timer display */}
      <div className="exercise-timer">{formatTime(seconds)}</div>

      {/* Running animation GIF */}
      <div className={`exercise-gif-container ${running && !paused ? 'show' : ''}`}>
        <img
          src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2J5eDZrYm1vN2prZ3F2bDQ0dHEyeGIzeWt4aXVnd2VpdGhzOHZqZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BpO5EiG089iF6RFXDC/giphy.gif"
          alt="Running animation"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Start/Pause and Stop buttons */}
      <div className="exercise-button-container" style={{ bottom: running ? '2.5rem' : '5rem' }}>
        <button className="exercise-button exercise-start" onClick={handleStartPause}>
          {!running ? 'Start' : paused ? 'Resume' : 'Pause'}
        </button>
        <button className="exercise-button exercise-stop" onClick={handleStop} disabled={!running}>
          Stop
        </button>
      </div>
        <form onSubmit={handleSubmit} className="exercise-form">
            <input
                type="number"
                placeholder="Heart Rate (bpm)"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                required
                min="0"
            />
            <input
                type="number"
                step="0.1"
                placeholder="Body Temp (°C)"
                value={bodyTemp}
                onChange={(e) => setBodyTemp(e.target.value)}
                required
                min="30"
                max="45"
            />
            <button type="submit" className="exercise-button exercise-start" onClick={handleSubmit}>
                Submit 
            </button>
        </form>
    </div>
  );
}

export default Exercise;
