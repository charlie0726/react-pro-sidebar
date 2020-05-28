import React, { useState, forwardRef, LegacyRef, useRef, useEffect, useContext } from 'react';
import classNames from 'classnames';
import SlideDown from 'react-slidedown';
import { createPopper } from '@popperjs/core';
import ResizeObserver from 'resize-observer-polyfill';
import { SidebarContext } from '../ProSidebar';

export interface Props {
  className?: string;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  firstchild?: boolean;
}

const SubMenu: React.ForwardRefRenderFunction<unknown, Props> = (
  {
    children,
    icon,
    className,
    title,
    defaultOpen = false,
    open,
    prefix,
    suffix,
    firstchild,
    ...rest
  },
  ref,
) => {
  let popperInstance;
  const { collapsed, rtl } = useContext(SidebarContext);
  const [closed, setClosed] = useState(!defaultOpen);
  const popperElRef = useRef();
  const referenceElement = useRef();
  const popperElement = useRef();

  const handleToggleSubMenu = () => {
    setClosed(!closed);
  };

  useEffect(() => {
    if (firstchild) {
      if (popperInstance) {
        popperInstance.destroy();
        popperInstance = null;
      }

      if (referenceElement.current && popperElement.current) {
        popperInstance = createPopper(referenceElement.current, popperElement.current, {
          placement: 'right',
          strategy: 'fixed',
          modifiers: [
            {
              name: 'computeStyles',
              options: {
                adaptive: false,
              },
            },
          ],
        });
      }

      if (popperElRef.current) {
        const ro = new ResizeObserver(() => {
          if (popperInstance) {
            popperInstance.update();
          }
        });

        ro.observe(popperElRef.current);
        ro.observe(referenceElement.current);
      }
    }
  }, [collapsed, rtl]);

  const subMenuRef: LegacyRef<HTMLLIElement> = (ref as any) || React.createRef<HTMLLIElement>();

  return (
    <li
      ref={subMenuRef}
      className={classNames('pro-menu-item pro-sub-menu', className, {
        open: typeof open === 'undefined' ? !closed : open,
      })}
    >
      <div
        {...rest}
        ref={referenceElement}
        className="pro-inner-item"
        onClick={handleToggleSubMenu}
        onKeyPress={handleToggleSubMenu}
        role="button"
        tabIndex={0}
      >
        {icon ? (
          <span className="pro-icon-wrapper">
            <span className="pro-icon">{icon}</span>
          </span>
        ) : null}
        {prefix ? <span className="prefix-wrapper">{prefix}</span> : null}
        <span className="pro-item-content">{title}</span>
        {suffix ? <span className="suffix-wrapper">{suffix}</span> : null}
        <span className="pro-arrow-wrapper">
          <span className="pro-arrow" />
        </span>
      </div>

      {firstchild && collapsed ? (
        <div ref={popperElement} className="pro-inner-list-item">
          <div ref={popperElRef}>
            <ul>{children}</ul>
          </div>
        </div>
      ) : (
        <SlideDown
          closed={typeof open === 'undefined' ? closed : !open}
          className="pro-inner-list-item"
        >
          <div ref={popperElRef}>
            <ul>{children}</ul>
          </div>
        </SlideDown>
      )}
    </li>
  );
};

export default forwardRef<unknown, Props>(SubMenu);