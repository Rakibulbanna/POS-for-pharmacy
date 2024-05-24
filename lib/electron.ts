import {ipcRenderer} from "electron";

export const PassPrintToElectron = (target:any) => {
    return new Promise(() => {
        let data = target.contentWindow.document.documentElement.outerHTML;

        let blob = new Blob([data], { type: 'text/html' });
        let url = URL.createObjectURL(blob);

        ipcRenderer.invoke("printComponent", url, "landscape").then(res => {
        }).catch(err => {
            console.log(err);
        })
    });
}