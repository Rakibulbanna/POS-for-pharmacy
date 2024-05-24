import { ipcRenderer } from "electron";

const usePrint = (type = "report") => {
    const print = (target, height=null) => {
        return new Promise(() => {
            let data = target.contentWindow.document.documentElement.outerHTML;

            let blob = new Blob([data], { type: 'text/html' });
            let url = URL.createObjectURL(blob);

            ipcRenderer.invoke("printComponent", url, type, height).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        });
    }

    return [print]
}

export default usePrint