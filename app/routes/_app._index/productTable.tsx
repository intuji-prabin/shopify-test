import { Expenditure } from "~/components/icons/expenditure";
import { DataTable } from "~/components/ui/data-table";
import { Can } from "~/lib/helpers/Can";
import { useSpendingByProductColumn } from "./use-column";
import { useTable } from "~/hooks/useTable";

const ProductTable = ({ productList, currency }: { productList: any, currency: string }) => {
    const { columns } = useSpendingByProductColumn(currency);
    const { table } = useTable(columns, productList);
    return (
        <section className="container">
            <Can I="view" a="view_spending_list">
                <div className="p-6 space-y-3 bg-white mxs:space-y-6">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-x-2 gap-y-1">
                            <span className='flex items-center justify-center w-12 h-12 bg-primary-200'>
                                <Expenditure />
                            </span>
                            <h4>Spending by products</h4>
                        </div>
                    </div>
                    <DataTable table={table} columns={columns} />
                </div>
            </Can>
        </section>
    );
}

export default ProductTable;