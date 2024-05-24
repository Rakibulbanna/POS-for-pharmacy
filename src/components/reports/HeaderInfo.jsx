import moment from "moment";
import { useEffect,useState, useMemo } from "react";
import { BaseAPI, HTTP } from "~/repositories/base";

export default function ({ title, fromDate, toDate }) {
    const date = new Date();

    const [setting,setSetting] = useState({})

    useMemo(() => {
        HTTP.get(`${BaseAPI}/settings`).then(res =>{
            setSetting(res.data.data);
        })
    }, [])
    // console.log({setting});
    return (
        <>
            <div style={{ margin: 'auto', textAlign: 'center', marginBottom: '20px', fontFamily: 'Arial' }} >
                <div style={{ fontSize: '25px', fontWeight: 'bold', }} >{setting.company_name}</div>
                <div style={{ fontSize: '16px', marginBottom: '10px', marginTop: '10px' }}>{setting.company_address}</div>
                <div style={{ fontSize: '16px', marginBottom: '10px', marginTop: '10px' }}>Mobile:{' '+setting.company_phone_number}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', width: 'fit-content', margin: 'auto', border: '2px solid #8c8c8c', padding: '5px 10px' }}>{title}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', width: 'fit-content', margin: 'auto', padding: '5px 10px' }}>{fromDate ? `FROM ${moment(fromDate).format('DD-MM-YYYY')}` : ''} {toDate ? `TO ${moment(toDate).format('DD-MM-YYYY')}` : ''}</div>
            </div>
        </>
    )
}