using {dp as arlMaster} from '../../../../../db/cds/dp/vi/DP_VI_BASE_PRICE_ARL_MST-model';
using {dp as arlDetail} from '../../../../../db/cds/dp/vi/DP_VI_BASE_PRICE_ARL_DTL-model';
using {dp as arlPrice} from '../../../../../db/cds/dp/vi/DP_VI_BASE_PRICE_ARL_PRICE-model';
using {cm.Org_Tenant as tenant} from '../../../../../db/cds/cm/CM_ORG_TENANT-model';
using {cm.Org_Company as comp} from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';
using {cm.Hr_Employee as employee} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {dp.Mm_Material_Mst as masterial_mst} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';
using {dp.Mm_Material_Org as masterial_org} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_ORG-model';
using {sp.Sm_Supplier_Mst as supplier} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';

namespace dp;

@path : '/dp.BasePriceArlService'
service BasePriceArlService {
    entity Base_Price_Arl_Master as projection on arlMaster.VI_Base_Price_Arl_Mst;
    entity Base_Price_Arl_Detail as projection on arlDetail.VI_Base_Price_Arl_Dtl;
    entity Base_Price_Arl_Price  as projection on arlPrice.VI_Base_Price_Arl_Price;

    @readonly
    entity Org_Tenant            as projection on tenant;

    @readonly
    entity Org_Company           as projection on comp;

    @readonly
    entity Hr_Employee           as projection on employee;

    @readonly
    entity Material_Mst           as projection on masterial_mst;
    // entity Material_Mst          as
    //     select from masterial_mst m
    //     left outer join masterial_org o
    //         on  m.tenant_id     = o.tenant_id
    //         and m.material_code = o.material_code
    //     {
    //         m.material_code,
    //         m.material_type_code,
    //         m.material_desc,
    //         m.material_spec,
    //         m.base_uom_code,
    //         m.purchasing_uom_code,
    //         m.commodity_code,
    //         o.material_status_code
    //     };

    @readonly
    entity Supplier_Mst          as projection on supplier;
}
