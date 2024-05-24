import purchaseOrder from "~/src/images/purchase-order.svg";

export default function ({value = null}) {
    return <>
        <div className=" col-start-2 col-end-3 p-10 w-full flex justify-center flex-col text-center">
            <div className="bg-sky-100 pt-6 pb-5 px-6 mx-auto border border-gray-500 rounded-full ">
                <img className=" h-10 fill-gray-400 " src={purchaseOrder} />
            </div>
            <div className="pt-6 font-semibold text-base text-gray-400">Sorry! No {value ? value : 'Products'} Founds</div>
            <div className="pt-3 font-semibold text-base text-gray-500">Please try searching for something else</div>
        </div>
    </>
}