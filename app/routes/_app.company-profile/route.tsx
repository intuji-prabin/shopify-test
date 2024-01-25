import CompanyBreadcrumb from './company-breadcrumb';
import InfoBar from '~/components/ui/layouts/infoBar';
import CompanyProfileDetail from './company-profile-detail';

export default function Company_Profile_Management() {
  return (
    <div className="container py-12 bg-primary-25 ">
      <div>
        <CompanyBreadcrumb title={'Company Profile Management'} />

        <InfoBar
          title={'To edit or add new details please '}
          url={'contact us'}
        />
        <CompanyProfileDetail />
      </div>
    </div>
  );
}
