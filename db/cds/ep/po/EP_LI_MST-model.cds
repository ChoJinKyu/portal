namespace ep;

using util from '../../cm/util/util-model';
using {ep as dtl} from './EP_LI_DTL-model';

entity Li_Mst {
    key tenant_id                : String(5) not null;
    key company_code             : String(10) not null;
    key loi_write_number         : String(50) not null;

        item                     : Association[ * ] to dtl.Li_Dtl
                                       on  item.tenant_id        = tenant_id
                                       and item.company_code     = company_code
                                       and item.loi_write_number = loi_write_number;

        loi_number               : String(50);
        loi_request_title        : String(100);
        loi_request_status_code  : String(30);
        loi_publish_purpose_desc : String(1000);
        investment_review_flag   : Boolean;
        special_note             : LargeString;	
        attch_group_number       : String(100);
        approval_number          : String(50);
        requestor_empno          : String(30);
        request_department_code  : String(50);
        request_date             : Date;
        org_type_code            : String(2);
        org_code                 : String(10);
}

extend Li_Mst with util.Managed;