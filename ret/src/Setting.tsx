import React, { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { v4 as createUUID } from "uuid";
import "./setting.css";
import DeleteIcon from "./delete.svg";
import ReactDOM from "react-dom";

type ReactSet<T> = React.Dispatch<React.SetStateAction<T>>;

const App = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
  width: 100vw;
  height: 100vh;
  background-color: #1e1e1e;
`;

const List = styled.div`
  overflow-x: hidden;
`;
interface IELinkContainer {
  border: number;
}
const LinkTitle = styled.span`
  overflow: hidden;
  color: white;
  text-overflow: ellipsis;
`;
const LinkContainer = styled.div<IELinkContainer>`
  width: 100%;
  height: 35px;
  display: grid;
  grid-template-columns: 1fr 35px;
  border-radius: 20px;
  width: 100%;
  padding-top: 5px;
  padding-left: 10px;
  background-color: #2d2d2d;
  margin-bottom: 5px;
  cursor: pointer;
  ${(props) =>
    props.border
      ? css`
          border: 1px solid white;
        `
      : css``}
`;

const appendLink = (link: ILink, links: Array<ILink>, setLinks: ReactSet<Array<ILink>>) => {
  const i = links.findIndex((e) => e.uuid == link.uuid);

  if (i == -1) {
    setLinks([...links, link]);
  } else {
    const newLinks = [...links];
    newLinks[i] = link;
    setLinks(newLinks);
  }
  console.trace();
};
const removeLink = (link: ILink, links: Array<ILink>, setLinks: ReactSet<Array<ILink>>) => {
  const newLinks = [...links.filter((e) => e.uuid !== link.uuid)];
  console.log(newLinks);
  setLinks(newLinks);
};
interface IELink {
  children: string;
  link: ILink;
  inputLink: ILink | undefined;
  setInputLink: ReactSet<ILink | undefined>;
  links: Array<ILink>;
  setLinks: ReactSet<Array<ILink>>;
}

const Link = ({ children, link, inputLink, setInputLink, links, setLinks }: IELink) => {
  return (
    <LinkContainer border={link.uuid == inputLink?.uuid ? 1 : 0}>
      <LinkTitle
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          if (inputLink) {
            saveLink();
          }
          inputLink = { link: link.link, uuid: link.uuid, name: children };
          setInputLink(inputLink);
        }}
      >
        {children}
      </LinkTitle>
      <DelteImg
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          removeLink(link, links, setLinks);
          setInputLink(undefined);
        }}
      ></DelteImg>
    </LinkContainer>
  );
};
const LinkInputContainer = styled.form`
  background-color: #2d2d2d;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  padding: 10px;
`;
const LinkInputP = styled.p`
  color: white;
`;
const LinkInputInput = styled.input.attrs(() => ({
  type: "input",
}))`
  width: 100%;
  height: 20px;
  border-radius: 10px;
  background-color: #1e1e1e;
  border: none;
  outline: none;
  color: white;
`;
const DelteImg = styled.img.attrs(() => ({
  src: DeleteIcon,
}))`
  display: block
  width: 25px;
  height: 25px;
`;
const LinkInputSubmit = styled.input.attrs(() => ({
  type: "submit",
  value: "SAVE",
}))`
  width: 100px;
  height: 30px;
  margin-top: 10px;
  border-radius: 20px;
  background-color: #1e1e1e;
  color: white;
  border: 0;
`;

interface IELinkInput {
  inputLink: ILink | undefined;
  links: Array<ILink>;
  setLinks: ReactSet<Array<ILink>>;
}
let saveLink: () => void = () => {};

const LinkInput = ({ inputLink, links, setLinks }: IELinkInput) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  saveLink = () => {
    if (!nameInputRef?.current || !linkInputRef?.current) return;

    appendLink(
      {
        uuid: inputLink ? inputLink.uuid : createUUID(),
        name: nameInputRef.current.value,
        link: linkInputRef.current.value,
      },
      links,
      setLinks
    );
  };

  useEffect(() => {
    if (!nameInputRef?.current || !linkInputRef?.current || !inputLink) return;
    nameInputRef.current.value = inputLink.name;
    linkInputRef.current.value = inputLink.link;
  }, [inputLink]);

  return (
    <LinkInputContainer
      onSubmit={(event: React.FormEvent) => {
        event.preventDefault();
        saveLink();
      }}
    >
      <label>
        <LinkInputP>Name</LinkInputP>
        <LinkInputInput ref={nameInputRef}></LinkInputInput>
      </label>
      <label>
        <LinkInputP>Link</LinkInputP>
        <LinkInputInput ref={linkInputRef}></LinkInputInput>
      </label>
      <LinkInputSubmit></LinkInputSubmit>
    </LinkInputContainer>
  );
};

export default () => {
  const [links, setLinks] = useState<Array<ILink>>(window.api.loadLinks());
  const [inputLink, setInputLink] = useState<ILink>();

  useEffect(() => {
    setLinks(window.api.loadLinks());
  }, []);
  useEffect(() => {
    window.api.setLinks(links);
  }, [links]);

  return (
    <App>
      <List
        onClick={() => {
          if (inputLink) saveLink();
          setInputLink(undefined);
        }}
      >
        {links?.map((e) => (
          <Link
            link={e}
            inputLink={inputLink}
            setInputLink={setInputLink}
            links={links}
            setLinks={setLinks}
            key={e.uuid}
          >
            {e.name}
          </Link>
        ))}
      </List>
      <LinkInput inputLink={inputLink} links={links} setLinks={setLinks}></LinkInput>
    </App>
  );
};
