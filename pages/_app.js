import Link from 'next/link'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return(
    <div>
      <nav className='border-b'>
       <div className='p-6'>
          <Link href="/">
            <a className='text-pink-500 p-6'>Home</a>
          </Link>
          <Link href="/register">
            <a className='text-pink-500 p-6'>Register</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
  
  
}

export default MyApp
