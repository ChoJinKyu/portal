namespace ep;

using util from '../../cm/util/util-model';
using {ep as dtl} from './EP_LI_DTL-model';

entity Li_Supplier_Selection {
    key tenant_id                  : String(5) not null;
    key company_code               : String(10) not null;
    key loi_selection_number       : String(50) not null;

        item                       : Association[ * ] to dtl.Li_Dtl
                                         on  item.tenant_id            = tenant_id
                                         and item.company_code         = company_code
                                         and item.loi_selection_number = loi_selection_number;

        loi_selection_title        : String(100);
        loi_selection_status_code  : String(30);
        attch_group_number         : String(100);
        approval_number            : String(50);
        buyer_empno                : String(30);
        purchasing_department_code : String(30);
        supplier_selection_date    : Date;
        remark                     : String(3000);
        org_type_code              : String(2);
        org_code                   : String(10);
}

extend Li_Supplier_Selection with util.Managed;
