import { POSProducts } from "@/store/pos"
import { Text } from "@mantine/core"
import { openConfirmModal } from "@mantine/modals"
import { useAtom } from "jotai"

export default function ({ holds, setHolds, setProducts }) {
    const [posProducts, setPosProducts] = useAtom(POSProducts)

    const removeFromHolds = (id) => {
        setHolds(holds.filter(hold => hold.id !== id))
    }

    const confirmModal = (id) => openConfirmModal({
        title: 'Current products will be removed !!',
        centered: true,
        children: (
          <Text size="sm">
            If you want to save current product for future use, please click on Hold.
          </Text>
        ),
        labels: { confirm: 'Clear', cancel: 'Cancel' },
        // onCancel: () => ,
        onConfirm: () => setHoldProductstoPos(id),
      });


    const handleSelectHold = (id, type) => {
        if (type === "myself") {
            // check if pos has products and confirm action
            if (posProducts.length) {
                confirmModal(id)
            } else {
                setHoldProductstoPos(id)
            }
        }
    }

    const setHoldProductstoPos = (id) => {
        const hold = holds.find(hold => hold.id === id)
        
        // console.log(hold);
        setProducts(hold.products)
        setPosProducts(hold.products)

        removeFromHolds(id)
    }

    return (
        <>
            <div className="flex gap-6">
                {holds.map((hold, index) => (
                    <div className="relative cursor-pointer">
                        <div key={index} className="w-24 h-16  bg-blue-300 rounded-md" onClick={() => handleSelectHold(hold.id, "myself")}>
                            {hold.products.map(product => (

                                <div>{product.name}</div>

                            ))}
                        </div>
                        <div className="bg-red-500 absolute top-[-6px] right-[-6px] grid items-center rounded-full cursor-pointer" onClick={() => removeFromHolds(hold.id)}>
                            <div className="py-1 px-1.5">X</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}