import './App.css';
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth, db } from './utils/firebase';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScanProduct from './components/ScanProduct';
import Stats from './pages/Stats';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import Navigation from './components/Navigation';
import Level from './pages/Level';
import Map from './pages/Map';
import Product from './components/Product';
import { Player } from '@lottiefiles/react-lottie-player';
import Earth from './earth.json';
import Activities from './components/Activities';

function App() {
  const [user, setUser] = useState<null | User>(null);
  const [userData, setuserData] = useState<any>(null);
  const [userNameInput, setUserNameInput] = useState('');
  const [userNameModalOpen, setUserNameModalOpen] = useState(false);

  const getUserData = async () => {
    if (user?.uid) {
      const docRef = doc(db, 'users', user.uid);
      //Prüft ob in der öffentlichen Collection der DB ein username für den aktuellen User hinterlegt ist und erstellt ggf einen username
      await onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          setuserData(snap.data());
          setUserNameModalOpen(false);
        } else {
          setUserName();
        }
      });
    }
  };

  const setUserName = async () => {
    if (!user) return null;
    const docRef = doc(db, 'users', user.uid);
    //generiert einen zufälligen usernamen, damit man die app möglichst schnell nutzen kann -> Für den Pitch
    let genName = 'user-';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 3; i++) {
      genName += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    await setDoc(docRef, { name: genName });
    alert('your default username is: ' + genName);
  };

  const handleAnonymousLogin = async () => {
    await signInAnonymously(auth);
  };

  useEffect(() => {
    getUserData();
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <Router>
      <div className=' bg-gray-200 min-h-dvh flex flex-col items-center justify-center'>
        <div className='flex  flex-col justify-center w-full max-w-[450px] bg-red-100 flex-1'>
          {userNameModalOpen && (
            <div className='absolute inset-0 bg-white/90 z-20 text-black flex flex-col items-center justify-center'>
              <input
                className='border border-black'
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
              />
              <button onClick={setUserName}>Username festlegen</button>
            </div>
          )}
          {user ? (
            <>
              <Routes>
                <Route
                  path='/add'
                  element={<ScanProduct user={user} userData={userData} />}
                />
                <Route path='/stats' element={<Stats user={user} />} />
                <Route path='/map' element={<Map />} />
                <Route path='/level' element={<Level user={user} />} />
                <Route
                  path='/activities'
                  element={<Activities user={user} />}
                />
                <Route path='/product/:productId' element={<Product />} />
                <Route path='/' element={<Home user={user} />} />
              </Routes>
              <Navigation />
            </>
          ) : (
            <div className='mx-2 flex flex-col'>
              <p className='text-center font-black text-emerald-800 text-3xl'>
                trupri
              </p>
              <p className='text-center text-emerald-900'>
                Track your carbon footprint, find sustainable products and have
                an impact
              </p>
              <div className='w-full'>
                <Player src={Earth} autoplay loop></Player>
              </div>
              <button
                onClick={handleLogin}
                className=' bg-green-950 text-white p-2 rounded-lg flex items-center justify-center gap-4'
              >
                <img
                  className='w-8 h-8'
                  src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png'
                />
                <p>Login with Google</p>
              </button>
              <button
                onClick={handleAnonymousLogin}
                className=' bg-green-950 text-white p-2 rounded-lg mt-4'
              >
                Continue as anonymous user
              </button>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
