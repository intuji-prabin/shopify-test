export default function ArrowForward({
  fillColor = '#0F1010',
}: {
  fillColor?: string;
}) {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.26418 17.9358C9.09564 17.7671 9.00098 17.5383 9.00098 17.2998C9.00098 17.0613 9.09564 16.8326 9.26418 16.6638L13.4282 12.4998L9.26418 8.33582C9.10521 8.16521 9.01866 7.93955 9.02277 7.70639C9.02689 7.47323 9.12134 7.25077 9.28624 7.08587C9.45113 6.92097 9.6736 6.82652 9.90676 6.82241C10.1399 6.81829 10.3656 6.90484 10.5362 7.06382L15.3362 11.8638C15.5047 12.0326 15.5994 12.2613 15.5994 12.4998C15.5994 12.7383 15.5047 12.9671 15.3362 13.1358L10.5362 17.9358C10.3674 18.1044 10.1387 18.199 9.90018 18.199C9.66168 18.199 9.43293 18.1044 9.26418 17.9358Z"
        fill="#0F1010"
      />
    </svg>
  );
}
export function BlueArrowForward({
  fillColor = '#0092CF',
}: {
  fillColor?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill={fillColor}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.5298 12.2793C14.3892 12.4198 14.1986 12.4987 13.9998 12.4987C13.8011 12.4987 13.6105 12.4198 13.4698 12.2793L9.99985 8.80934L6.52985 12.2793C6.38767 12.4118 6.19963 12.4839 6.00532 12.4805C5.81102 12.4771 5.62564 12.3984 5.48822 12.261C5.35081 12.1235 5.2721 11.9382 5.26867 11.7439C5.26524 11.5496 5.33737 11.3615 5.46985 11.2193L9.46985 7.21934C9.61047 7.07889 9.8011 7 9.99985 7C10.1986 7 10.3892 7.07889 10.5298 7.21934L14.5298 11.2193C14.6703 11.36 14.7492 11.5506 14.7492 11.7493C14.7492 11.9481 14.6703 12.1387 14.5298 12.2793Z"
        fill={fillColor}
      />
    </svg>
  );
}
