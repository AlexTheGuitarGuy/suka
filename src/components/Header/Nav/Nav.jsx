import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import cn from 'classnames';
import { getNavItems } from '../../../redux/navbar-selector';
import { useSelector } from 'react-redux';
import useTagBlur from '../../../hooks/useTagBlur';
import { useLocation } from 'react-router';
import useScreenSize from '../../hooks/useScreenSize';

const Nav = () => {
  const navItems = useSelector(getNavItems);
  const [shouldShowMenu, setShouldShowMenu] = useState(false);

  const menuRef = useTagBlur(shouldShowMenu, setShouldShowMenu);
  const screenSize = useScreenSize();

  const location = useLocation();

  let navElements = navItems.map((e) => {
    let isActive = false;
    if (location.pathname.match(e.to)) isActive = true;
    return (
      <NavLink key={e.id} to={e.to} className="sm:mb-3 lg:mb-0">
        <div
          className={cn(
            `
            transition-colors
            font-semibold 
            
            lg:text-lg sm:text-2xl
            lg:hover:text-gray-600 lg:active:text-gray-500
            lg:hover:bg-transparent
            lg:p-0 lg:mr-4 lg:rounded-none
            lg:border-b-2
                        
            sm:active:bg-gray-300 
            sm:px-2 sm:py-1 
            sm:rounded 
            sm:w-full
            sm:text-center
            
            `,
            {
              'lg:border-gray-500 lg:bg-transparent sm:bg-gray-300': isActive,
            },
            {
              'lg:border-transparent lg:hover:border-gray-400': !isActive,
            },
          )}
        >
          {e.name}
        </div>
      </NavLink>
    );
  });

  if (screenSize.dynamicWidth <= 720) {
    return (
      <div>
        <button
          onClick={() => setShouldShowMenu(!shouldShowMenu)}
          className={cn('rounded p-1', {
            'bg-gray-200': shouldShowMenu,
          })}
        >
          <img
            src={require('../../../assets/burger-menu.png')}
            alt="burger menu"
            className="w-10 h-10"
          />
        </button>

        <nav>
          <div
            className={cn(
              `fixed left-0 top-16
                flex flex-col justify-center
                w-full
                bg-gray-200 p-8
                border-b border-gray-400
                rounded-b
                font-semibold
                transition-opacity`,
              { 'opacity-0': !shouldShowMenu },
              { 'opacity-100': shouldShowMenu },
            )}
            ref={menuRef}
          >
            {shouldShowMenu && navElements}
          </div>
        </nav>
      </div>
    );
  }

  return <nav className="flex flex-row">{navElements}</nav>;
};

export default Nav;
