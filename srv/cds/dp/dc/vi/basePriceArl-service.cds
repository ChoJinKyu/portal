using {dp as arlMaster} from '../../../../../db/cds/dp/dc/vi/DP_VI_BASE_PRICE_ARL_MST-model';
using {dp as arlDetail} from '../../../../../db/cds/dp/dc/vi/DP_VI_BASE_PRICE_ARL_DTL-model';
using {dp as arlPrice} from '../../../../../db/cds/dp/dc/vi/DP_VI_BASE_PRICE_ARL_PRICE-model';

using {cm.Org_Tenant as tenant} from '../../../../../db/cds/cm/orgMgr/CM_ORG_TENANT-model';
using {cm.Org_Company as comp} from '../../../../../db/cds/cm/orgMgr/CM_ORG_COMPANY-model';
using {cm.Hr_Employee as employee} from '../../../../../db/cds/cm/hrEmployeeMgr/CM_HR_EMPLOYEE-model';
using {sp.Sm_Supplier_Mst as supplier} from '../../../../../db/cds/sp/supplierMgr/SP_SM_SUPPLIER_MST-model';

namespace dp;

@path : '/dp.BasePriceArlService'
service BasePriceArlService {
    entity Base_Price_Arl_Master as projection on arlMaster.VI_Base_Price_Arl_Mst;
    entity Base_Price_Arl_Detail as projection on arlDetail.VI_Base_Price_Arl_Dtl;
    entity Base_Price_Arl_Price  as projection on arlPrice.VI_Base_Price_Arl_Price;

    @readonly
    entity Org_Tenant as projection on tenant;
    @readonly
    entity Org_Company as projection on comp;
    @readonly
    entity Hr_Employee as projection on employee;
    @readonly
    entity Supplier_Mst as projection on supplier;
}
