import { User, signOut } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { IoMdWater } from 'react-icons/io';
import { FaCloud } from 'react-icons/fa';
import { FaBottleWater } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import {
  Timestamp,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { gramsToKilograms, mltoLiter } from '../utils/converter';
import { Link, useNavigate } from 'react-router-dom';

type HomeProps = {
  user: User;
};

function Home({ user }: HomeProps) {
  const [fetchedEntries, setFetchedEntries] = useState<
    {
      id: string;
      amount: number;
      userId: string;
      createdAt: Timestamp;
      carbon: number;
    }[]
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    const colRef = collection(db, 'entries');
    const q = query(
      colRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const un = onSnapshot(q, (snap) => {
      const entries = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // @ts-ignore
      setFetchedEntries(entries);
    });

    return () => {
      un;
    };
  }, [user.uid]);

  const handleLogout = () => {
    if (confirm('Möchtest du dich ausloggen?')) signOut(auth);
  };

  return (
    <div className='bg-gray-100 flex-1 pb-28'>
      <div className='w-full bg-emerald-900 rounded-b-3xl px-4 py-4 text-white text-center'>
        <div className='flex items-center justify-center relative'>
          <h1 className='text-white font-bold text-xl'>Home</h1>
          <img
            onClick={handleLogout}
            className='rounded-full w-8 h-8 border border-white absolute right-0 top-1/2 -translate-y-1/2'
            src={
              user.photoURL ||
              'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg'
            }
          />
        </div>
        <p className='text-white/70 text-lg mt-4'>
          My carbon footprint this month
        </p>
        <p className='text-5xl font-black mt-4'>
          {fetchedEntries &&
            gramsToKilograms(
              fetchedEntries.reduce((acc, curr) => acc + curr.carbon, 0)
            )}
        </p>
        <div className='h-[6px] rounded-full w-8/12 relative m-auto bg-white/60 mt-6'>
          <div
            className={`h-full bg-white rounded-full`}
            style={{
              width: `${
                fetchedEntries.reduce((acc, curr) => acc + curr.carbon, 0) /
                1620
              }%`,
            }}
          ></div>
        </div>
        <p className='text-xs mt-2 text-white/70'>
          {(
            fetchedEntries.reduce((acc, curr) => acc + curr.carbon, 0) / 1620
          ).toLocaleString('de-DE', { maximumFractionDigits: 1 })}
          &nbsp;% of this month limit
        </p>
      </div>

      <div className='px-2'>
        <p className='font-bold mt-4 mb-2 mr-2'>Your latest entries</p>
        {fetchedEntries.slice(0, 3).map((entry: any) => (
          <div
            onClick={() => navigate('/product/' + (entry.productId || null))}
            className='border bg-gray-200 border-gray-400 p-3 rounded-md mb-3 '
          >
            <div className='flex justify-between items-center'>
              <div className='flex'>
                <div
                  className='w-12 h-12 bg-cover bg-center'
                  style={{
                    backgroundImage: `url(${
                      entry.photo ||
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Corona_Extra_beer_bottle_%282019%29.png/326px-Corona_Extra_beer_bottle_%282019%29.png'
                    }`,
                  }}
                ></div>

                <div className='ml-4'>
                  <p className=' font-bold'>
                    {entry.amount && entry.amount > 1 && entry.amount + 'x '}
                    {entry.name}
                  </p>
                  <div className='text-xs text-gray-500 flex gap-1'>
                    <div className='flex items-center justify-center gap-1'>
                      <FaCloud />
                      <p>{gramsToKilograms(entry.carbon)}</p>
                    </div>
                    <div className='flex items-center justify-center gap-1'>
                      <FaBottleWater />
                      <p>{gramsToKilograms(entry.waste)}</p>
                    </div>
                    <div className='flex items-center justify-center gap-1'>
                      <IoMdWater />
                      <p>{mltoLiter(entry.water)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-7 h-7 p-[5px] text-white bg-yellow-600 rounded-full'
                >
                  <path
                    fill-rule='evenodd'
                    d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                    clip-rule='evenodd'
                  />
                </svg>
                <p className='text-sm font-bold mt-1'>{entry.score}</p>
              </div>
            </div>
          </div>
        ))}
        {fetchedEntries.length > 3 && (
          <Link
            to='/activities'
            className='text-center text-gray-500 underline text-sm mt-2 block'
          >
            Show all activities
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;
