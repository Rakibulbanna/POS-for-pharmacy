import {Switch} from "@mantine/core";

export default function Permissions() {
    return (
        <>
            <div>
                <select name="user_id" id="">
                    <option value="45">Ridoy Hossain</option>
                </select>
            </div>
            <div>
                <div className={"flex items-center gap-10"}>
                    <h6>Can Sale Product</h6>
                    {/*<input type="checkbox" name="sale_product" id=""/>*/}
                    <Switch/>
                </div>
                <div className={"flex items-center gap-10"}>
                    <h6>Can Sale Product</h6>
                    {/*<input type="checkbox" name="sale_product" id=""/>*/}
                    <Switch/>
                </div>

            </div>
        </>
    )
}