export function OrderInformationError({errorMessage}: {errorMessage: string}) {
  return (
    <div className="flex gap-3 py-2 pl-2 pr-4 border-l-4 border-r-0 bg-semantic-danger-100 border-semantic-danger-500 border-y-0">
      <span className="flex items-center text-semantic-danger-500">*</span>
      <p className="text-base font-normal leading-[21px]">{errorMessage}</p>
    </div>
  );
}
