using { sp.Se_Eval_Supplier as eSupplier } from '../../../../../db/cds/sp/se/SP_SE_EVAL_SUPPLIER-model';
using { pg.Vp_Supplier_Mst_View as vpSupplierMst } from '../../../../../db/cds/pg/vp/PG_VP_SUPPLIER_MST_VIEW-model';
using { cm.Org_Company as company } from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';

namespace sp; 
@path : '/sp.evalSupplierService'
service EvalSupplierService {
    
    //Company Condition
    entity Company as projection on company;

    //List View
    view ListView as
    select s.tenant_id,
           s.company_code,
           sm.company_name,
           sm.supplier_type_code,
           sm.supplier_type_name,
           s.supplier_code,
           sm.supplier_local_name,
           sm.supplier_english_name,
           s.supplier_group_code,
           s.supplier_group_name,
           s.repr_supplier_flag,
           case when nullif(s.supplier_group_code,'') is null then true
                else false
           end new_supplier_flag : Boolean,
           s.update_user_id,
           s.local_update_dtm
    from   eSupplier s,
           vpSupplierMst sm
    where  s.tenant_id = sm.tenant_id
    and    s.supplier_code = sm.supplier_code
    AND    sm.language_cd = 'KO'
    ;

    //Supplier Group Code 조회 Popup
    view SupplierGroupListView as
    select tenant_id,
           supplier_group_code,
           supplier_group_name
    from   eSupplier
    where  supplier_group_code is not null
    or     supplier_group_code <> ''
    group by tenant_id,
             supplier_group_code,
             supplier_group_name
    ;

}