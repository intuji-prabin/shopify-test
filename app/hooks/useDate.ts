import {useOrdinal} from './useOrdinal';

const useDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const day = today.getDate();
  const ordinalDay = useOrdinal(day);
  const optionShort: Intl.DateTimeFormatOptions = {month: 'short'};
  const optionLong: Intl.DateTimeFormatOptions = {month: 'long'};
  const monthShort: string = today.toLocaleString('en-US', optionShort);
  const monthLong: string = today.toLocaleString('en-US', optionLong);
  const januaryFirst = new Date(today.getFullYear(), 0, 1);
  const differenceInDays = Math.floor(
    (today.getTime() - januaryFirst.getTime()) / (24 * 60 * 60 * 1000),
  );
  return {
    currentDate: `${ordinalDay}`,
    currentLongMonth: `${monthLong}`,
    currentShortMonth: `${monthShort}`,
    currentYear: `${year}`,
    daysIntoYear: `${differenceInDays}`,
  };
};

export default useDate;
