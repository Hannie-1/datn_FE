// "use client"
// import React from 'react'
// import Link from 'next/link'
// import { Plus } from 'lucide-react'

// import { Button } from '@/components/ui/button'
// import { Separator } from '@/components/ui/separator'
// import Heading from '@/components/ui/heading'
// import { DataTable } from '@/components/ui/data-table'
// import { ProductColumn, columns } from './column'

// interface ProductClientProps {
//     data: ProductColumn[]
//     fun: () => void
// }

// const ProductClient: React.FC<ProductClientProps> = ({
//     data
// }) => {
//     return (
//         <>
//             <div className='flex items-center justify-between'>
//                 <Heading
//                     title={`Số lượng (${data.length})`}
//                     description='Quản lý chuyến xe'
//                 />
//                 <Link href={`manage-product/new`}>
//                     <Button>
//                         <Plus className='mr-2 h-4 w-4' />
//                         Thêm mới
//                     </Button>
//                 </Link>
//             </div>
//             <Separator />
//             <DataTable keySearch={"name"} columns={columns} data={data} />

//         </>
//     )
// }

// export default ProductClient
"use client"
import React from 'react'
import Link from 'next/link'
import { Plus, RefreshCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Heading from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ProductColumn, columns } from './column'

interface ProductClientProps {
    data: ProductColumn[]
    fun: () => void // hàm reload
}

const ProductClient: React.FC<ProductClientProps> = ({
    data, fun
}) => {
    return (
        <>
            <div className='flex items-center justify-between mb-2'>
                <Heading
                    title={`Số lượng (${data.length})`}
                    description='Quản lý chuyến xe'
                />
                <div className="flex gap-2">
                    <Link href={`manage-product/new`}>
                        <Button>
                            <Plus className='mr-2 h-4 w-4' />
                            Thêm mới
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="p-2"
                        onClick={fun} // gọi hàm reload
                    >
                        <RefreshCcw className='h-4 w-4' />
                    </Button>
                </div>
            </div>
            <Separator />
            <DataTable keySearch={"name"} columns={columns} data={data} />
        </>
    )
}

export default ProductClient
