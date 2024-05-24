import { DatePicker } from "@mantine/dates";

const ReportFilter = ({ onFromDate, onToDate }) => {
    const handleFromDateChange = (date) => {
        if (date === null) {
            onFromDate(null);
            return;
        }
        const selectDate = new Date(date);
        const selectDateAddOneDay = new Date(selectDate.getTime() - 21600000 );
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
        <div className=" w-full flex justify-center gap-2">
            <DatePicker className=" w-52" label="From Date" clearable onChange={(v) => handleFromDateChange(v)} />
            <DatePicker className=" w-52" label="To Date" clearable onChange={(v) => handleToDateChange(v)} />
        </div>
    )
}

export default ReportFilter