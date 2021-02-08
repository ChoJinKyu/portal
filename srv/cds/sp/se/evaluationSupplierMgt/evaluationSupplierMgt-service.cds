using { sp.Se_Eval_Supplier as eSupplier } from '../../../../../db/cds/sp/se/SP_SE_EVAL_SUPPLIER-model';
using { pg.Vp_Supplier_Mst_View as vpSupplierMst } from '../../../../../db/cds/pg/vp/PG_VP_SUPPLIER_MST_VIEW-model';
using { cm.Org_Company as company } from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';
using { cm.Pur_Org_Type_Mapping as orgTypeMap } from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using { cm.Pur_Operation_Org as OprationOrg } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';

namespace sp; 
@path : '/sp.evalSupplierService'
service EvalSupplierService {
    
    //Company Condition
    entity Company as projection on company;

    //Org Condition
    view organizationView as
    select Key org.tenant_id,
           Key org.company_code,
           Key org.org_code,
           org.org_name
    from   orgTypeMap ma,
           OprationOrg org
    where  ma.tenant_id = org.tenant_id
    and    ma.company_code = org.company_code
    and    ma.org_type_code = org.org_type_code
    ;

    //List View
    view ListView as
    select Key s.tenant_id,
           Key s.company_code,
           sm.company_name,
           sm.supplier_type_code,
           sm.supplier_type_name,
           Key s.supplier_code,
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
    select Key tenant_id,
           Key supplier_group_code,
           supplier_group_name
    from   eSupplier
    where  supplier_group_code is not null
    or     supplier_group_code <> ''
    group by tenant_id,
             supplier_group_code,
             supplier_group_name
    ;

}