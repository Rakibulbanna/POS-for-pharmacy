import { NumberInput } from "@mantine/core"
import React from "react"

const XNumberInput = React.forwardRef((props, ref) => {
    const { value, disabled, hideControls, onChange, precision=0 } = props
    
    return (
        <>
            <NumberInput precision={precision} ref={ref} value={value} disabled={disabled} hideControls={hideControls} styles={{
                 input: {
                    height: "26px",
                    minHeight: "26px",
                     "&:disabled": { color: "#000", opacity: 1 } 
                     
                    } 
                 }} size="sm" onChange={onChange}/>
        </>
    )
})



export default XNumberInput
