// @ts-ignore
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaCloud } from 'react-icons/fa';
import { FaBottleWater } from 'react-icons/fa6';
import { IoMdWater } from 'react-icons/io';

//Todo fetch from database, für MVP aber unwichtig
const locationsData = [
  {
    name: 'Inges Ingwerladen',
    adress: 'Ratsfeld, 10',
    location: [49.566, 8.51],
    offers: [
      {
        photo:
          'https://www.mein-schoener-garten.de/sites/default/files/styles/discover_16x9/public/2022-02/wirsing-gruenkohl-870810512-istock.jpg?h=c029297a&itok=azevOIkt',
        name: 'Grünkohl',
        score: 50,
        carbon: 200,
        waste: 200,
        water: 200,
        price: '4,03 €',
      },
    ],
  },
  {
    name: 'Inges Ingwerladen 2',
    adress: 'Ratsfeld, 10',
    location: [49.566, 8.61],
    offers: [
      {
        photo:
          'https://www.mein-schoener-garten.de/sites/default/files/styles/discover_16x9/public/2022-02/wirsing-gruenkohl-870810512-istock.jpg?h=c029297a&itok=azevOIkt',
        name: 'Grünkohl',
        score: 50,
        carbon: 200,
        waste: 200,
        water: 200,
        price: '4,03 €',
      },
    ],
  },
  {
    name: 'Inges Ingwerladen 3',
    adress: 'Ratsfeld, 10',
    location: [49.466, 8.51],
    offers: [
      {
        photo:
          'https://www.mein-schoener-garten.de/sites/default/files/styles/discover_16x9/public/2022-02/wirsing-gruenkohl-870810512-istock.jpg?h=c029297a&itok=azevOIkt',
        name: 'Grünkohl',
        score: 50,
        carbon: 200,
        waste: 200,
        water: 200,
        price: '4,03 €',
      },
    ],
  },
  {
    name: 'Inges Ingwerladen 4',
    adress: 'Ratsfeld, 10',
    location: [49.66, 8.51],
    offers: [
      {
        photo:
          'https://www.mein-schoener-garten.de/sites/default/files/styles/discover_16x9/public/2022-02/wirsing-gruenkohl-870810512-istock.jpg?h=c029297a&itok=azevOIkt',
        name: 'Grünkohl',
        score: 50,
        carbon: 200,
        waste: 200,
        water: 200,
        price: '4,03 €',
      },
    ],
  },
];

const center = [49.505, 8.5];

function Map() {
  const [clickedMarker, setClickedMarker] = useState<any>(false);
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const c = { center: center, zoom: 10 };

  return (
    <div className='bg-gray-100 flex-1 flex flex-col h-[100vh]'>
      <div className='absolute top-0 left-0 right-0 h-32 z-30 bg-emerald-900 rounded-b-3xl px-4 py-4 text-white text-center'>
        <div className='flex items-center justify-center relative'>
          <h1 className='text-white font-bold text-xl'>Retailers</h1>
        </div>
        <p className='text-white/70 text-sm mt-4'>
          Find sustainable and local retailers <br /> in your neighborhood
        </p>
      </div>
      {true && (
        <div className=' flex-1 w-full h-[80vh]'>
          <MapContainer
            style={{ position: 'absolute', inset: 0, zIndex: 0 }}
            {...c}
          >
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
            {locationsData.map((loc) => (
              <Circle
                radius={600}
                center={loc.location}
                pathOptions={{
                  color: '#005114', // Linienfarbe
                  fillColor: '#005114', // Füllfarbe
                }}
                eventHandlers={{ click: () => setClickedMarker(loc) }}
              />
            ))}
          </MapContainer>
        </div>
      )}
      {clickedMarker && (
        <div className='fixed bottom-0 left-0 right-0  z-50 bg-white rounded-t-lg shadow-xl pt-4 px-2 min-h-28 max-h-[90svh] overflow-y-scroll'>
          <div className='flex justify-between items-center'>
            <div>
              <p className='font-bold text-xl'>{clickedMarker.name}</p>
              <p className='text-gray-600 text-sm'>{clickedMarker.adress}</p>
            </div>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              onClick={() => setClickedMarker(false)}
              className='w-10 h-10 p-2'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M6 18 18 6M6 6l12 12'
              />
            </svg>
          </div>
          <div className='flex items-end justify-around mt-8'>
            <div className='flex flex-col items-center justify-center'>
              <img
                className='w-12'
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Bio-Siegel-EG-%C3%96ko-VO-Deutschland.svg/2560px-Bio-Siegel-EG-%C3%96ko-VO-Deutschland.svg.png'
              />
              <p className='mt-2 text-xs font-medium text-gray-600 text-center'>
                BIO-certified
              </p>
            </div>
            <div className='flex flex-col items-center justify-center'>
              <img
                className='w-12'
                src='https://cdn.coffeecircle.com/26ed8c11-3b2d-4f94-8631-de89b7fe9d9d/-/resize/800x/-/quality/lighter/-/progressive/yes/-/format/auto/fairtradelogo.png'
              />
              <p className='mt-2 text-xs font-medium text-gray-600 text-center'>
                FAIRTRADE
              </p>
            </div>
            <div className='flex flex-col items-center justify-center'>
              <img
                className='w-12'
                src='https://upload.wikimedia.org/wikipedia/commons/b/b5/Blauer-Engel-Logo.png'
              />
              <p className='mt-2 text-xs font-medium text-gray-600 text-center'>
                Blauer Engel
              </p>
            </div>
          </div>
          <div className='bg-black/40 h-[1px] w-full my-4' />
          <p className='font-bold mb-2 text-lg'>Latest offers</p>
          {clickedMarker.offers.map((offer: any) => (
            <div className='border bg-gray-200 border-gray-400 p-3 rounded-md mb-3 '>
              <div className='flex justify-between items-center'>
                <div className='flex'>
                  <div
                    className='w-12 h-12 bg-cover bg-center'
                    style={{
                      backgroundImage: `url(${offer.photo}`,
                    }}
                  ></div>

                  <div className='ml-4'>
                    <p className=' font-bold flex items-center'>
                      {offer.name} ( {offer.score}&nbsp;
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='w-4 h-4 p-[3px]  text-white bg-yellow-600 rounded-full'
                      >
                        <path
                          fill-rule='evenodd'
                          d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                          clip-rule='evenodd'
                        />
                      </svg>
                      )
                    </p>
                    <div className='text-xs text-gray-500 flex gap-1'>
                      <div className='flex items-center justify-center gap-1'>
                        <FaCloud />
                        <p>{offer.carbon}g</p>
                      </div>
                      <div className='flex items-center justify-center gap-1'>
                        <FaBottleWater />
                        <p>{offer.waste}g</p>
                      </div>
                      <div className='flex items-center justify-center gap-1'>
                        <IoMdWater />
                        <p>{offer.water}l</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col justify-center items-center text-emerald-900 font-black text-lg'>
                  {offer.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Map;
