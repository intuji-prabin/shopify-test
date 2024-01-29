import React from 'react';
import {Arrowleft} from '~/components/icons/arrowleft';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Routes} from '~/lib/constants/routes.constent';

export default function CompanyBreadcrumb({title}: {title: string}) {
  return (
    <>
      <div className="mb-4 flex flex-col gap-[6px]">
        <div className="flex gap-4 ">
          <button className="border-[1px] border-grey-100 h-10 w-10 flex items-center justify-center">
            <Arrowleft />
          </button>
          <h3 className="text-grey-900">Company Settings Management</h3>
        </div>
        <Breadcrumb>
          <BreadcrumbItem href={Routes.SUPPORT}>
            Company Settings
          </BreadcrumbItem>
          <BreadcrumbItem
            href={Routes.SUPPORT_CONTACT_US}
            className="text-grey-900"
          >
            {title}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </>
  );
}
