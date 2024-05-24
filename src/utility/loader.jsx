import { Loader } from "@mantine/core";

export default function () {
    return <>
        <div className=" absolute m-auto backdrop-blur-sm bg-white/30 min-h-screen grid place-content-center justify-center' z-50 top-0 w-[calc(100%-420px)]" >
            <Loader size='xl' variant='bars'  />
        </div>


    </>
}