namespace ep;

using util from '../../cm/util/util-model';


entity Uc_Quotation_Mst {
    key tenant_id                     : String(5) not null;
    key company_code                  : String(10) not null;
    key const_quotation_number        : String(30) not null;
        org_type_code                 : String(2);
        org_code                      : String(10);
        const_name                    : String(200);
        quotation_status_code         : String(30);
        ep_item_code                  : String(50);
        const_start_date              : Date;
        const_end_date                : Date;
        supplier_code                 : String(10);
        rfq_date                      : Date;
        const_person_empno            : String(30);
        const_department_code         : String(50);
        buyer_empno                   : String(30);
        purchasing_department_code    : String(50);
        supplier_person_id            : String(255);
        quotation_write_date          : Date;
        quotation_confirmed_date      : Date;
        quotation_amount              : Decimal;
        //currency_code                 : String(15);
        attch_group_number            : String(100);
        completion_flag               : Boolean;
        completion_date               : Date;
        facility_person_empno         : String(30);
        facility_department_code      : String(50);
        completion_attch_group_number : String(100);
        remark                        : String(3000);
        pr_number                     : String(50);
        pr_item_number                : String(10);
        pr_desc                       : String(200);
        delivery_request_date         : Date;
}

extend Uc_Quotation_Mst with util.Managed;
