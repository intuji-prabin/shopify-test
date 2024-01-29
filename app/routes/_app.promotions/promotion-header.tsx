import { Breadcrumb, BreadcrumbItem } from "~/components/ui/breadcrumb";
import { Routes } from "~/lib/constants/routes.constent";

const PromotionHeader = () => {
    return (
        <section className="container">
            <h3>Promotions</h3>
            <Breadcrumb>
                <BreadcrumbItem>Content Management</BreadcrumbItem>
                <BreadcrumbItem href={Routes.PROMOTION} className="text-grey-900">Promotions</BreadcrumbItem>
            </Breadcrumb>
        </section>
    );
}

export default PromotionHeader;