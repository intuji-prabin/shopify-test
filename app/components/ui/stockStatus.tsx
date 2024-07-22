import type { StockStatus } from "~/routes/_app.cart-list/order-my-products/use-column";

const statusStyles = {
    inStock: "text-semantic-success-500",
    lowStock: "text-semantic-warning-500",
    outOfStock: "text-semantic-danger-500",
};

export function StockStatus({ status }: { status: StockStatus }) {
    let statusText, statusClass;
    switch (status) {
        case 'In Stock':
            statusText = "IN STOCK";
            statusClass = statusStyles.inStock;
            break;
        case 'Low Stock':
            statusText = "LOW STOCK";
            statusClass = statusStyles.lowStock;
            break;
        case 'Out of Stock':
            statusText = "OUT OF STOCK";
            statusClass = statusStyles.outOfStock;
            break;
        default:
            return 'N/A';
    }
    return (
        <div className={`inline-flex items-center ${status === "In Stock" && 'pt-[5px]'} text-sm font-medium uppercase leading-4 whitespace-nowrap ${statusClass}`}>
            <span className="w-2 h-2 mr-1.5 bg-current rounded-full"></span>
            {statusText}
        </div>
    );
}