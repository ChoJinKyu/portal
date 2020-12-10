namespace ep;

using util from '../../cm/util/util-model';
using {ep as mst} from './EP_LI_MST-model';
using {ep as vdsel} from './EP_LI_SUPPLIER_SELECTION-model';
using {ep as pub} from './EP_LI_PUBLISH-model';

entity Li_Dtl {
    key tenant_id                       : String(5) not null;
    key company_code                    : String(10) not null;
    key loi_write_number                : String(50) not null;

        header                          : Association[1] to mst.Li_Mst
                                              on  header.tenant_id        = tenant_id
                                              and header.company_code     = company_code
                                              and header.loi_write_number = loi_write_number;

    key loi_item_number                 : String(50) not null;
        item_sequence                   : Decimal;
        ep_item_code                    : String(50);
        item_desc                       : String(200);
        request_quantity                : Decimal;
        unit                            : String(3);
        request_amount                  : Decimal;
        currency_code                   : String(15);
        spec_desc                       : String(1000);
        plant_code                      : String(10);
        delivery_request_date           : String(8);
        buyer_empno                     : String(30);
        purchasing_department_code      : String(30);
        loi_selection_number            : String(50);
        loi_publish_number              : String(50);

        selection                       : Association[1] to vdsel.Li_Supplier_Selection
                                              on  selection.tenant_id            = tenant_id
                                              and selection.company_code         = company_code
                                              and selection.loi_selection_number = loi_selection_number;

        publish                         : Association[1] to pub.Li_Publish
                                              on  publish.tenant_id          = tenant_id
                                              and publish.company_code       = company_code
                                              and publish.loi_publish_number = loi_publish_number;

        quotation_number                : Decimal;
        quotation_item_number           : Decimal;
        contract_number                 : String(50);
        contract_item_number            : String(10);
        purchasing_approval_number      : String(50);
        purchasing_approval_item_number : String(50);
        po_number                       : String(50);
        po_item_number                  : String(10);
        supplier_opinion                : String(3000);
        remark                          : String(3000);
}

extend Li_Dtl with util.Managed;
