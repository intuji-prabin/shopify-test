export default function CloseMenu({
  fillColor = '#FFE600',
}: {
  fillColor?: string;
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="2.0323"
        height="20.4375"
        rx="1.01615"
        transform="matrix(0.70211 0.712068 -0.70211 0.712068 18.3494 4)"
        fill={fillColor}
      />
      <rect
        width="2.0323"
        height="20.4375"
        rx="1.01615"
        transform="matrix(0.70211 -0.712068 0.70211 0.712068 4.22375 5.44714)"
        fill={fillColor}
      />
    </svg>
  );
}
