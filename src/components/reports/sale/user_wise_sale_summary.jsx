import { useEffect, useState } from "react"
import { BaseAPI, HTTP } from "~/repositories/base"
import HeaderInfo from "../HeaderInfo";



export default function ({ fromDate = null, toDate = null, customerID = null, phoneNumber = null }) {
  const [usersInfo, setUsersInfo] = useState([]);
  const [users, setUsers] = useState([]);
  const [grandTotal, setGrandTotal] = useState( {
    cash_paid: 0,
    card_paid: 0,
    redeem_paid: 0,
    exchange_amount: 0,
    credit_paid:0,
    round_amount: 0,
    total: 0,
    total_dis_amt: 0,
    total_vat_amt: 0,
    mrp: 0,
    total_return_amt: 0
  });

  useEffect(() => {
    let url = `${BaseAPI}/reports/sales/user-wise-summery?`;

    if (fromDate) url += `from_date=${fromDate}&`;
    if (toDate) url += `to_date=${toDate}`;
    // if (customerID) url += `&customer_id=${customerID}`
    // url += `&user_id=${1}`
    // if (phoneNumber) url += `&phone_number=${phoneNumber}`
    HTTP.get(url).then(res => {
      const filterId = res.data.data?.map(user => user.id)
      const usersFilterId = [...new Set(filterId)];
      setUsersInfo(() => res.data.data);
      setUsers(() => usersFilterId);

      const values = {
        cash_paid: 0,
        card_paid: 0,
        redeem_paid: 0,
        exchange_amount: 0,
        credit_paid: 0,
        round_amount: 0,
        total: 0,
        total_dis_amt: 0,
        total_vat_amt: 0,
        mrp: 0,
        total_return_amt: 0
      }
      res.data.data?.forEach(data => {
        const { total_vat_amt, cash_amt, card_amt, point_redeem_amt, exchange_amt,credit_amt, round_amount, total, total_dis_amt, mrp, total_return_amt } = data;

        if (cash_amt) values.cash_paid += cash_amt;
        if (card_amt) values.card_paid += card_amt;
        if (point_redeem_amt) values.redeem_paid += point_redeem_amt;
        if (exchange_amt) values.exchange_amount += exchange_amt;
        if (credit_amt) values.credit_paid += credit_amt;
        
        if (round_amount) values.round_amount += round_amount;

        if (mrp) values.mrp += mrp;
        if (total_dis_amt) values.total_dis_amt += total_dis_amt;
        if (total_vat_amt) values.total_vat_amt += total_vat_amt;
        if (total) values.total += total;
        if (total_return_amt) values.total_return_amt += total_return_amt;
      });
      console.log({ values })
      setGrandTotal(values);

    }).catch(err => {
      console.log(err)
    })
  }, [fromDate, toDate]);

  const handleBody = (value, index) => {
    const filterUser = usersInfo.filter(user => user.id === value);

    const values = {
      total: 0,
      total_dis_amt: 0,
      total_vat_amt: 0,
      total_return_amt: 0,
      round_amount: 0,
      mrp: 0,
      exchange_amount: 0,
      cash_paid: 0,
      card_paid: 0,
      redeem_paid: 0,
      credit_paid: 0
    }
    filterUser.forEach((info) => {
      const { total_vat_amt, cash_amt, point_redeem_amt, card_amt, exchange_amt,credit_amt, round_amount, total, total_dis_amt, mrp, total_return_amt } = info;

      if (cash_amt) values.cash_paid += cash_amt;
      if (card_amt) values.card_paid += card_amt;
      if (point_redeem_amt) values.redeem_paid += point_redeem_amt;
      // if (exchange_amt) values.exchange_amount += exchange_amt;
      if (credit_amt) values.credit_paid += credit_amt;
      if (round_amount) values.round_amount += round_amount;

      if (mrp) values.mrp += mrp;
      if (total_dis_amt) values.total_dis_amt += total_dis_amt;
      if (total_vat_amt) values.total_vat_amt += total_vat_amt;
      if (total) values.total += total - (exchange_amt || 0 ) - (total_return_amt || 0) ;
      if (total_return_amt) values.total_return_amt += total_return_amt;
    });
    // const arr = '';
    // for (const property in values) {
    //   console.log(`${property}: ${object[property]}`);
    //   arr += <td style={{ padding: '1px 0' }}>{values[property].toFixed(2)}</td>
    // }
    // return arr;
    return (
      <>
        <td style={{ padding: '1px 0' }}>{filterUser[0].first_name}</td>
        <td style={{ padding: '1px 0' }}>{values.mrp.toFixed(2)}</td>
        <td style={{ padding: '1px 0' }}>{values.total_dis_amt.toFixed(2)}</td>
        <td style={{ padding: '1px 0' }}>{values.total_vat_amt.toFixed(2)}</td>
        <td style={{ padding: '1px 0' }}>{values.total_return_amt.toFixed(2)}</td>
        <td style={{ padding: '1px 0' }}>{values.round_amount.toFixed(2)}</td>
        <td style={{ padding: '1px 0' }}>{values.total.toFixed(2)}</td>
        {/* <td style={{ padding: '1px 0' }}>{values.exchange_amount.toFixed(2)}</td> */}
        <td style={{ padding: '1px 0' }}>{values.cash_paid.toFixed(2)}</td>
        <td style={{ padding: '1px 0' }}>{(values.card_paid + values.credit_paid).toFixed(2)}</td>
        {/* <td style={{ padding: '1px 0' }}>{values.redeem_paid.toFixed(2)}</td> */}
      </>
    )
  };
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <HeaderInfo title='User Wise Sales Summary ' />
        <div style={{ position: 'relative', width: '100%', borderRadius: '5px', padding: '2px', border: '1px solid #8c8c8c', marginTop: '20px', }}>
          <table style={{ width: '100%', fontSize: '12px' }} >
            <thead style={{ backgroundColor: 'black', color: '#EFEFEF', fontSize: '15px' }}  >
              <tr>
                <th style={{ padding: '1px' }}>User Name</th>
                <th style={{ padding: '1px' }}>Sale Value</th>
                <th style={{ padding: '1px' }}>Dis Amt</th>
                <th style={{ padding: '1px' }}>Vat Amt</th>
                <th style={{ padding: '1px' }}>Rtn Amt </th>
                <th style={{ padding: '1px' }}>Rnd Amt </th>
                <th style={{ padding: '1px' }}>Net Amt </th>
                {/* <th style={{ padding: '1px' }}>Exch Amt </th> */}
                <th style={{ padding: '1px' }}>Cash Amt </th>
                <th style={{ padding: '1px' }}>Card Amt </th>
                {/* <th style={{ padding: '1px' }}>Redeem Amt </th> */}
              </tr>
            </thead>
            <tbody>
              {users.length > 0 && users.map((value, index) => (
                <tr key={index} style={index % 2 === 0 ? { backgroundColor: "#f1f5f9", textAlign: 'right' } : { backgroundColor: "#e2e8f0", textAlign: 'right' }} >
                  {/* users body datas function */}
                  {handleBody(value, index)}
                </tr>
              ))}

              <tr style={{ fontWeight: 'bold', textAlign: 'right' }}>
                <td >Grand Total:</td>
                <td >{grandTotal.mrp.toFixed(2)}</td>
                <td >{grandTotal.total_dis_amt.toFixed(2)}</td>
                <td >{grandTotal.total_vat_amt.toFixed(2)}</td>
                <td >{grandTotal.total_return_amt.toFixed(2)}</td>
                <td >{grandTotal.round_amount.toFixed(2)}</td>
                <td >{(grandTotal.total - grandTotal.total_return_amt - grandTotal.exchange_amount ).toFixed(2)}</td>
                {/* <td >{grandTotal.exchange_amount.toFixed(2)}</td> */}
                <td >{grandTotal.cash_paid.toFixed(2)}</td>
                <td >{(grandTotal.card_paid + grandTotal.credit_paid).toFixed(2)}</td>
                {/* <td >{grandTotal.redeem_paid.toFixed(2)}</td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
