import { Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

const ReportFilter = ({ onFromDate, onToDate,handleClick }) => {
    const handleFromDateChange = (date) => {
        if (date === null) {
            onFromDate(null);
            return;
        }
        const selectDate = new Date(date);
        const selectDateAddOneDay = new Date(selectDate.getTime() - 21600000);
        onFromDate(selectDateAddOneDay)
    }
    const handleToDateChange = (date) => {

        if (date === null) {
            onToDate(null);
            return;
        }
        const selectDate = new Date(date);
        const selectDateAddOneDay = new Date(selectDate.getTime() + 86399999 - 21600000);

        onToDate(selectDateAddOneDay)
    }
    return (
        <div className=" w-fit mx-auto flex justify-between gap-4 shadow shadow-slate-400 p-4 rounded-md ">
            {/* <div className="flex gap-2"> */}
                <DatePicker className=" w-60" label="From Date" placeholder="select start date" clearable onChange={(v) => handleFromDateChange(v)} />
                <DatePicker className=" w-60" label="To Date" placeholder="select end date" clearable onChange={(v) => handleToDateChange(v)} />
                <Button className=" relative top-5 w-52 ml-10" onClick={handleClick}> Filter</Button>
            {/* </div> */}


        </div>
    )
}

export default ReportFilter