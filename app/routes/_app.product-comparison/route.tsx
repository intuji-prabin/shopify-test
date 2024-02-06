import ComparisonBreadcrumb from './comparison-breadcrumb';
import ComparisonWrapper from './comparison-main-wrapper';

export default function route() {
  return (
    <section className="container py-12 ">
      <ComparisonBreadcrumb title={'compare'} />
      <ComparisonWrapper />{' '}
    </section>
  );
}
