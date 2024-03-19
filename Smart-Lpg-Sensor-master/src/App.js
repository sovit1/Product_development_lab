import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db, auth } from './config/firebase-config';
import { getDatabase, ref, get } from "firebase/database";
import { getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { app } from './config/firebase-config';
import pic from './Logo.png'

function App({ history }) {
  const [readings, setReadings] = useState([]);
  const [user, setUser] = useState(null);
  const [array, setArray] = useState([]);

  // Fetches PPM data from Realtime Database and updates the array state
  const fetchData = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "PPM");

    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        setArray(Object.values(snapshot.val()));
        console.log("Data available at PPM location:", snapshot.val());
      } else {
        console.log("No data available at PPM location");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetches sensor readings from Firestore when a user is authenticated
  useEffect(() => {
    if (user) {
      const getdata = async () => {
        try {
          const data = await getDocs(collection(db, "Sensor Data"));
          const filteredData = data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReadings(filteredData);
        } catch (error) {
          console.log(error);
        }
      };
      getdata();
    }
  }, [user]);

  // Listens for authentication state changes and updates user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      history.push('/auth'); // Redirect to the authentication page
    } catch (error) {
      console.log("Error signing out:", error.message);
    }
  };

  // Fetch data automatically on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      {user ? (
        <div className="dashboardContent">
          <div className='navbar'>
          <nav className="navigation-bar">
            <ul className="nav-list">
              <img classname="logo" src={pic} alt='logo'></img>
              <li className="nav-item"><a href="#" className="nav-link">Home</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Help</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Stats</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Contacts</a></li>
            </ul>
            <div className="nav-right">
             
              <button className="fetchDataBtn" onClick={fetchData}>Fetch Data</button>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          </nav> 
          </div>
         <div className='content'>
         
          
       
         {readings.map((reading) => (
    <div key={reading.id} className='userData'>
      <h1 className='userId'>{reading.id}</h1>
      <div className='dataCircles'>
        <div className='realData'>{array}</div>
        <div className='valueCircle'>
          
          <h2 className='ppmValue'>{reading.PPM}</h2>
        </div>
      </div>
    </div>
  ))}
        </div> </div>
          
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
