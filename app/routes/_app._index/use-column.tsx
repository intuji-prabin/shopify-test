import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export function useSpendingByProductColumn() {
    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'items',
                header: 'Items',
                enableSorting: false,
                cell: (info) => {
                    const product = info.row.original;
                    return (
                        <div>test</div>
                    );
                },
            },
            {
                accessorKey: 'quantity',
                header: 'Quantity',
                enableSorting: false,
                cell: (info) => {
                    const product = info.row.original;
                    return (
                        <div>test</div>
                    );
                },
            },
            {
                accessorKey: 'uom',
                header: 'UOM',
                enableSorting: false,
                cell: (info) => {
                    const product = info.row.original;

                    return (
                        <div>test</div>
                    );
                },
            },
            {
                accessorKey: 'total',
                header: 'Price',
                enableSorting: false,
                cell: (info) => {
                    const productTotal = info.row.original.companyPrice;
                    const priceRange = info.row.original.priceRange;
                    const quantity = info.row.original.quantity;
                    const product = info.row.original;
                    const UOM = info.row.original.uom;
                    return (
                        <div>test</div>
                    );
                },
            },
        ],
        [],
    );

    return { columns };
}