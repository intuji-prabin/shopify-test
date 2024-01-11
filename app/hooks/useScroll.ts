import {useEffect} from 'react';

/**
 * @description Hooks for handling scroll position of the section using tabs
 * @param scrollMenuId
 */

export function useScroll(scrollMenuId: string) {
  const handleScroll = (
    event: React.MouseEvent<HTMLElement>,
    sectionId: string,
  ) => {
    event.preventDefault();

    const tabLink = document.getElementsByClassName('tab__link');
    Array.from(tabLink).forEach((el) => el.classList.remove('active__tab'));

    const currentTarget = event.currentTarget;
    currentTarget.classList.add('active__tab');

    const section = document.getElementById(sectionId)?.offsetTop || 0;
    const menu = document.getElementById(scrollMenuId)?.offsetHeight || 0;

    window.scrollTo({
      top: section - menu,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const tabLink = document.getElementsByClassName('tab__link');
    tabLink[0].classList.add('active__tab');
  }, []);

  return {handleScroll};
}
