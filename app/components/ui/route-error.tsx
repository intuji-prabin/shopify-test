export function RouteError({
  errorMessage = ' Please try again in a little while.',
}: {
  errorMessage?: string;
}) {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh_-_540px)] ">
      <div className="flex flex-col items-center gap-4">
        <RouteErrorIcon />
        <h3>Oops! Something went wrong</h3>
        <p className="font-normal leading-[22px] text-lg text-grey">
          {errorMessage}
        </p>
      </div>
    </div>
  );
}

function RouteErrorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
    >
      <g id="warning_solid" transform="translate(-1654 -20)">
        <path
          id="Path_19789"
          data-name="Path 19789"
          d="M0,0H24V24H0Z"
          transform="translate(1654 20)"
          fill="none"
        />
        <path
          id="Icon_ionic-ios-warning"
          data-name="Icon ionic-ios-warning"
          d="M11.9,5.249,3.554,20.473A1.432,1.432,0,0,0,4.83,22.588H21.519A1.435,1.435,0,0,0,22.8,20.473L14.449,5.249A1.462,1.462,0,0,0,11.9,5.249ZM14,11.566l-.17,5.747H12.513l-.17-5.747Zm-.829,8.874a.867.867,0,1,1,.9-.867A.875.875,0,0,1,13.173,20.44Z"
          transform="translate(1652.703 18.251)"
          fill="#f7921e"
        />
      </g>
    </svg>
  );
}
