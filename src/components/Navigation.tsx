import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const activeIndikator = () => (
    <div className='absolute left-4 right-4 bottom-[8px] h-[3px] rounded-full  bg-emerald-950'></div>
  );
  const activeClass =
    'w-14 h-14  text-emerald-950 rounded-full border-gray-100 flex justify-center items-center relative';

  const location = useLocation();
  if (
    location.pathname != '/add' &&
    location.pathname != '/product' &&
    location.pathname != '/activities'
  )
    return (
      <div className='px-2 fixed bottom-2 max-w-[450px] left-1/2 -translate-x-1/2 w-full'>
        <div className='flex items-center justify-around    rounded-full bg-yellow-600 py-2 shadow-xl'>
          <Link
            to='/'
            className={
              location.pathname == '/'
                ? activeClass
                : 'text-white w-14 h-14 flex justify-center items-center'
            }
          >
            {location.pathname == '/' && activeIndikator()}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-7 h-7'
            >
              <path d='M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z' />
              <path d='m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z' />
            </svg>
          </Link>
          <Link
            to='/stats'
            className={
              location.pathname == '/stats'
                ? activeClass
                : ' text-white w-14 h-14 flex justify-center items-center '
            }
          >
            {location.pathname == '/stats' && activeIndikator()}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-7 h-7'
            >
              <path d='M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z' />
            </svg>
          </Link>

          <Link to={'/add'} className={activeClass + ' bg-emerald-900'}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-7 h-7 text-white'
            >
              <path
                fill-rule='evenodd'
                d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z'
                clip-rule='evenodd'
              />
            </svg>
          </Link>

          <Link
            to='/map'
            className={
              location.pathname == '/map'
                ? activeClass
                : 'text-white w-14 h-14 flex justify-center items-center'
            }
          >
            {location.pathname == '/map' && activeIndikator()}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-7 h-7'
            >
              <path
                fill-rule='evenodd'
                d='M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z'
                clip-rule='evenodd'
              />
            </svg>
          </Link>

          <Link
            to='/level'
            className={
              location.pathname == '/level'
                ? activeClass
                : 'text-white w-14 h-14 flex justify-center items-center'
            }
          >
            {location.pathname == '/level' && activeIndikator()}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-7 h-7'
            >
              <path
                fill-rule='evenodd'
                d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                clip-rule='evenodd'
              />
            </svg>
          </Link>
        </div>
      </div>
    );
}

export default Navigation;
