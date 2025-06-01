import { useLocation, useNavigate } from 'react-router-dom';
import NavigationBar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import '../css/Homepage.css';
import React, { useState, useEffect } from 'react';

function Homepage() {
  const location = useLocation();
  const user = location.state;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalCalories, setTotalCalories] = useState(0);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch exercise data
  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const response = await fetch('https://smabdullah.pythonanywhere.com/home/exercise-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email }),
        });

        const result = await response.json();
        if (result.status === 'success') {
          setData(result.data);

          // Calculate total calories
          const total = result.data.reduce((sum, item) => sum + (item.kcal || 0), 0);
          setTotalCalories(total);
        } else {
          console.error('Error fetching data:', result.message);
        }
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    };

    fetchExerciseData();
  }, [user.email]);

  const handleStartExercise = () => {
    navigate('/home/exercise', { state: user });
  };

  return (
    <div>
      <h3 className='header'>
        Welcome, {user.firstName}
        <span style={{ marginLeft: '110px', fontSize: '16px', color: 'white' }}>
        {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
}
        </span>
      </h3>
      <hr />
      <NavigationBar />
      <BarChart
        width={365}
        height={300}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Legend />
        <Bar
          dataKey="kcal"
          fill="#82ca9d"
          isAnimationActive={true}
          barSize={30}
        />
      </BarChart>
      <div className='btns'>
        <hr />
        <span style={{ marginLeft: '50px', fontSize: '16px', color: 'white', fontWeight: 'bold' }}>
          Total Calories Burned: {totalCalories.toFixed(2)} kcal
        </span>
        <hr />
        <button className='btn btn-success' onClick={handleStartExercise}>
          Start Exercise
        </button>
      </div>
    </div>
  );
}

export default Homepage;
