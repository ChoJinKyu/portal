using {cm as orgMapping} from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm as Org} from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using { dp as moldSpec } from '../../../../../db/cds/dp/md/DP_MD_SPEC-model';
using { dp as asset } from '../../../../../db/cds/dp/md/DP_MD_ASSET-model';
using { sp as supp } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model.cds';

namespace dp;
@path : '/dp.AssetListService'
service AssetListService {

view Assets as
    select 
        key ma.tenant_id,
        key ma.mold_id,
        mst.company_code,
        mst.org_code,
        mst.model,
        mst.mold_number,
        mst.mold_sequence,
        mst.spec_name,
        ma.class_desc,
        ma.secondary_supplier_name,
        ma.primary_supplier_code,
        ma.tertiary_supplier_name,
        mst.supplier_code,
        (select supplier_local_name from supp.Sm_Supplier_Mst sup where sup.tenant_id = ma.tenant_id and sup.supplier_code = ma.primary_supplier_code) as prod_vendor_name : String(240),
        (select supplier_local_name from supp.Sm_Supplier_Mst sup where sup.tenant_id = mst.tenant_id and sup.supplier_code = mst.supplier_code) as order_vendor_name : String(240),
        ma.asset_status_code,
        ma.asset_type_code,
        ma.asset_number,
        ma.remark,
        ma.remark_2,
        mst.mold_item_type_code,
        spec.cavity_process_qty,
        spec.mold_tonnage,
        ma.acq_date
    from asset.Md_Asset ma
    join moldMst.Md_Mst mst on 
        ma.tenant_id = mst.tenant_id and ma.mold_id = mst.mold_id
    join moldSpec.Md_Spec spec on
        mst.tenant_id = spec.tenant_id and mst.mold_id = spec.mold_id;

view Divisions as
    select key a.tenant_id       
            ,key a.company_code  
            ,key a.org_type_code 
            ,key a.org_code         
                ,a.org_name          
                ,a.purchase_org_code 
                ,a.plant_code        
                ,a.affiliate_code    
                ,a.bizdivision_code  
                ,a.bizunit_code      
                ,a.au_code           
                ,a.hq_au_code        
                ,a.use_flag  
    from Org.Pur_Operation_Org a  
    left join orgMapping.Pur_Org_Type_Mapping b
    on a.tenant_id=b.tenant_id
    and a.org_type_code=b.org_type_code
    where b.process_type_code='DP05';

}