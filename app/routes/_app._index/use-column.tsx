import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Link } from 'react-router-dom';
import { DownloadIcon } from '~/components/icons/download-icon';
import { EyeOn } from '~/components/icons/eye';
import { Button } from '~/components/ui/button';
import { OrderStatusChip } from '~/components/ui/order-status-chip';
import { useDownload } from '~/hooks/useDownload';
import { PDF } from '~/lib/constants/pdf.constent';
import { Routes } from '~/lib/constants/routes.constent';
import { formatDateToLocaleDateString } from '~/lib/helpers/dateTime.helper';
import { Invoices } from '~/routes/_app.invoices/invoices.server';

export function useSpendingByProductColumn() {
    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'productName',
                header: 'Product name',
                enableSorting: false,
                cell: (info) => {
                    const product = info.row.original;
                    return (
                        <div className="flex items-center gap-x-3">
                            <div className="h-12 aspect-square">
                                <img src="/product.png" alt={product?.product_name} className="object-contain w-full h-full" />
                            </div>
                            <p>{product?.product_name}</p>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'date',
                header: 'Recent Purchased Date',
                enableSorting: false,
                cell: (info) => {
                    const product = info.row.original;
                    return (
                        <p>{product?.recent_purchase_date}</p>
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
                        <p>{product?.quantity}</p>
                    );
                },
            },
            {
                accessorKey: 'spending',
                header: 'Total Spending',
                enableSorting: false,
                cell: (info) => {
                    const product = info.row.original;
                    return (
                        <p>${product?.total_spending.toFixed(2)}</p>
                    );
                },
            },
            {
                accessorKey: 'action',
                header: 'Action',
                enableSorting: false,
                cell: (info) => {
                    const productSlug = info.row.original.slug;
                    return (
                        <div className="flex justify-start gap-x-2">
                            <Link to={productSlug ? productSlug : ""}>
                                <Button size="icon" variant="icon">
                                    <EyeOn />
                                </Button>
                            </Link>
                        </div>
                    );
                },
            },
        ],
        [],
    );

    return { columns };
}


export function useColumn() {
    const columns = useMemo<ColumnDef<Invoices>[]>(
        () => [
            {
                accessorKey: 'invoiceId',
                header: 'Invoice No.',
                enableSorting: false,
                cell: (info) => info.getValue() ?? 'N/A',
            },
            {
                accessorKey: 'invoiceDate',
                header: 'Date',
                enableSorting: false,
                cell: (info) =>
                    info.getValue()
                        ? formatDateToLocaleDateString(info.getValue() as string)
                        : 'N/A',
            },
            {
                accessorKey: 'invoiceAmount',
                header: 'Invoice Amount',
                enableSorting: false,
                cell: (info) => info.getValue() ?? 'N/A',
            },
            {
                accessorKey: 'invoiceStatus',
                header: 'Invoice Status',
                enableSorting: false,
                cell: (info) => {
                    const status = info.row.original.invoiceStatus;
                    return <OrderStatusChip status={status} />;
                },
            },
            {
                accessorKey: 'actions',
                header: 'View Invoice',
                enableSorting: false,
                cell: (info) => {
                    const invoiceId = info.row.original.invoiceId;
                    const fileURL = info.row.original.files;
                    const invoiceDetailsRoute = `${Routes.INVOICES}/${invoiceId}`;

                    const { handleDownload } = useDownload();

                    return (
                        <div className="flex justify-start gap-x-2">
                            <Link to={invoiceDetailsRoute}>
                                <Button size="icon" variant="icon">
                                    <EyeOn />
                                </Button>
                            </Link>
                            <Button
                                size="icon"
                                variant="icon"
                                onClick={() =>
                                    handleDownload({
                                        url: fileURL,
                                        headers: { apiKey: PDF.SECRET_KEY },
                                    })
                                }
                            >
                                <DownloadIcon />
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [],
    );

    return { columns };
}