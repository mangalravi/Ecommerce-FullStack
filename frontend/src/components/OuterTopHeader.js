import React from 'react'
import { Link } from 'react-router-dom'

const OuterTopHeader = () => {
  return (
   <div className="bg-[#BB0100] text-[#fff] p-[0.75rem] text-center font-bold text-[1rem]">
        MARKDOWNS: UP TO 70% OFF
        <Link to="/product" className="underline">
          SHOP NOW
        </Link>
      </div>
  )
}

export default OuterTopHeader