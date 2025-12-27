"use client"
import React from 'react';
import { TypeAnimation } from 'react-type-animation';
interface IItem {
    // name: string,
    title: string,
    content: string,
    status: string
    // updateAt: string
}
const ItemNotification = (item: IItem) => {
    return (
        <div className='border-t-2 border-black py-2'>
            <div className='font-semibold text-base text-[green]'>{item.title}</div>
            <div className='font-semibold text-base text-[red] my-3'>
                <TypeAnimation
                    sequence={[
                        // Same substring at the start will only be typed out once, initially
                        item.title,
                        1000, // wait 1s before replacing "Mice" with "Hamsters"
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                />
            </div>
            <div className='my-4 font-normal w-full'><TypeAnimation
                sequence={[
                    item.content,
                    1000, // wait 1s before replacing "Mice" with "Hamsters"
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
            /></div>
            {/* <div className='my-3 font-normal'>{item.effectiveness}</div> */}
            {/* <div className='mb-3 text-sm font-normal'>
                Sủa đổi lần cuối: {item.updateAt}
            </div> */}
        </div>
    )
}

export default ItemNotification