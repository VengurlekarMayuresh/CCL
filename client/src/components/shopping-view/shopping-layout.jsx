import React from 'react'
import ShoppingHeader from './ShoppingHeader'
import { Outlet } from 'react-router-dom'

export default function ShoppingLayout() {
  return (
    <div className='flex flex-col bg-white overflow-hidden'>
      {/*Common Header*/ }
      <ShoppingHeader/>
      <div>
        <main className='flex flex-col w-full'><Outlet/></main>
      </div>
    </div>
  )
}
