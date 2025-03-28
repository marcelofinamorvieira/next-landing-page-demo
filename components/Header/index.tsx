'use client';

import LanguageSelector from '@/components/Header/LanguageSelector';
import NotificationStrip from '@/components/Header/NotificationStrip';
import PostLanguageSelector from '@/components/Header/PostLanguageSelector';
import type { CommonLayoutQuery } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import { buildUrl } from '@/utils/globalPageProps';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Menu = {
  id: string;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};

type Props = {
  globalPageProps: GlobalPageProps;
  data: CommonLayoutQuery;
  isPostPage: boolean;
  currentSlug: string;
};

/**
 * Header component used across all pages in the common layout
 * Now uses explicit typing for route information passed from PostRouteDetector
 */
const Header = ({ globalPageProps, data, isPostPage, currentSlug }: Props) => {
  const menuData: Menu[] = [];

  data.layout?.menu.map((item) => {
    if (item.__typename === 'MenuDropdownRecord') {
      const dropdownItem = item;
      menuData.push({
        id: '1',
        title: dropdownItem.title || 'Other Items',
        newTab: false,
        submenu: dropdownItem.items.map((item) => {
          return {
            id: item.id,
            title: item.title,
            path: `/${item.page.slug}`,
            newTab: true,
          };
        }),
      });
    } else {
      const menuItem = item;
      menuData.push({
        id: menuItem.id,
        title: menuItem.title,
        path: `/${menuItem.page.slug}`,
        newTab: false,
      });
    }
  });

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [notificationStrip, setNotificationStrip] = useState(
    !isEmptyDocument(data.layout?.notification),
  );

  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <>
      {notificationStrip && (
        <NotificationStrip
          notification={data.layout?.notification}
          globalPageProps={globalPageProps}
          setNotificationStrip={setNotificationStrip}
        />
      )}
      <header
        className={`header left-0 z-40 flex w-full items-center bg-transparent ${
          sticky
            ? 'fixed top-0 z-50 bg-white bg-opacity-80 shadow-sticky backdrop-blur-sm transition'
            : `absolute ${notificationStrip ? 'top-10' : 'top-0'}`
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href={buildUrl(globalPageProps)}
                className={`header-logo block w-full ${
                  sticky ? 'py-5 lg:py-2' : 'py-8'
                } `}
              >
                {data.layout?.logo.url && (
                  <Image
                    src={data.layout.logo.url}
                    alt="logo"
                    width={140}
                    height={30}
                    className="w-full dark:hidden"
                    priority
                  />
                )}
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  type="button"
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? ' top-[7px] rotate-45' : ' '
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? 'opacity-0 ' : ' '
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? ' top-[-8px] -rotate-45' : ' '
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? 'visibility top-full opacity-100'
                      : 'invisible top-[120%] opacity-0'
                  }`}
                >
                  <ul className="block items-center lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li key={menuItem.id} className="group relative">
                        {menuItem.path ? (
                          <Link
                            href={buildUrl(globalPageProps, menuItem.path)}
                            className={
                              'flex py-2 text-base text-dark group-hover:opacity-70 dark:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6'
                            }
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:opacity-70 dark:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg
                                  width="15"
                                  height="14"
                                  viewBox="0 0 15 14"
                                  aria-hidden="false"
                                >
                                  <title>Dropdown Arrow</title>
                                  <path
                                    d="M7.81602 9.97495C7.68477 9.97495 7.57539 9.9312 7.46602 9.8437L2.43477 4.89995C2.23789 4.70308 2.23789 4.39683 2.43477 4.19995C2.63164 4.00308 2.93789 4.00308 3.13477 4.19995L7.81602 8.77183L12.4973 4.1562C12.6941 3.95933 13.0004 3.95933 13.1973 4.1562C13.3941 4.35308 13.3941 4.65933 13.1973 4.8562L8.16601 9.79995C8.05664 9.90933 7.94727 9.97495 7.81602 9.97495Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </button>
                            <div
                              className={`submenu relative left-0 top-full rounded-md bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? 'block' : 'hidden'
                              }`}
                            >
                              {menuItem.submenu?.map((submenuItem) => (
                                <Link
                                  href={buildUrl(
                                    globalPageProps,
                                    submenuItem.path,
                                  )}
                                  key={submenuItem.id}
                                  className="block rounded py-2.5 text-sm text-dark hover:opacity-70 dark:text-white lg:px-3"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                <div className="hidden lg:flex">
                  {/* Display language selectors based on whether it's a post page */}
                  {isPostPage ? (
                    <PostLanguageSelector
                      globalPageProps={globalPageProps}
                      languages={data._site.locales}
                      currentSlug={currentSlug}
                    />
                  ) : (
                    <LanguageSelector
                      globalPageProps={globalPageProps}
                      languages={data._site.locales}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
