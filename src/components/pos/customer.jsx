import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";
import { useAtom } from "jotai";
import { CustomerSearchValue, SelectedCustomer } from "@/store/pos";
import { useDebouncedState } from "@mantine/hooks";

export default function ({reRenderCustomers}) {
    const [customers, setCustomers] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useAtom(SelectedCustomer)
    const [inputValue, setInputValue] = useDebouncedState("", 300)

    useEffect(() => {
        HTTP.get(`${BaseAPI}/customers`).then(res => {
            setCustomers(res.data.data.map(cus => {
                return {
                    ...cus,
                    label: cus.first_name,
                    value: cus.id,
                }
            }))
        }).catch(err => {
            console.log(err);
        })
    }, [reRenderCustomers]);
    useEffect(() => {
        if (!inputValue) return
        if (!isAllNumber(inputValue)) return

        HTTP.get(`${BaseAPI}/customers/pos-search/${inputValue}`).then(res => {
            setCustomers(()=>res.data.data.map(cus => {
                return {
                    ...cus,
                    label: cus.first_name,
                    value: cus.id,
                }
            }))
        }).catch(err => {
            console.log(err);
        })

    }, [inputValue])

    function isAllNumber(value) {
        return new RegExp(/[0-9]+/).test(value)
    }

    const handleCusChange = (customer) => {
        if (customer) {
            const cus = customers.find(cus => cus.id === customer.id)
            setSelectedCustomer(()=>cus)
        } else {
            setSelectedCustomer(null)
        }
    }
    // console.log({ customers });
    // console.log({ selectedCustomer });
    return (
        <>
            <Autocomplete
            className="w-full"
                renderInput={(params) => <TextField {...params} label="Customer" />}
                options={customers}
                defaultValue={selectedCustomer && selectedCustomer.first_name}
                onInputChange={(e, v) => { setInputValue(v) }}
                // value={selectedCustomer}
                onChange={(e, v) => handleCusChange(v)}
                size={"small"}
                filterOptions={(x)=>x}
            />
        </>
    )
}
