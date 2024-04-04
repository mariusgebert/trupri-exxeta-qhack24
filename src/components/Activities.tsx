import { User } from 'firebase/auth';
import { db } from '../utils/firebase';
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
import { useNavigate } from 'react-router-dom';

type HomeProps = {
  user: User;
};

function Activities({ user }: HomeProps) {
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

  /*const addEntry = async () => {
    const colRef = collection(db, 'entries');
    await addDoc(colRef, {
      userId: user.uid,
      amount: parseFloat(amountInput),
      createdAt: serverTimestamp(),
    });

    setAmountInput('');
  };*/

  return (
    <div className='bg-gray-100 flex-1 pb-24'>
      <div className='w-full bg-emerald-900 rounded-b-3xl px-4 py-4 text-white text-center flex justify-between items-center z-10 relative'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          onClick={() => navigate(-1)}
          className='w-6 h-6 '
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M15.75 19.5 8.25 12l7.5-7.5'
          />
        </svg>
        <p className='w-10/12 m-auto flex-1 font-bold'>All activities</p>
      </div>

      <div className='px-2'>
        <p className='font-bold mt-4 mb-2 mr-2'>Your latest entries</p>
        {fetchedEntries.map((entry: any) => (
          <div
            onClick={() => navigate('/product')}
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
                  <p className='text-xs text-gray-500'>
                    {entry.createdAt.toDate().toLocaleDateString('de-DE', {
                      year: '2-digit',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
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
      </div>
    </div>
  );
}

export default Activities;
