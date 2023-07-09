import { contextBridge, ipcRenderer } from "electron";

const api: Api = {
  forLinks(setLinks: any) {
    ipcRenderer.on("forLinks", (event, data) => {
      setLinks(data);
    });
    ipcRenderer.send("forLinks");
  },
  open(link: string) {
    ipcRenderer.send("open", link);
  },
  setLinks(data: Array<ILink>) {
    ipcRenderer.send("setLinks", data);
  },
  loadLinks(): Array<ILink> {
    return ipcRenderer.sendSync("loadLinks");
  },
};

contextBridge.exposeInMainWorld("api", api);
