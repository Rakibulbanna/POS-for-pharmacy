import { useEffect, useState } from 'react';
import { BaseAPI, HTTP } from "~/repositories/base";
import moment from "moment";
import { Button, Input } from '@mantine/core';
import Create from './create';
import EmptyNotification from '@/utility/emptyNotification';
import { showNotification } from '@mantine/notifications';


export default function () {

    const [buyXgetX, setBuyXGetX] = useState([]);
    const [buyXgetXIds, setBuyXGetXIds] = useState([]);
    const [showCreatePage, setShowCreatePage] = useState(false);
    const [selectEdit, setSelectEdit] = useState(0);
    const [selectedEffectiveDate, setSelectEffectiveDate] = useState('');
    const [selectExpireeDate, setSelectExpireDate] = useState('');


    useEffect(() => {
        HTTP.get(`${BaseAPI}/promotions/all/bxgx`)
            .then(res => {
                // console.log(res.data.data);
                if (res.data.data.length > 0) {
                    const filterData = res.data.data.map(val => val.buy_x_get_x_id);
                    const uniqueIds = [...new Set([...filterData])];

                    let filterProducts = [];
                    uniqueIds.forEach(element => {
                        const filter = res.data.data.filter((v) => v.buy_x_get_x_id === element);
                        filterProducts.push(filter);
                    });

                    setBuyXGetXIds(() => uniqueIds);
                    setBuyXGetX(() => filterProducts);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [showCreatePage])

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

    // console.log({ selectedEffectiveDate, selectExpireeDate });

    const handleEdit = (discount) => {
        setSelectEdit(() => discount[0].buy_x_get_x_id)
        setSelectEffectiveDate(() => '');
        setSelectExpireDate(() => '');
    }

    const handleUpdate = (id) => {
        if (selectedEffectiveDate.length === 0 && selectExpireeDate.length === 0) return;
        console.log({ selectedEffectiveDate, selectExpireeDate })
        let url = `${BaseAPI}/promotions/bxgx/${id}?`;
        if (selectedEffectiveDate) url += `effectiveDate=${selectedEffectiveDate}&`
        if (selectExpireeDate) url += `expiryDate=${selectExpireeDate}`

        HTTP.patch(url)
            .then(res => {
                showNotification({
                    title: "Success",
                    message: "Successfully Update"
                })

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
                            Active Buy X Get X List:
                        </div>
                        <Button size='sm' rightIcon onClick={() => setShowCreatePage(() => true)} >Create </Button>
                    </div>

                    <div className='h-[calc(100vh-75px)] overflow-auto' style={{ border: '1px solid #94a3b8', padding: '0.1rem', fontFamily: 'Arial' }}>
                        <table style={{ fontSize: '12px', width: '100%', textAlign: 'center' }} >
                            <thead>
                                <tr style={{ backgroundColor: '#1f2937', color: '#f9fafb' }}>
                                    <th style={{ padding: '1px' }}>Discount No. </th>
                                    <th style={{ padding: '1px' }}>Barcode </th>
                                    <th style={{ padding: '1px' }}>Discount Name</th>
                                    <th style={{ padding: '1px' }}>Buy Products</th>
                                    <th style={{ padding: '1px' }}>Get Products</th>
                                    <th style={{ padding: '1px' }}>Effective Date</th>
                                    <th style={{ padding: '1px' }}>Expire Date</th>
                                    {/* <th style={{ padding: '1px' }}>Status</th> */}
                                    <th style={{ padding: '1px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    buyXgetX.length > 0 &&
                                    buyXgetX.map((discount, index) => (
                                        <tr key={discount} style={index % 2 === 0 ? { backgroundColor: '#f3f4f6' } : { backgroundColor: '#e5e7eb' }}>
                                            <td style={{ padding: '0 1px' }}>{discount[0].buy_x_get_x_id}</td>
                                            <td style={{ padding: '0 1px' }}>{discount[0].group_id}</td>
                                            <td style={{ padding: '0 1px' }}>{discount[0].buy_x_get_x?.name}</td>
                                            <td style={{ padding: '0 1px' }}>{filterBuyXANDGetXName(discount, 1)}</td>
                                            <td style={{ padding: '0 1px' }}>{filterBuyXANDGetXName(discount, 2)}</td>
                                            <td style={{ padding: '0 1px' }}>
                                                {
                                                    selectEdit === discount[0].buy_x_get_x_id ?
                                                        <Input size='xs' type='date' onChange={(e) => setSelectEffectiveDate(() => e.target.value)}></Input>
                                                        :
                                                        discount[0].buy_x_get_x?.effective_date && moment(discount[0].buy_x_get_x.effective_date).format('DD-MM-YYYY')
                                                }
                                            </td>

                                            <td style={{ padding: '0 1px' }}>
                                                {
                                                    selectEdit === discount[0].buy_x_get_x_id ?
                                                        <Input size='xs' type='date' onChange={(e) => setSelectExpireDate(() => e.target.value)} ></Input>
                                                        :
                                                        discount[0].buy_x_get_x?.expiry_date && moment(discount[0].buy_x_get_x.expiry_date).format('DD-MM-YYYY')
                                                }
                                            </td>

                                            {/* <td style={{ padding: '0 1px' }}>{discount.is_active ? 'Active' : 'Inactive'}</td> */}
                                            <td style={{ padding: '0', textAlign: 'right' }}>
                                                {
                                                    selectEdit !== discount[0].buy_x_get_x_id ?
                                                        <Button
                                                            variant="outline"
                                                            gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                                                            size='xs'
                                                            className='mr-1 ml-1'
                                                            onClick={() => handleEdit(discount)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        :
                                                        <Button
                                                            variant="gradient"
                                                            gradient={{ from: 'teal', to: 'blue', deg: 60 }}
                                                            size='xs'
                                                            onClick={() => handleUpdate(discount[0].buy_x_get_x_id)}
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
                                    <td style={{ padding: '0 1px' }}>{buyXgetX.reduce((prev, curr) => prev + curr.price, 0)}</td>
                                </tr>
                            </tfoot> */}
                        </table>

                        {
                            buyXgetX.length === 0 &&
                            <div className='mt-40' >
                                <EmptyNotification value='Combo Promotion' />
                            </div>
                        }

                    </div>
                </>
        }

    </>
}