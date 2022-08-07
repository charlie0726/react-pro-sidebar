import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { useSidebar } from '../hooks/useSidebar';

export interface HeaderProps extends React.HTMLAttributes<HTMLHeadElement> {
  height?: string;
  fixed?: boolean;
}

interface StyledHeaderProps extends HeaderProps {
  collapsedSidebar?: boolean;
  brokenSidebar?: boolean;
  fixedSidebar?: boolean;
  sidebarWidth?: string;
  sidebarCollapsedWidth?: string;
  transitionDuration: number;
  mounted: boolean;
}

const StyledHeader = styled.header<StyledHeaderProps>`
  height: ${({ height }) => height};
  min-height: ${({ height }) => height};
  position: relative;

  ${({ fixed, fixedSidebar, collapsedSidebar, sidebarWidth, sidebarCollapsedWidth, height }) =>
    fixed
      ? `
      position: fixed;
      z-index: 2;
        ~ .layout,
        ~ .content {
          margin-top: ${height};
        }

        ${
          fixedSidebar
            ? `width:calc(100% - ${collapsedSidebar ? sidebarCollapsedWidth : sidebarWidth})`
            : 'width: 100%;'
        }
        `
      : 'width: 100%;'};

  ${({ brokenSidebar }) => (brokenSidebar ? 'width: 100% !important;transition: none;' : '')}

  ${({ mounted, transitionDuration }) =>
    mounted ? `transition: width ${transitionDuration}ms;` : ''}
`;

export const Header: React.FC<HeaderProps> = ({
  height = '64px',
  fixed = false,
  className,
  children,
  ...rest
}) => {
  const [mounted, setMounted] = React.useState(false);

  const {
    collapsed: collapsedSidebar,
    fixed: fixedSidebar,
    width: sidebarWidth,
    collapsedWidth: sidebarCollapsedWidth,
    broken: brokenSidebar,
    transitionDuration,
  } = useSidebar();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <StyledHeader
      data-testid="header-test-id"
      mounted={mounted}
      height={height}
      fixed={fixed}
      collapsedSidebar={collapsedSidebar}
      brokenSidebar={brokenSidebar}
      fixedSidebar={fixedSidebar}
      sidebarWidth={sidebarWidth}
      sidebarCollapsedWidth={sidebarCollapsedWidth}
      transitionDuration={transitionDuration ?? 300}
      className={classnames('header', className)}
      {...rest}
    >
      {children}
    </StyledHeader>
  );
};