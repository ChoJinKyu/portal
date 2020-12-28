using { pg.Vp_Vendor_Pool_supplier_Change_List_View as vpChangeList } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_CHANGE_LIST_VIEW-model';

namespace pg; 
@path : '/pg.vendorPoolChangeService'
service VpChangeService {

    entity VpChangeList as projection on vpChangeList;

    view vpEmpView as
    select   distinct key changer_empno,  
                          write_by
    from vpChangeList;
  
}