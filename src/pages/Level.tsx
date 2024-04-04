import { User } from 'firebase/auth';
import { db } from '../utils/firebase';
import { useEffect, useState } from 'react';
import {
  Timestamp,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

type HomeProps = {
  user: User;
};

function Level({ user }: HomeProps) {
  const [fetchedEntries, setFetchedEntries] = useState<
    {
      id: string;
      amount: number;
      userId: string;
      createdAt: Timestamp;
      carbon: number;
    }[]
  >([]);

  const totalPoints =
    fetchedEntries?.reduce((acc, curr: any) => acc + curr.score, 0) || 0;

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
      <div className='w-full bg-emerald-900 rounded-b-3xl px-4 py-4 text-white text-center'>
        <p className='font-bold text-xl'>Challenges</p>
        <p className='text-white/70 text-xl mt-4 '>My Climate Points</p>
        <p className=' text-5xl font-black my-4 flex items-center justify-center gap-2'>
          {totalPoints}
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
        </p>
      </div>
      <div className='px-2 pt-2'>
        <p className='text-center text-sm text-gray-500 my-2 mb-4'>
          Face your personal Climate Challenge and complete the individual
          challenges and collect Climate Points to unlock higher levels
        </p>
        {[10, 200, 300, 400, 500, 600, 700].map((l, i) => (
          <div
            className={
              'border bg-gray-200 border-gray-400 p-3 rounded-md mb-3 flex gap-4 items-center mb-4 ' +
              (totalPoints < l && 'opacity-50')
            }
          >
            {totalPoints < l ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-6 h-6'
              >
                <path
                  fill-rule='evenodd'
                  d='M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z'
                  clip-rule='evenodd'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className={'w-6 h-6 text-yellow-600'}
              >
                <path d='M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z' />
              </svg>
            )}
            <p className='flex-1 font-semibold'>Level {i + 1} </p>
            <div className='bg-emerald-900 text-white flex gap-2 items-center p-1 px-2 rounded-md'>
              <p>
                {totalPoints} / {l}
              </p>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-6 h-6 p-[4px] text-white bg-yellow-600 rounded-full'
              >
                <path
                  fill-rule='evenodd'
                  d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                  clip-rule='evenodd'
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Level;
