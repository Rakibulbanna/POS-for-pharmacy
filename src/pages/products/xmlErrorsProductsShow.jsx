import { Modal, Table, useMantineTheme } from '@mantine/core';

export default function ({ opened, setOpened, error_XML_PRODUCTS_UPLOAD_LIST }) {

  const theme = useMantineTheme();
  console.log({ error_XML_PRODUCTS_UPLOAD_LIST })
  return <> <Modal
    overlayColor={theme.colors.gray[2]}
    overlayOpacity={0.55}
    centered
    overlayBlur={3}
    overflow="inside"
    opened={opened}
    onClose={() => setOpened(false)}
    size='80%'
  >
    <Table
      striped
      highlightOnHover
      verticalSpacing="xs" fontSize="xs"
      bgcolor={theme.colors.gray[2]}
    >
      <thead className='font-bold'>
        {
          error_XML_PRODUCTS_UPLOAD_LIST.length > 0 &&
          error_XML_PRODUCTS_UPLOAD_LIST[0].map((value) => <td className={`${value?.toLowerCase() ==='product name'&& 'w-2/12'}`} key={value}> {value} </td>)
        }
      </thead>
      <tbody >
        {
          error_XML_PRODUCTS_UPLOAD_LIST.length > 0 &&
          error_XML_PRODUCTS_UPLOAD_LIST.map((value, index) => value[0]?.toLowerCase() !== 'supplier name' && <tr key={index} style={{ fontSize: '10px' }}>
            {value.map((v, index) => <td key={index}>
              {v}
            </td>)}
          </tr>)
        }
      </tbody>
    </Table>
  </Modal>
  </>
}