namespace ep;

using util from '../../cm/util/util-model';
using {ep as dtl} from './EP_LI_DTL-model';

entity Li_Supplier {
    key tenant_id        : String(5) not null;
    key company_code     : String(10) not null;
    key loi_write_number : String(50) not null;
    key loi_item_number  : String(50) not null;

        item             : Association[1] to dtl.Li_Dtl
                               on  item.tenant_id        = tenant_id
                               and item.company_code     = company_code
                               and item.loi_write_number = loi_write_number
                               and item.loi_item_number  = loi_item_number;

    key supplier_code    : String(15) not null;
        vendor_pool_code : String(20);
        remark           : String(3000);
}

extend Li_Supplier with util.Managed;
