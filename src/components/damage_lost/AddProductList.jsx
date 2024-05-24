import { Badge, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";

export default function ({ addProducts, handleRemove }) {

  return <>

    <div
      className="mt-2 h-[calc(100vh-215px)] shadow-black rounded-sm max-w-full"
      style={{ border: '1px solid #cbd5e1' }}

    >
      <div className="overflow-x-auto relative">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              <th scope="col" className="py-3 px-6">Product Name</th>
              <th scope="col" className="py-3 px-6">Supplier Name</th>

              <th scope="col" className="py-3 px-6">Stock</th>
              <th scope="col" className="py-3 px-6">Quantity</th>
              <th scope="col" className="py-3 px-6">CPU</th>
              <th scope="col" className="py-3 px-6">MRP</th>

              <th scope="col" className="py-3 px-6 w-28">Status</th>
              <th scope="col" className="py-3 px-6">Reason</th>
              <th scope="col" className="py-3 px-6">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 overflow-y-auto">
            {
              addProducts?.map((product, index) =>
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} border-b  border-gray-700`}>
                  <th scope="row" className="px-6 font-medium  whitespace-nowrap text-gray-600">
                    {product?.name + (product.style_size ? ', ' + product.style_size : '')}
                  </th>
                  <th scope="row" className="px-6 font-medium  whitespace-nowrap text-gray-600">
                    {product?.supplier?.first_name}
                  </th>
                  <td className="px-6 w-16 text-center">
                    {product?.stock}
                  </td>
                  <td className="px-6 w-16 text-center">
                    {product?.quantity}
                  </td>
                  <td className="px-6 w-16 text-center">
                    {product?.cost_price}
                  </td>
                  <td className="px-6 w-16 text-center">
                    {product?.MRP_price}
                  </td>
                  <td className="px-6">
                    {
                      product.status === 'damage' &&
                      <Badge radius="0" fullWidth variant={'outline'} color="yellow">Damage</Badge>
                    }
                    {
                      product.status === 'lost' &&
                      <Badge radius="0" fullWidth variant={'outline'} color="red">Lost</Badge>
                    }
                  </td>
                  <td className="px-4 text-ellipsis">{product.reason}</td>
                  <td className=" text-ellipsis">
                    <Button color="red" size="xs" onClick={() => handleRemove(product.id)}> Remove</Button>
                  </td>
                </tr>
              )}

          </tbody>
        </table>
      </div>

    </div>
  </>
}