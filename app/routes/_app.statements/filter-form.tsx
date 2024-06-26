import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { ValidatedForm } from 'remix-validated-form';
import { Separator } from '~/components/ui/separator';
import { withZod } from '@remix-validated-form/with-zod';
import { Link, useSearchParams } from '@remix-run/react';
import { Routes } from '~/lib/constants/routes.constent';
import { SheetClose, SheetFooter } from '~/components/ui/sheet';
import { DatePickerWithRange } from '~/components/ui/date-range-picker';

const StatementsFilterFormSchema = z.object({
    statementDateRange: z
        .object({
            statementDateFrom: z.string().trim().optional(),
            statementDateTo: z.string().trim().optional(),
        })
        .optional(),
});

export const StatementsFilterFormSchemaValidator = withZod(
    StatementsFilterFormSchema,
);

export type StatementsFilterFormType = z.infer<typeof StatementsFilterFormSchema>;

export type StatementsFilterFormFieldNameType = keyof StatementsFilterFormType;

export default function StatementsFilterForm() {
    const [searchParams] = useSearchParams();

    const statementDateFrom = searchParams.get('statementDateFrom');

    const statementDateTo = searchParams.get('statementDateTo');

    const defaultStatementDateRangeValues = {
        from: statementDateFrom ? new Date(statementDateFrom) : undefined,
        to: statementDateTo ? new Date(statementDateTo) : undefined,
    };

    return (
        <ValidatedForm
            method="GET"
            id="statement-filter-form"
            validator={StatementsFilterFormSchemaValidator}
        >
            <div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <h5 className="pb-2">Statement Date</h5>
                        <SheetClose asChild>
                            <Link
                                to={Routes.STATEMENTS}
                                className="text-sm italic font-bold leading-6 text-primary-500"
                            >
                                RESET ALL
                            </Link>
                        </SheetClose>
                    </div>
                    <DatePickerWithRange
                        fromFieldName="statementDateFrom"
                        toFieldName="statementDateTo"
                        dateRange={defaultStatementDateRangeValues}
                    />
                </div>
            </div>
            <Separator />
            <SheetFooter className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-4 p-6 shadow-top">
                <SheetClose asChild>
                    <Button type="button" variant="ghost">
                        cancel
                    </Button>
                </SheetClose>
                <SheetClose asChild>
                    <Button
                        type="submit"
                        data-cy="apply-filter"
                        className="whitespace-nowrap"
                    >
                        apply filter
                    </Button>
                </SheetClose>
            </SheetFooter>
        </ValidatedForm>
    );
}
