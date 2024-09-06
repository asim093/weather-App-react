import { useEffect, useState } from 'react';

function App() {
  const [Alldata, Setdata] = useState([]);    
  const [weatherData, setWeatherData] = useState([]);  
  const [isdata, Setisdata] = useState(false); 

  function data() {
    let userInput = prompt("Enter City Name").trim();
    if (/\d/.test(userInput) || userInput.trim() === '') {
      alert('Numbers or empty value not allowed');
    } else {
      Setdata((prevData) => [...prevData, userInput]); 
      console.log("wait for data");
    }
  }

  useEffect(() => {
    async function getdata(city) {
      try {
        const ApiData = await fetch(`http://api.weatherapi.com/v1/current.json?key=4ed0daa1d98b49eb8ea51816241406&q=${city}&aqi=no`);
        const response = await ApiData.json();
        return response; 
      } catch (error) {
        console.log(error);
        return null; 
      }
    }

    async function fetchWeatherData() {
      const newWeatherData = await Promise.all(
        Alldata.map(async (city) => {
          const data = await getdata(city);
          return data;
        })
      );
      setWeatherData(newWeatherData.filter(Boolean)); 
      Setisdata(true);  
    }

    if (Alldata.length > 0) {
      fetchWeatherData(); 
    }

    console.log("Updated Alldata:", Alldata);
  }, [Alldata]);

  return (
    <div className="main_container">
      <button onClick={data}>Search</button>
      <div className="container">
        {isdata ? (
          <div className="weather-list">
            <h2>Weather Data:</h2>
            {weatherData.map((data, index) => (
              <div className="card" key={index}>
                <div className="card_top">
                  <img className="icon_img" src={data.current.condition.icon} alt="Weather Icon"/>
                  <div className="temp_div">
                    <h2>{data.current.temp_c}°C</h2>
                  </div>
                </div>
                <div className="container_content">
                  <h2>{data.location.name}, {data.location.country}</h2>
                  <p>Condition: {data.current.condition.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <img
              className="icon_img"
              src="https://icons.iconarchive.com/icons/papirus-team/papirus-apps/512/weather-icon.png"
              alt=""
              height="300px"
              width="auto"
            />
            <div className="container_content">
              <h1>Weather Forecast</h1>
              <button>Get Start</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
