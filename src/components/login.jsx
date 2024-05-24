import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Image,
} from '@mantine/core';
import { useForm } from "@mantine/form";
import { BaseAPI, HTTP } from "~/repositories/base";
import { showNotification } from "@mantine/notifications";
import POS from '~/public/POS.png'
import Elitbuzz from '~/public/elitbuzz.png'
import Wave from '~/public/login/waves.svg'
import BgWave1 from '~/public/login/bg_wave1.svg'
import BgWave2 from '~/public/login/bg_wave2.svg'
import Blob from '~/public/login/blob_pharmacy.svg'
import Pharmacy from '~/public/login/Pharmacy Illustration.svg'



export default function ({ handleSuccess }) {
  const form = useForm({
    initialValues: {
      username: undefined,
      password: undefined
    }
  })

  const handleSubmit = (values) => {
    HTTP.post(`${BaseAPI}/login`, values).then(res => {
      handleSuccess(res.data.data)
    }).catch(err => {
      showNotification({
        title: "Error",
        color:'red',
        message: "Invalid credentials"
      })
    })
  }

  return (
    <>
      <div className='relative w-screen h-screen flex flex-col justify-center overflow-hidden'>

        <div className="relative animate-scale w-10/12 h-4/5 mx-auto grid grid-cols-2 shadow shadow-gray-400 rounded-md overflow-hidden ">

          <div className=' flex flex-col justify-center bg-white '>
            <form className="min-w-[500px] max-w-2xl m-auto border rounded-sm p-10 h-fit" onSubmit={form.onSubmit(values => handleSubmit(values))}>

              <Title className=' text-amber-500' order={2} align="center" mt="md" mb={50}>
                Welcome back to Elit POS!
              </Title>

              <TextInput label="Username" placeholder="Your username" size="md" required {...form.getInputProps("username")} autoFocus={true} />
              <PasswordInput label="Password" placeholder="Your password" mt="md" required size="md" {...form.getInputProps("password")} />
              <Button fullWidth mt="xl" className=' bg-amber-500 hover:bg-amber-600  duration-150' size="md" type={"submit"}>
                Login
              </Button>
            </form>
          </div>

          <div className=' w-full h-full flex flex-col justify-center overflow-hidden'>
            <img src={Pharmacy} className=' bottom-0 object-center w-full scale-0.1 object-contain ' />
          </div>

          <img src={Blob} className='absolute animate-rotate-slow -top-[80%] -left-2/3 -z-10' />
        </div>

        <img src={Blob} className='absolute animate-rotate w-1/3 -left-40 -top-36 -z-10' />
        <img src={Blob} className='absolute animate-rotate w-60 -right-20 -bottom-32 -z-10' />
      </div>

      {/* <div className="relative overflow-hidden w-screen h-screen">
        <Image className='max-h-full max-w-full' src={POS} alt="Flower and sky" />
        <div className="absolute top-8 left-16">
        <Image className='max-h-full max-w-full' src={Elitbuzz} alt="Flower and sky" />
        </div>
        <div className="absolute top-20 right-60 px-6 py-4 pr-72">
          <form onSubmit={form.onSubmit(values => handleSubmit(values))}>

            <Title order={2} align="center" mt="md" mb={50}>
              Welcome back to Elit POS!
            </Title>

            <TextInput label="Username" placeholder="Your username" size="md" required {...form.getInputProps("username")} autoFocus={true} />
            <PasswordInput label="Password" placeholder="Your password" mt="md" required size="md" {...form.getInputProps("password")} />
            <Button fullWidth mt="xl" size="md" type={"submit"}>
              Login
            </Button>

          </form>
        </div>
      </div> */}
    </>


  );
}
