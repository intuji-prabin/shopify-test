import {useRef, useState} from 'react';
import {FaSearch} from 'react-icons/fa';
import {CSVFileType, UploadCsv} from '~/routes/_app.place-an-order/upload-csv';
import RecomendedProduct from './layouts/elements/recomended-products/recomended-product';
import {useOutsideClick} from '~/hooks/useOutsideClick';

export function ProductSearchBar() {
  const [showSuggestions, setShowSuggestions] = useState(false);

  function handleInputClick() {
    setShowSuggestions(true);
  }
  const productRef = useRef<HTMLDivElement>(null);
  useOutsideClick(productRef, () => setShowSuggestions(false));

  return (
    <div
      className="search-bar flex bg-white items-center min-w-[unset] w-full px-4 py-3 xl:min-w-[453px] max-h-14 relative"
      ref={productRef}
    >
      <FaSearch className="search-icon fill-primary-500 h-5 w-5" />
      <input
        type="text"
        placeholder="Rapid Product Search.."
        className="border-none w-full placeholder-italic text-base font-bold text-grey-700 placeholder-text-[#0F1010] focus:bg-white "
        onClick={handleInputClick}
      />
      {showSuggestions && <RecomendedProduct />}
    </div>
  );
}

export default function UploadSearchbar() {
  const [csvToArray, setCsvToArray] = useState<CSVFileType[]>([]);

  return (
    <div className="  bg-primary-500 ">
      <div className="container flex gap-6 items-center py-6">
        <ProductSearchBar />
        <UploadCsv setCsvToArray={setCsvToArray} />
      </div>
    </div>
  );
}
