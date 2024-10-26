import React from 'react'
import Nav from '@/components/navbar/nav'
import FormComp from '@/components/main/formcomp'
import Card from '@/components/main/card'
export default function page() {
    return (
        <div>
            <Nav />
            <div className='flex justify-center '>
                <div className='w-full  mx-10 rounded-lg mt-16 flex  justify-between bg-neutral-700	  p-4 '>

                    <FormComp />
                    <Card />
                </div></div>
        </div>
    )
}


