import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FaCloud, FaLeaf } from 'react-icons/fa';
import { FaBottleWater, FaBowlRice } from 'react-icons/fa6';
import { GiPalmTree } from 'react-icons/gi';
import { IoMdWater } from 'react-icons/io';
import { TbMeatOff } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../utils/firebase';
import { gramsToKilograms, mltoLiter } from '../utils/converter';

function Product() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [productData, setProductData] = useState<any>(null);

  const getProductData = async () => {
    if (!productId) return;
    const docRef = doc(db, 'products', productId);
    const res = await getDoc(docRef);
    if (res.exists()) {
      console.log(res.data());
      setProductData({ ...res.data() });
    }
  };

  useEffect(() => {
    getProductData();
  }, [productId]);

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
        <p className='w-10/12 m-auto flex-1 font-bold'>{productData?.name}</p>
      </div>
      <div className='bg-gray-400 h-64 flex items-center justify-center pt-10 pb-2 -mt-8 z-0'>
        <img
          className='h-full'
          src={
            productData?.photo ||
            'https://www.yfood.eu/cdn/shop/products/yfood-drink-classic-choco-500ml-DE-PG-2500px-srgb-ws_9589b3da-2821-4982-a38c-7afd39183c70.png?v=1630450771&width=1920'
          }
        />
      </div>
      <div className='mx-2 mt-4'>
        <div className='flex mb-6'>
          <div className='flex items-center gap-2 bg-emerald-900 rounded-full text-white pr-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-10 h-10 p-[9px] text-white bg-yellow-600 rounded-full'
            >
              <path
                fill-rule='evenodd'
                d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                clip-rule='evenodd'
              />
            </svg>
            <p className='text-md font-bold'>
              {productData?.score} Climate Points
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-red-400 rounded-full'></div>
          <p>processing level: {productData?.processedLevel}</p>
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <FaBowlRice />
          <p>{productData?.ingredients} different ingredients</p>
        </div>
      </div>
      <div className='mx-2 mt-6 '>
        <p className='font-bold text-black'>environmental impact</p>
        <div className='flex items-center gap-2'>
          <IoMdWater />
          <p>{mltoLiter(productData?.water)}</p>
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <FaBottleWater />
          <p>{gramsToKilograms(productData?.waste)}</p>
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <FaCloud />
          <p>{gramsToKilograms(productData?.carbon)}</p>
        </div>
      </div>
      <div className='mx-2 mt-6 text-green-600'>
        <p className='font-bold text-black'>analysis of ingredients</p>
        <div className='flex items-center gap-2'>
          <FaLeaf />
          <p>vegan </p>
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <GiPalmTree />
          <p>palm oil free</p>
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <TbMeatOff />
          <p>vegetarian</p>
        </div>
      </div>
    </div>
  );
}

export default Product;
