import { Scanner } from '@yudiel/react-qr-scanner';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  where,
  query,
  serverTimestamp,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { User } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { gramsToKilograms, mltoLiter } from '../utils/converter';
import { IoMdWater } from 'react-icons/io';
import { FaBottleWater, FaCloud } from 'react-icons/fa6';
type Props = {
  user: User;
  userData: { name: string };
};

type ProductType = {
  id: string;
  name: string;
  carbon: number;
  water: number;
  waste: number;
  score: number;
  photo: string;
};

function ScanProduct({ user, userData }: Props) {
  const [scannedId, setScannedId] = useState(''); //9008700143035 für saft
  const [amount, setAmount] = useState(1);
  //const [logged, setLogged] = useState(true);
  const [fetechedResult, setFetechedResult] = useState<
    ProductType | 'error' | null
  >(null);
  const [suggestedProducts, setSuggestedProducts] = useState<any>(null);

  const navigate = useNavigate();

  const getProduct = async () => {
    if (scannedId.length > 3) {
      const docRef = doc(db, 'products', scannedId);
      const d = await getDoc(docRef);
      if (d.exists()) {
        //@ts-ignore
        setFetechedResult({ id: d.id, ...d.data() });
        const colRef = collection(db, 'products');

        //Produkte aus der gleichen Kategorie fetchen, sobald ich Produkt-Daten haben, um ähnliche Produkte vorschläge zu können
        const q = query(
          colRef,
          where('category', '==', d.data().category || ''),
          orderBy('score', 'desc')
        );
        const snap = await getDocs(q);
        const results: any = [];
        snap.forEach((doc) => {
          //@ts-ignore
          if (doc.id == d.id) return;
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setSuggestedProducts(results);
      } else {
        setFetechedResult('error');
      }
    }
  };

  const logProduct = async () => {
    //Erstelle einen neuen Eintrag für "konsumierte" Produkte
    if (!fetechedResult || fetechedResult == 'error') return;
    const colRef = collection(db, 'entries');
    await addDoc(colRef, {
      userId: user.uid,
      carbon: fetechedResult.carbon * amount,
      water: fetechedResult.water * amount,
      waste: fetechedResult.waste * amount,
      score: fetechedResult.score * amount,
      name: fetechedResult.name,
      photo: fetechedResult.photo,
      productId: fetechedResult.id,
      username: userData.name,
      amount: amount,
      createdAt: serverTimestamp(),
    });
    navigate('/');
  };

  useEffect(() => {
    getProduct();
  }, [scannedId]);

  return (
    <div className='bg-gray-100 flex-1 flex flex-col justify-start items-center'>
      <div className='w-full h-12 flex flex-col flex-1'>
        {!(scannedId.length > 0) && (
          <>
            <div className='h-32 z-30 bg-emerald-900 rounded-b-3xl px-4 py-4 text-white text-center'>
              <div className='flex items-center justify-center relative'>
                <h1 className='text-white font-bold text-xl'>Retailers</h1>
              </div>
              <p className='text-white/70 text-sm mt-4'>
                Find sustainable and local retailers <br /> in your neighborhood
              </p>
            </div>
            <div className=''>
              <Scanner
                styles={{
                  container: { border: '1px solid red' },
                  video: { border: '1px solid green' },
                  finderBorder: 6,
                }}
                onResult={(_, result) => setScannedId(result.toString())}
                onError={(error) => console.log(error?.message)}
              />
              <Link
                to='/'
                className='mt-6 font-semibold block text-center underline'
              >
                Back to Home
              </Link>
            </div>
          </>
        )}

        {fetechedResult && fetechedResult != 'error' && (
          <div className='px-2 flex-1 flex flex-col pb-4 pt-4'>
            <p className='font-bold mb-2 text-2xl'>Found product!</p>
            <div className=' bg-gray-200 border-emerald-600 border-2 p-3 rounded-md mb-3 '>
              <div className='flex justify-between items-center'>
                <div className='flex'>
                  <div
                    className='w-12 h-12 bg-cover bg-center'
                    style={{
                      backgroundImage: `url(${
                        fetechedResult.photo ||
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Corona_Extra_beer_bottle_%282019%29.png/326px-Corona_Extra_beer_bottle_%282019%29.png'
                      }`,
                    }}
                  ></div>

                  <div className='ml-4'>
                    <p className=' font-bold'>{fetechedResult.name}</p>
                    <div className='text-xs text-gray-500 flex gap-1'>
                      <div className='flex items-center justify-center gap-1'>
                        <FaCloud />
                        <p>{gramsToKilograms(fetechedResult.carbon)}</p>
                      </div>
                      <div className='flex items-center justify-center gap-1'>
                        <FaBottleWater />
                        <p>{gramsToKilograms(fetechedResult.waste)}</p>
                      </div>
                      <div className='flex items-center justify-center gap-1'>
                        <IoMdWater />
                        <p>{mltoLiter(fetechedResult.water)}</p>
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
                  <p className='text-sm font-bold mt-1'>
                    {fetechedResult.score}
                  </p>
                </div>
              </div>
            </div>
            <p className='font-bold mb-2 mt-4 text-lg'>
              Find Sustainable alternatives
            </p>
            <div className='flex overflow-x-auto space-x-4'>
              {suggestedProducts?.map((pr: any) => (
                <div className='flex-none w-60 h-24'>
                  <div className='border bg-gray-100 border-gray-400 p-2 rounded-md mb-3 h-full'>
                    <div className='flex justify-between items-center'>
                      <div className='flex'>
                        <div
                          className='w-12 h-20 bg-r bg-cover bg-center'
                          style={{
                            backgroundImage: `url(${
                              pr.photo ||
                              'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Corona_Extra_beer_bottle_%282019%29.png/326px-Corona_Extra_beer_bottle_%282019%29.png'
                            }`,
                          }}
                        ></div>

                        <div className='ml-4'>
                          <p className=' font-bold text-sm'>{pr.name}</p>
                          <div className='flex justify-start mt-2'>
                            <div className='flex bg-emerald-900 rounded-full text-white justify-start items-center'>
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
                              <p className='mx-2 text-sm font-bold'>
                                {pr.score}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex items-center justify-center mt-auto border border-black mb-4 rounded-lg'>
              <div className='flex items-center gap-4 my-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-12 h-12'
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                >
                  <path
                    fill-rule='evenodd'
                    d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z'
                    clip-rule='evenodd'
                  />
                </svg>

                <div className='font-bold text-xl'>{amount}</div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-12 h-12'
                  onClick={() => setAmount(amount + 1)}
                >
                  <path
                    fill-rule='evenodd'
                    d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z'
                    clip-rule='evenodd'
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={logProduct}
              className='bg-emerald-900 w-full text-white font-bold rounded-lg py-3'
            >
              Log Now ({amount * fetechedResult.score}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-4 h-4 p-[3px] mb-[2px] ml-1 text-white bg-yellow-600 rounded-full inline-block'
              >
                <path
                  fill-rule='evenodd'
                  d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                  clip-rule='evenodd'
                />
              </svg>
              )
            </button>
            <div className='flex items-center text-gray-500 justify-center mt-3 gap-1'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className='w-4 h-4'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z'
                />
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z'
                />
              </svg>
              <p
                className='text-sm '
                onClick={() => {
                  setFetechedResult(null);
                  setScannedId('');
                }}
              >
                Scan again
              </p>
            </div>
          </div>
        )}
        {fetechedResult && fetechedResult == 'error' && (
          <div className='flex flex-col justify-start items-center flex-1 gap-4'>
            <div className='w-full bg-emerald-900 rounded-b-3xl px-4 py-4 text-white text-center flex justify-between items-center z-10 relative'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                onClick={() => navigate('/')}
                className='w-6 h-6 '
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M15.75 19.5 8.25 12l7.5-7.5'
                />
              </svg>
              <p className='w-10/12 m-auto flex-1 font-bold'>
                Produktname mit einem ganz langen Namen
              </p>
            </div>
            <p className='font-bold text-xl mt-12'>
              You've found a new product✅!
            </p>
            <p className='bg-emerald-900 px-4 py-2 font-bold text-white rounded-lg'>
              Add product to database
            </p>
            <div className='flex items-center text-gray-500 justify-center mt-3 gap-1'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className='w-4 h-4'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z'
                />
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z'
                />
              </svg>
              <p
                className='text-sm '
                onClick={() => {
                  setFetechedResult(null);
                  setScannedId('');
                }}
              >
                Scan again
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScanProduct;
