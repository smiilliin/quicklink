import { useEffect, useState } from "react";
import DirIcon from "./dir.svg";
import WWWIcon from "./www.svg";
import styled, { keyframes, css } from "styled-components";

const IconAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
`;
interface IELinkContainer {
  animate: number;
}

const undraggable = css`
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

const LinkContainer = styled.div<IELinkContainer>`
  position: relative;
  width: 100px;
  height: 100px;
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;
  ${undraggable}

  ${(props) =>
    props.animate
      ? css`
          animation: ${IconAnimation} 0.5s;
        `
      : ``};
`;
const Icon = styled.img`
  width: 100px;
  height: 100px;
  background-color: ${(props) => props.theme.mainBackground};
  display: block;
  ${undraggable}
`;
const IconTag = styled.span`
  left: 10px;
  bottom: 20px;
  color: black;
  position: absolute;
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
`;
interface IELink {
  children: string;
  link: string;
}
const Link = ({ children, link }: IELink) => {
  const [animate, setAnimate] = useState(false);
  return (
    <LinkContainer
      onClick={() => {
        setAnimate(true);

        setTimeout(() => {
          setAnimate(false);
          window.api.open(link.replaceAll('"', ""));
        }, 500);
      }}
      animate={animate ? 1 : 0}
    >
      <Icon src={/^http:|^https:/g.test(link) ? WWWIcon : DirIcon}></Icon>
      <IconTag>{children}</IconTag>
    </LinkContainer>
  );
};

const App = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  ${undraggable}
`;

export default () => {
  const [links, setLinks] = useState<Array<ILink>>();

  useEffect(() => {
    window.api.forLinks(setLinks);
  }, []);

  return (
    <App>
      {links?.map((element: ILink) => (
        <Link link={element.link} key={element.uuid}>
          {element.name}
        </Link>
      ))}
    </App>
  );
};
