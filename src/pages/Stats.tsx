import { User } from 'firebase/auth';
import { db } from '../utils/firebase';
import { useEffect, useState } from 'react';
import {
  Timestamp,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  ReferenceLine,
  XAxis,
  Cell,
} from 'recharts';

const renderEarth = (percentage: number) => (
  <div className='w-full aspect-square relative flex flex-col justify-center items-center mt-4'>
    <div
      className='pie w-full aspect-square rounded-full z-10'
      style={{
        backgroundImage: `conic-gradient(transparent ${percentage}%, #b0d5c1 0%, #b0d5c1 100%)`,
      }}
    ></div>
    <img
      className='w-24 absolute inset-0'
      src={
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere_transparent_background.png/1200px-Earth_Western_Hemisphere_transparent_background.png'
      }
    />
  </div>
);

type HomeProps = {
  user: User;
};

function Stats({ user }: HomeProps) {
  const [fetchedEntries, setFetchedEntries] = useState<
    {
      id: string;
      amount: number;
      userId: string;
      createdAt: Timestamp;
      carbon: number;
    }[]
  >([]);
  const [stats, setStats] = useState();
  const [tab, setTab] = useState(0);
  const [days, setDays] = useState(1);

  useEffect(() => {
    const colRef = collection(db, 'entries');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const un = onSnapshot(q, (snap) => {
      const entries = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const stats: any = {};

      //Map, bei der jeder Nutzer ein Key ist und sein score addiert wird ->
      //ggf.in Späterer Implementation dann über Cloud Function, falls Datensätze groß werden oder dadurch persönliche Daten
      //gefährdet werden könnten,
      entries.forEach((entry: any) => {
        if (stats[entry.userId]) {
          stats[entry.userId].score += entry.score || 0;
        } else {
          stats[entry.userId] = {
            score: entry.score,
            username: entry.username,
          };
        }
      });
      //@ts-ignore
      const firstDay = entries[0].createdAt.toDate();
      //@ts-ignore
      const lastDay = entries[entries.length - 1].createdAt.toDate();
      const days = Math.ceil((lastDay - firstDay) / (1000 * 60 * 60 * 24)) + 1;
      setDays(days);
      setStats(stats);
      // @ts-ignore
      setFetchedEntries(entries);
    });

    return () => {
      un;
    };
  }, [user.uid]);

  const isDemo = user.uid == 'cYTUYegpFqU0LDF1jiltw0kwj0h1'; //for presentation purpose only

  const data = [
    {
      name: 'Nov 23',
      carbon: isDemo ? 8310 : 0,
    },
    {
      name: 'Dec 23',
      carbon: isDemo ? 6492 : 0,
    },
    {
      name: 'Jan 24',
      carbon: isDemo ? 4902 : 0,
    },
    {
      name: 'Feb 24',
      carbon: isDemo ? 9347 : 0,
    },
    {
      name: 'Mar 24',
      carbon: isDemo ? 2783 : 0,
    },
    {
      name: 'Apr 24',
      carbon: fetchedEntries.reduce(
        (acc, curr) => acc + (curr.userId == user.uid ? curr.carbon : 0),
        0
      ),
    },
  ];

  const neededEarths =
    fetchedEntries.reduce(
      (acc, curr) => acc + (curr.userId == user.uid ? curr.carbon : 0),
      0
    ) /
    (days * 5470);

  //Anzeigen von n erden als Visualisierung
  function renderElements(count: number) {
    const fullCount = Math.floor(count); // Ganzzahlteil für volle Elemente
    const partialValue = count - fullCount; // Dezimalteil für die Größe des letzten Elements

    const elements = [];

    // Volle Elemente rendern
    for (let i = 0; i < fullCount; i++) {
      elements.push(renderEarth(100)); // renderEarth mit Größe 100
    }

    // Letztes Element basierend auf dem Dezimalteil rendern, falls vorhanden
    if (partialValue > 0) {
      // Umrechnung des Dezimalteils in eine tatsächliche Größe, z.B. 0,7 zu 70
      const partialSize = partialValue * 100;
      elements.push(renderEarth(partialSize));
    }

    return elements;
  }

  return (
    <div className='bg-gray-100 flex-1 flex flex-col'>
      <div className='w-full bg-emerald-900 rounded-b-3xl px-4 py-4 text-white text-center'>
        <p className='font-bold text-2xl'>Statistics</p>
        <div className='bg-white/40 p-1 w-full rounded-lg flex items-center mt-4 mb-2 relative'>
          <div
            className={
              'absolute top-1 bottom-1  rounded-lg bg-white z-0 transition-all' +
              (tab == 0 ? ' left-1 right-1/2' : ' left-1/2 right-1')
            }
          ></div>
          <div
            className='flex-1  text-black p-1 rounded-lg flex items-center gap-2  justify-center cursor-pointer z-10'
            onClick={() => setTab(0)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              className='w-5 h-5'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
              />
            </svg>
            My Stats
          </div>
          <div
            className='flex-1  text-black p-1 rounded-lg flex items-center gap-2 justify-center cursor-pointer z-10'
            onClick={() => setTab(1)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              className=' w-5 h-5'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z'
              />
            </svg>
            Community
          </div>
        </div>
      </div>
      <div className='w-full flex-1  relative overflow-x-hidden '>
        <div
          className={
            'absolute left-0 top-0 right-0  transition-all ' +
            (tab == 0 ? 'translate-x-0' : '-translate-x-full')
          }
        >
          <div className='pb-24'>
            <p className='mx-2 mt-4 font-bold text-2xl'>
              Your carbon footprint in the last 6 months:
            </p>
            <div className='w-full mt-4'>
              <ResponsiveContainer width='100%' height={150}>
                <BarChart width={800} height={20} data={data}>
                  <XAxis dataKey='name' />
                  <Bar dataKey='carbon' radius={5}>
                    {data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === data.length - 1 ? '#8acebb' : '#064e3b'}
                      />
                    ))}
                  </Bar>
                  <ReferenceLine
                    y={1500}
                    stroke='#ca8a04'
                    strokeDasharray='3 3'
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className='mx-2 mt-8 bg-[#b0d5c1] rounded-lg py-4 px-4'>
              <p className='text-sm'>
                If every person in the world produced the same emissions as you,
                we would need:
              </p>
              <p className='text-3xl font-black mt-8 mb-4'>
                {neededEarths.toLocaleString('de-DE', {
                  maximumFractionDigits: 2,
                })}{' '}
                earths
              </p>
              <div className='grid grid-cols-4 gap-2  items-center justify-center'>
                {renderElements(neededEarths)}
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            ' absolute inset-0  transition-all  flex flex-col ' +
            (tab == 0 ? 'translate-x-full' : 'translate-x-0')
          }
        >
          <div className='pb-24'>
            <div className='pb-4'>
              <p className='mx-2 mt-4 font-bold text-lg'>
                Leaderboard in Mannheim
              </p>
              {stats &&
                Object.values(stats)
                  .sort((a: any, b: any) => b.score - a.score)
                  .map((value: any) => (
                    <div key={value.username} className='relative mx-2'>
                      <div className='gap-4 relative mx-2 mt-2 flex items-center justify-between px-3 py-3 z-10'>
                        <p className=''>{value.username}</p>
                        <div className='flex flex-col justify-center items-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            fill='currentColor'
                            className='w-6 h-6 p-[5px] text-white bg-yellow-600 rounded-full'
                          >
                            <path
                              fill-rule='evenodd'
                              d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                              clipRule='evenodd'
                            />
                          </svg>
                          <p className='text-sm font-bold mt-1'>
                            {value.score}
                          </p>
                        </div>
                      </div>
                      <div className='h-full w-full bg-slate-300/50 absolute inset-0 z-0 border-emerald-900 border-4 rounded-lg' />
                    </div>
                  ))}
              <div className=' mx-2 mt-12'>
                <p className='text-sm mb-[4px] mt-4 font-semibold'>
                  Your footprint (projected for 1 year)
                </p>
                <div className='w-[80%] text-xs h-8 rounded-lg bg-emerald-800 flex justify-center items-center text-white font-medium'>
                  1,230kg CO2
                </div>
                <p className='text-sm mb-[4px] mt-4 font-semibold'>
                  German average
                </p>
                <div className='w-[30%] text-xs h-8 rounded-lg bg-emerald-800 flex justify-center items-center text-white font-medium'>
                  1,230kg CO2
                </div>
                <p className='text-sm mb-[4px] mt-4 font-semibold'>
                  worldwide average
                </p>
                <div className='w-[30%] text-xs h-8 rounded-lg bg-emerald-800 flex justify-center items-center text-white font-medium'>
                  1,230kg CO2
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
