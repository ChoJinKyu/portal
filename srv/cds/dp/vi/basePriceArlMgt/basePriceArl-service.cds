using {cm.Approval_Mst as arlMasterSuper} from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using {cm.Approver as arlApprover} from '../../../../../db/cds/cm/CM_APPROVER-model';
using {cm.Referer as arlReferer} from '../../../../../db/cds/cm/CM_REFERER-model';
using {dp.VI_Base_Price_Arl_Mst as arlMaster} from '../../../../../db/cds/dp/vi/DP_VI_BASE_PRICE_ARL_MST-model';
using {dp.VI_Base_Price_Arl_Dtl as arlDetail} from '../../../../../db/cds/dp/vi/DP_VI_BASE_PRICE_ARL_DTL-model';
using {dp.VI_Base_Price_Arl_Price as arlPrice} from '../../../../../db/cds/dp/vi/DP_VI_BASE_PRICE_ARL_PRICE-model';
using {cm.Code_Dtl as codeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using {cm.Code_Lng as codeLng} from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using {cm.Org_Tenant as tenant} from '../../../../../db/cds/cm/CM_ORG_TENANT-model';
using {cm.Org_Company as comp} from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';
using {cm.Pur_Operation_Org as org} from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using {cm.Hr_Employee as employee} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {cm.Control_Option_Dtl as controlDtl} from '../../../../../db/cds/cm/CM_CONTROL_OPTION_DTL-model';
using {dp.Mm_Material_Mst as masterialMst} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';
using {dp.Mm_Material_Org as masterialOrg} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_ORG-model';
using {sp.Sm_Supplier_Mst as supplierMst} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';

namespace dp;

@path : '/dp.BasePriceArlService'
service BasePriceArlService {
    // entity Base_Price_Arl_Main as projection on arlMasterSuper;

    entity Base_Price_Arl_Main as select from arlMasterSuper { * } where approval_type_code like 'VI%';

    // entity Base_Price_Arl_Main as 
    //     select from arlMasterSuper sup inner join arlMaster sub on sup.tenant_id = sub.tenant_id and sup.approval_number = sub.approval_number
    //     {
    //         key sub.tenant_id,
    //         key sub.approval_number,
    //             sup.legacy_approval_number,
    //             sup.company_code,
    //             sup.org_type_code,
    //             sup.org_code,
    //             sup.chain_code,
    //             sup.approval_type_code,
    //             sup.approval_title,
    //             sup.approval_contents,
    //             sup.approve_status_code,
    //             sup.requestor_empno,
    //             sup.request_date,
    //             sup.attch_group_number
    //     };

    entity Base_Price_Arl_Master as projection on arlMaster;
    entity Base_Price_Arl_Approver as projection on arlApprover;
    entity Base_Price_Arl_Referer as projection on arlReferer;
    entity Base_Price_Arl_Detail as projection on arlDetail;
    entity Base_Price_Arl_Price  as projection on arlPrice;

    @readonly
    entity Base_Price_Arl_Config as
        select from controlDtl m {
            key tenant_id,
            key control_option_level_val,
                case
                    when
                        control_option_level_val =  'COMPANY_EDITABLE_FLAG'
                        and control_option_val   is null
                    then
                        'N'
                    when
                        control_option_level_val =  'SUPPLY_DISPLAY_FLAG'
                        and control_option_val   is null
                    then
                        'N'
                    when
                        control_option_level_val =  'PURORG_DISPLAY_NM'
                        and control_option_val   is null
                    then
                        'Pur Org'
                    when
                        control_option_level_val =  'MARKETCODE0_DISPLAY_FLAG'
                        and control_option_val   is null
                    then
                        'N'
                    when
                        control_option_level_val =  'MARKETCODE1_DISPLAY_FLAG'
                        and control_option_val   is null
                    then
                        'N'
                    when
                        control_option_level_val =  'MARKETCODE2_DISPLAY_FLAG'
                        and control_option_val   is null
                    then
                        'N'
                    else
                        control_option_val
                end as control_option_val : String(100)
        }
        where
                control_option_code       =       'DP_VI_BASE_PRICE_ARL_DISPLAY'
            and control_option_level_code =       'T'
            and org_type_code             =       '*'
            and $now                      between start_date and end_date;

    @readonly
    entity Code_Dtl              as
        select from codeDtl as d {
            key tenant_id,
            key group_code,
            key code,
                (
                    select code_name from codeLng l
                    where
                            l.tenant_id   = d.tenant_id
                        and l.group_code  = d.group_code
                        and l.code        = d.code
                        and l.language_cd = 'KO'
                ) as code_name : String(240),
                code_description,
                sort_no
        }
        where
            $now between start_date and end_date;

    @readonly
    entity Org_Tenant            as projection on tenant;

    @readonly
    entity Org_Company           as projection on comp;

    @readonly
    entity Pur_Operation_Org     as projection on org;

    @readonly
    entity Hr_Employee           as projection on employee;

    @readonly
    entity Supplier_Mst          as projection on supplierMst;

    @readonly
    entity Material_Vw           as
        select from masterialMst m
        left outer join masterialOrg o
            on  m.tenant_id     = o.tenant_id
            and m.material_code = o.material_code
        {
            key m.tenant_id,
            key m.material_code,
                m.material_type_code,
                m.material_desc,
                ifnull(
                    m.material_spec, ''
                ) as material_spec : String(1000),
                m.base_uom_code,
                m.purchasing_uom_code,
                o.material_status_code
        };

@readonly
entity Material_Mst          as
    select from masterialMst {
        tenant_id,
        material_code,
        material_type_code,
        material_desc,
        ifnull(
            material_spec, ''
        ) as material_spec : String(1000),
        base_uom_code,
        purchasing_uom_code,
        commodity_code
    };

// @readonly
// entity Material_Org          as projection on masterialOrg;
}
