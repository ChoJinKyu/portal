using { pg.Vp_Vendor_Pool_supplier_Change_List_View as vpChangeList } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_CHANGE_LIST_VIEW-model';

namespace pg; 
@path : '/pg.vendorPoolChangeService'
service VpChangeService {
    //https://lgcommondev-workspaces-ws-xqwd6-app1.jp10.applicationstudio.cloud.sap/odata/v2/pg.vendorPoolChangeService/

    entity VpChangeList as projection on vpChangeList;
}