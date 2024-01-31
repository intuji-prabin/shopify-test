import {LargeMailIcon} from '~/components/icons/mail';

export default function NotificationClear() {
  return (
    <>
      <div className="flex">
        <figure>
          <LargeMailIcon />
        </figure>
        <div>
          <h3>LargeMailIcon</h3>
          <p>Congratulations! You cleared your important notifications</p>
        </div>
      </div>
    </>
  );
}
