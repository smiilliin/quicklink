declare global {
  interface ILink {
    name: string;
    link: string;
    uuid: string;
  }
  interface Api {
    forLinks(setLinks: any);
    open(link: string);
    setLinks(data: Array<ILink>);
    loadLinks(): Array<ILink>;
  }
  interface Window {
    api: Api;
  }
}

export default global;
