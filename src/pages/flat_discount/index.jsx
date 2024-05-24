import { useEffect, useState } from 'react';
import { BaseAPI, HTTP } from "~/repositories/base";
import moment from "moment";
import { Button, Input } from '@mantine/core';
import Create from './create';
import EmptyNotification from '@/utility/emptyNotification';
import { showNotification } from '@mantine/notifications';


export default function () {

    const [flatDiscount, setFlatDiscount] = useState([]);
    const [flatDiscountIds, setFlatDiscountIds] = useState([]);
    const [showCreatePage, setShowCreatePage] = useState(false);
    const [reRenderFetch, setReRenderFetch] = useState(false);

    const [selectEdit, setSelectEdit] = useState(0);
    const [selectedEffectiveDate, setSelectEffectiveDate] = useState('');
    const [selectExpireeDate, setSelectExpireDate] = useState('');


    useEffect(() => {
        HTTP.get(`${BaseAPI}/promotions/flat`)
            .then(res => {
                console.log(res.data.data);
                setFlatDiscount(() => res.data.data);
                // if (res.data.data.length > 0) {
                //     const filterData = res.data.data.map(val => val.buy_x_get_x_id);
                //     const uniqueIds = [...new Set([...filterData])];

                //     let filterProducts = [];
                //     uniqueIds.forEach(element => {
                //         const filter = res.data.data.filter((v) => v.buy_x_get_x_id === element);
                //         filterProducts.push(filter);
                //     });

                //     setFlatDiscountIds(() => uniqueIds);
                //     setFlatDiscount(() => filterProducts);
                // }
            })
            .catch(err => {
                console.log(err)
            })
    }, [showCreatePage, reRenderFetch])

    //filter buy and get products name list
    const filterBuyXANDGetXName = (data, type) => {
        const totalFilter = data.reduce((prev, curr) => {
            if (curr.type === type) {
                if (prev.length === 0) return prev + curr.product?.name || '';
                return prev + ', ' + curr.product?.name || '';
            }
            return prev;
        }, '');
        return totalFilter;
    }

    const handleEdit = (id) => {
        setSelectEdit(() => id);
        setSelectEffectiveDate(() => '');
        setSelectExpireDate(() => '');
    }

    const handleUpdate = (id) => {
        if (selectedEffectiveDate.length === 0 && selectExpireeDate.length === 0) return;
        console.log({ selectedEffectiveDate, selectExpireeDate })
        let url = `${BaseAPI}/promotions/flat-discount/${id}?`;
        if (selectedEffectiveDate) url += `effectiveDate=${selectedEffectiveDate}&`
        if (selectExpireeDate) url += `expiryDate=${selectExpireeDate}`

        HTTP.patch(url)
            .then(res => {
                showNotification({
                    title: "Success",
                    message: "Successfully Update"
                });
                // setReRenderFetch((v)=>v);
                setReRenderFetch((v) => !v);
                setSelectEdit(0)
            }).catch(err => {
                console.log(err);
                showNotification({
                    title: "Error",
                    message: "Error Update",
                    color: 'red'
                })
            })

    }

    return <>
        {
            showCreatePage ?
                <Create setShowCreatePage={setShowCreatePage} />
                :
                <>
                    <div className='flex right-0 justify-between w-full mb-1'>
                        <div className='relative top-3 font-medium'>
                            Active Flat Discount:
                        </div>
                        <Button size='sm' rightIcon onClick={() => setShowCreatePage(() => true)} >Create </Button>
                    </div>

                    <div className='h-[calc(100vh-75px)] overflow-auto' style={{ border: '1px solid #94a3b8', padding: '0.1rem', fontFamily: 'Arial' }}>
                        <table style={{ fontSize: '12px', width: '100%', textAlign: 'center' }} >
                            <thead>
                                <tr style={{ backgroundColor: '#1f2937', color: '#f9fafb' }}>
                                    <th style={{ padding: '1px' }}>Discount No. </th>
                                    <th style={{ padding: '1px' }}>Discount Name</th>
                                    <th style={{ padding: '1px' }}>Products</th>
                                    <th style={{ padding: '1px', width: '10%' }}>Effective Date</th>
                                    <th style={{ padding: '1px', width: '10%' }}>Expire Date</th>
                                    {/* <th style={{ padding: '1px' }}>Status</th> */}
                                    <th style={{ padding: '1px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    flatDiscount.length > 0 &&
                                    flatDiscount.map((discount, index) => (
                                        <tr key={discount} style={index % 2 === 0 ? { backgroundColor: '#f3f4f6' } : { backgroundColor: '#e5e7eb' }}>
                                            <td style={{ padding: '0 1px' }}>{discount.id}</td>
                                            <td style={{ padding: '0 1px' }}>{discount.name}</td>
                                            <td style={{ padding: '0 1px' }}>{discount.products.reduce((prev, curr) => curr.product?.name + ', ' + prev, '')}</td>
                                            <td style={{ padding: '0 1px' }}>
                                                {
                                                    selectEdit === discount.id ?
                                                        <Input size='xs' type='date' onChange={(e) => setSelectEffectiveDate(() => e.target.value)}></Input>
                                                        :
                                                        discount?.effective_date && moment(discount.effective_date).format('DD-MM-YYYY')
                                                }
                                            </td>

                                            <td style={{ padding: '0 1px' }}>
                                                {
                                                    selectEdit === discount.id ?
                                                        <Input size='xs' type='date' onChange={(e) => setSelectExpireDate(() => e.target.value)} ></Input>
                                                        :
                                                        discount.expiry_date && moment(discount.expiry_date).format('DD-MM-YYYY')
                                                }
                                            </td>

                                            {/* <td style={{ padding: '0 1px' }}>{discount.is_active ? 'Active' : 'Inactive'}</td> */}
                                            <td style={{ padding: '0', textAlign: 'right' }}>
                                                {
                                                    selectEdit !== discount.id ?
                                                        <Button
                                                            variant="outline"
                                                            gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                                                            size='xs'
                                                            className='mr-1 ml-1'
                                                            onClick={() => handleEdit(discount.id)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        :
                                                        <Button
                                                            variant="gradient"
                                                            gradient={{ from: 'teal', to: 'blue', deg: 60 }}
                                                            size='xs'
                                                            onClick={() => handleUpdate(discount.id)}
                                                        >
                                                            Update
                                                        </Button>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                            {/* <tfoot style={{ fontWeight: '600', textAlign: 'right' }}>
                                <tr>
                                    <td colSpan={6} >Grand Total:</td>
                                    <td style={{ padding: '0 1px' }}>{flatDiscount.reduce((prev, curr) => prev + curr.price, 0)}</td>
                                </tr>
                            </tfoot> */}
                        </table>

                        {
                            flatDiscount.length === 0 &&
                            <div className='mt-40' >
                                <EmptyNotification value='Combo Promotion' />
                            </div>
                        }

                    </div>
                </>
        }

    </>
}