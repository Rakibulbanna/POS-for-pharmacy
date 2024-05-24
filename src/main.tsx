import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter, HashRouter } from "react-router-dom";
// import './samples/node-api'
import { NotificationsProvider } from '@mantine/notifications';
import "@arco-design/web-react/dist/css/arco.css";
import 'styles/index.css'
import './index.css'
import { ModalsProvider } from '@mantine/modals';
import { Button, MantineProvider, Text } from "@mantine/core";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';



const tokenExpiryModal = ({ context, id, innerProps }) => (
    <>
        <Text size="sm">{innerProps.modalBody}</Text>
        <Button fullWidth mt="md" onClick={() => context.closeModal(id)}>
            Close
        </Button>
    </>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
            <ModalsProvider modals={{ tokenExpiry: tokenExpiryModal }}>
                <NotificationsProvider position="top-right">
                    <App />
                </NotificationsProvider>
            </ModalsProvider>
        </HashRouter>
    </React.StrictMode>
)

postMessage({ payload: 'removeLoading' }, '*')
