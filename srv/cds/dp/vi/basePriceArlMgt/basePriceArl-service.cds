using {cm.Approval_Mst as arlMasterSuper} from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using {cm.Approver as arlApprover} from '../../../../../db/cds/cm/CM_APPROVER-model';
using {cm.Referer as arlReferer} from '../../../../../db/cds/cm/CM_REFERER-model';
using {dp.VI_Base_Price_Arl_Mst as arlMaster} from '../../../../../db/cds/dp/vi/DP_VI_BASE_PRICE_ARL_MST-model';
using {dp.VI_Base_Price_Arl_Dtl as arlDetail} from '../../../../../db/cds/dp/vi/DP_VI_BASE_PRICE_ARL_DTL-model';
using {dp.VI_Base_Price_Arl_Price as arlPrice} from '../../../../../db/cds/dp/vi/DP_VI_BASE_PRICE_ARL_PRICE-model';
using {dp.VI_Base_Price_Arl_requestor_his as arlRequestorHis} from '../../../../../db/cds/dp/vi/DP_VI_BASE_PRICE_ARL_REQUESTOR_HIS-model';
using {dp.VI_Base_Price_Mst as priceMaster} from '../../../../../db/cds/dp/vi/DP_VI_BASE_PRICE_MST-model';
using {cm.Code_Dtl as codeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using {cm.Code_Lng as codeLng} from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using {cm.Org_Tenant as tenant} from '../../../../../db/cds/cm/CM_ORG_TENANT-model';
using {cm.Org_Company as comp} from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';
using {cm.Pur_Operation_Org as org} from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using {cm.Pur_Org_Type_Mapping as map} from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using {cm.Hr_Employee as employee} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {cm.Hr_Department as Dept} from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';
using {cm.Control_Option_Dtl as controlDtl} from '../../../../../db/cds/cm/CM_CONTROL_OPTION_DTL-model';
using {dp.Mm_Material_Mst as materialMst} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';
using {dp.Mm_Material_Org as materialOrg} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_ORG-model';
using {sp.Sm_Supplier_Mst as supplierMst} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';

namespace dp;

@path : '/dp.BasePriceArlService'
service BasePriceArlService {

    entity Base_Price_Mst              as
        select from priceMaster as pm
        left outer join materialMst as mtr
            on pm.tenant_id = mtr.tenant_id
            and pm.material_code = mtr.material_code
        left join org as porg
            on porg.tenant_id = pm.tenant_id
            and porg.company_code = pm.company_code
            and porg.org_type_code = pm.org_type_code
            and porg.org_code = pm.org_code
        left outer join comp as comp
            on pm.tenant_id = comp.tenant_id
            and pm.company_code = comp.company_code
        left outer join supplierMst as sup
            on pm.tenant_id = sup.tenant_id
            and pm.supplier_code = sup.supplier_code
        left outer join codeLng as cd01
            on cd01.tenant_id = pm.tenant_id
            and cd01.group_code = 'DP_VI_MARKET_CODE'
            and cd01.code = pm.market_code
            and cd01.language_cd = 'KO'
        left outer join codeLng as cd02
            on cd02.tenant_id = pm.tenant_id
            and cd02.group_code = 'DP_VI_BASE_PRICE_GROUND_CODE'
            and cd02.code = pm.base_price_ground_code
            and cd02.language_cd = 'KO'
        left outer join codeLng as cd03
            on cd03.tenant_id = pm.tenant_id
            and cd03.group_code = 'DP_NEW_CHANGE_CODE'
            and cd03.code = pm.new_change_type_code
            and cd03.language_cd = 'KO'
        {
            key pm.tenant_id,
            key pm.company_code,
            key pm.org_type_code,
            key pm.org_code,
            key pm.material_code,
            key pm.supplier_code,
            key pm.market_code,
            key pm.base_date,
                comp.company_name,
                porg.org_name,
                cd01.code_name as market_code_nm : String(240),
                mtr.material_desc,
                mtr.material_spec,
                sup.supplier_local_name,
                pm.approval_number,
                pm.item_sequence,
                pm.base_uom_code,
                pm.new_base_price,
                pm.new_base_price_currency_code,
                pm.base_price_ground_code,
                cd02.code_name as base_price_ground_code_nm : String(240),
                pm.base_price_start_date,
                pm.base_price_end_date,
                pm.first_purchasing_net_price,
                pm.first_pur_netprice_curr_cd,
                pm.first_pur_netprice_str_dt,
                pm.effective_flag,
                pm.buyer_empno,
                pm.new_change_type_code,
                cd03.code_name as new_change_type_code_nm : String(240),
                pm.repr_material_org_code,
                pm.repr_material_code,
                pm.repr_material_supplier_code,
                pm.repr_material_market_code,
                pm.erp_interface_flag,
                pm.erp_interface_date,
                pm.local_create_dtm,
                pm.local_update_dtm,
                pm.create_user_id,
                pm.update_user_id,
                pm.system_create_dtm,
                pm.system_update_dtm
        };

    annotate Base_Price_Mst with {
        market_code_nm              @title : '납선명'  @description : '납선코드 이름';
        base_price_ground_code_nm   @title : '기준단가근거명'  @description : '기준단가근거코드 이름';
        new_change_type_code_nm     @title : '신규변경구분명'  @description : '신규변경구분코드 이름';
    };

    entity Base_Price_Arl_Master        as
        select from arlMasterSuper sup
        inner join arlMaster sub
            on sup.tenant_id = sub.tenant_id
            and sup.approval_number = sub.approval_number
        left outer join employee emp
            on sup.tenant_id = emp.tenant_id
            and sup.requestor_empno = emp.employee_number
        left outer join Dept dept
            on emp.tenant_id = dept.tenant_id
            and emp.department_code = dept.department_code
        left outer join codeLng as cd01
            on cd01.tenant_id = sup.tenant_id
            and cd01.group_code = 'DP_VI_APPROVAL_TYPE'
            and cd01.code = sup.approval_type_code
            and cd01.language_cd = 'KO'
        left outer join codeLng as cd02
            on cd02.tenant_id = sup.tenant_id
            and cd02.group_code = 'CM_APPROVE_STATUS'
            and cd02.code = sup.approve_status_code
            and cd02.language_cd = 'KO'
        {
            key sup.tenant_id,
            key sup.approval_number,
                sup.legacy_approval_number,
                sup.company_code,
                sup.org_type_code,
                sup.org_code,
                sup.chain_code,
                sup.approval_type_code,
                cd01.code_name             as approval_type_code_nm   : String(240),
                sup.approval_title,
                sup.approval_contents,
                sup.approve_status_code,
                cd02.code_name             as approve_status_code_nm  : String(240),
                sup.requestor_empno,
                emp.user_local_name        as requestor_local_nm      : String(240),
                emp.job_title              as requestor_job_title     : String(100),
                dept.department_local_name as requestor_dept_local_nm : String(240),
                sup.request_date,
                sup.attch_group_number,
                sup.local_create_dtm,
                sup.local_update_dtm,
                sup.create_user_id,
                sup.update_user_id,
                sup.system_create_dtm,
                sup.system_update_dtm
        };

    annotate Base_Price_Arl_Master with {
        approval_type_code      @description : '공통코드(CM_CODE_DTL, DP_VI_APPROVAL_TYPE) : VI10(신규), VI20(변경)';
        approval_type_code_nm   @title       : '품의유형명'  @description  : '품의유형코드 이름';
        approve_status_code     @description : '공통코드(CM_CODE_DTL, CM_APPROVE_STATUS) : DR(Draft), AR(Approval Request), IA(In-Approval), AP(Approved), RJ(Rejected)';
        approve_status_code_nm  @title       : '결재상태명'  @description  : '결재상태코드 이름';
        requestor_local_nm      @title       : '요청자 이름'  @description : '요청자 이름';
        requestor_job_title     @title       : '요청자 직급'  @description : '요청자 직급';
        requestor_dept_local_nm @title       : '요청자 부서'  @description : '요청자 부서';
    };

    entity Base_Price_Arl_Approver      as
        select from arlApprover app
        inner join employee emp
            on app.tenant_id = emp.tenant_id
            and app.approver_empno = emp.employee_number
        inner join Dept dept
            on emp.tenant_id = dept.tenant_id
            and emp.department_code = dept.department_code
        left outer join codeLng as cd01
            on cd01.tenant_id = app.tenant_id
            and cd01.group_code = 'CM_APPROVER_TYPE'
            and cd01.code = app.approver_type_code
            and cd01.language_cd = 'KO'
        left outer join codeLng as cd02
            on cd02.tenant_id = app.tenant_id
            and cd02.group_code = 'CM_APPROVE_STATUS'
            and cd02.code = app.approve_status_code
            and cd02.language_cd = 'KO'
        {
            key app.tenant_id,
            key app.approval_number,
            key app.approve_sequence,
            key app.approver_empno,
                emp.user_local_name        as approver_local_nm      : String(240),
                emp.job_title              as approver_job_title     : String(100),
                dept.department_local_name as approver_dept_local_nm : String(240),
                app.approver_type_code,
                virtual cd01.code_name     as approver_type_code_nm  : String(240),
                app.approve_comment,
                app.approve_status_code,
                virtual cd02.code_name     as approve_status_code_nm : String(240),
                app.approve_date_time,
                app.local_create_dtm,
                app.local_update_dtm,
                app.create_user_id,
                app.update_user_id,
                app.system_create_dtm,
                app.system_update_dtm
        };

    annotate Base_Price_Arl_Approver with {
        approver_local_nm      @title : '결재자 이름'  @description : '결재자 이름';
        approver_job_title     @title : '결재자 직급'  @description : '결재자 직급';
        approver_dept_local_nm @title : '결재자 부서'  @description : '결재자 부서';
        approver_type_code_nm  @title : '결재유형명'  @description  : '공통코드(CM_CODE_DTL, CM_APPROVER_TYPE)';
        approve_status_code_nm @title : '결재상태명'  @description  : '공통코드(CM_CODE_DTL, CM_APPROVE_STATUS)';
    };

    entity Base_Price_Arl_Referer       as
        select from arlReferer ref
        inner join employee emp
            on ref.tenant_id = emp.tenant_id
            and ref.referer_empno = emp.employee_number
        inner join Dept dept
            on emp.tenant_id = dept.tenant_id
            and emp.department_code = dept.department_code
        {
            key ref.tenant_id,
            key ref.approval_number,
            key ref.referer_empno,
                emp.user_local_name        as referer_local_nm      : String(240),
                emp.job_title              as referer_job_title     : String(100),
                dept.department_local_name as referer_dept_local_nm : String(240),
                ref.local_create_dtm,
                ref.local_update_dtm,
                ref.create_user_id,
                ref.update_user_id,
                ref.system_create_dtm,
                ref.system_update_dtm
        };

    annotate Base_Price_Arl_Referer with {
        referer_local_nm      @title : '참조자 이름'  @description : '참조자 이름';
        referer_job_title     @title : '참조자 직급'  @description : '참조자 직급';
        referer_dept_local_nm @title : '참조자 부서'  @description : '참조자 부서';
    };

    entity Base_Price_Arl_Detail        as
        select from arlDetail as dtl
        inner join comp as comp
            on dtl.tenant_id = comp.tenant_id
            and dtl.company_code = comp.company_code
        left outer join org as org
            on dtl.tenant_id = org.tenant_id
            and dtl.company_code = org.company_code
            and org.org_type_code = 'PL'
            and dtl.org_code = org.org_code
        left outer join materialMst as mtr
            on dtl.tenant_id = mtr.tenant_id
            and dtl.material_code = mtr.material_code
        left outer join supplierMst as sup
            on dtl.tenant_id = sup.tenant_id
            and dtl.supplier_code = sup.supplier_code
        left outer join codeLng as cd01
            on cd01.tenant_id = dtl.tenant_id
            and cd01.group_code = 'DP_VI_BASE_PRICE_GROUND_CODE'
            and cd01.code = dtl.base_price_ground_code
            and cd01.language_cd = 'KO'
        {
            key dtl.tenant_id,
            key dtl.approval_number,
            key dtl.item_sequence,
                dtl.company_code,
                comp.company_name,
                dtl.org_type_code,
                dtl.org_code,
                org.org_name,
                dtl.material_code,
                mtr.material_desc,
                mtr.material_spec,
                dtl.base_uom_code,
                dtl.supplier_code,
                sup.supplier_local_name,
                // (
                //     select case
                //                when
                //                    'KO' = 'EN'
                //                then
                //                    supplier_english_name
                //                else
                //                    supplier_local_name
                //            end as supplier_name from supplierMst
                //     where
                //             tenant_id     = dtl.tenant_id
                //         and supplier_code = dtl.supplier_code
                // ) as supplier_nm               : String(240),
                dtl.base_date,
                dtl.base_price_ground_code,
                cd01.code_name as base_price_ground_code_nm : String(240),
                dtl.local_create_dtm,
                dtl.local_update_dtm,
                dtl.create_user_id,
                dtl.update_user_id,
                dtl.system_create_dtm,
                dtl.system_update_dtm
        };

    annotate Base_Price_Arl_Detail with {
        base_price_ground_code_nm @title : '기준단가근거명'  @description : '기준단가근거코드 이름';
    };

    entity Base_Price_Arl_Price         as
        select from arlPrice as prc
        left outer join codeLng as cd01
            on cd01.tenant_id = prc.tenant_id
            and cd01.group_code = 'DP_VI_MARKET_CODE'
            and cd01.code = prc.market_code
            and cd01.language_cd = 'KO'
        left outer join codeLng as cd02
            on cd02.tenant_id = prc.tenant_id
            and cd02.group_code = 'DP_VI_CHANGE_REASON_CODE'
            and cd02.code = prc.change_reason_code
            and cd02.language_cd = 'KO'
        {
            key prc.tenant_id,
            key prc.approval_number,
            key prc.item_sequence,
            key prc.market_code,
                cd01.code_name as market_code_nm   : String(240),
                prc.new_base_price,
                prc.new_base_price_currency_code,
                prc.current_base_price,
                prc.current_base_price_currency_code,
                prc.first_purchasing_net_price,
                prc.first_pur_netprice_curr_cd,
                prc.first_pur_netprice_str_dt,
                prc.change_reason_code,
                cd02.code_name as change_reason_nm : String(240),
                prc.local_create_dtm,
                prc.local_update_dtm,
                prc.create_user_id,
                prc.update_user_id,
                prc.system_create_dtm,
                prc.system_update_dtm
        };

    annotate Base_Price_Arl_Price with {
        market_code_nm   @title : '납선명'  @description   : '납선코드 이름';
        change_reason_nm @title : '변경사유명'  @description : '변경사유코드 이름';
    };

    entity Base_Price_Arl_Requestor_His as projection on arlRequestorHis;

    @readonly
    entity Base_Price_Arl_Config        as
        select from controlDtl m {
            key tenant_id,
            key control_option_code,
                case
                    when
                        control_option_code = 'DP_VI_COMPANY_EDITABLE_FLAG'
                        and control_option_val is null
                    then
                        'N'
                    when
                        control_option_code = 'DP_VI_SUPPLY_DISPLAY_FLAG'
                        and control_option_val is null
                    then
                        'N'
                    when
                        control_option_code = 'DP_VI_MARKETCODE0_DISPLAY_FLAG'
                        and control_option_val is null
                    then
                        'N'
                    when
                        control_option_code = 'DP_VI_MARKETCODE1_DISPLAY_FLAG'
                        and control_option_val is null
                    then
                        'N'
                    when
                        control_option_code = 'DP_VI_MARKETCODE2_DISPLAY_FLAG'
                        and control_option_val is null
                    then
                        'N'
                    else
                        control_option_val
                end as control_option_val : String(100)
        }
        where
            control_option_code in (
                'DP_VI_COMPANY_EDITABLE_FLAG', 'DP_VI_SUPPLY_DISPLAY_FLAG', 'DP_VI_MARKETCODE0_DISPLAY_FLAG', 'DP_VI_MARKETCODE1_DISPLAY_FLAG', 'DP_VI_MARKETCODE2_DISPLAY_FLAG'
            )
            and control_option_level_code = 'T'
            and org_type_code = '*'
            and control_option_level_val = 'Default'
            and $now between start_date and end_date;

    @readonly
    entity Material_Vw                  as
        select from materialMst as mst
        inner join materialOrg as org
            on mst.tenant_id = org.tenant_id
            and mst.material_code = org.material_code
        inner join comp as comp
            on org.tenant_id = comp.tenant_id
            and org.company_code = comp.company_code
        inner join map as map
            on org.tenant_id = map.tenant_id
            and (
                org.company_code = map.company_code
                or map.company_code = '*'
            )
            and map.process_type_code = 'SP02'
        left join org as porg
            on porg.tenant_id = org.tenant_id
            and porg.company_code = org.company_code
            and porg.org_type_code = org.org_type_code
            and porg.org_code = org.org_code
        left outer join codeLng as cd01
            on cd01.tenant_id = org.tenant_id
            and cd01.group_code = 'DP_MM_MATERIAL_STATUS'
            and cd01.code = org.material_status_code
            and cd01.language_cd = 'KO'
        {
            key org.tenant_id,
            key org.material_code,
            key org.company_code,
            key org.org_type_code,
            key org.org_code,
                comp.company_name,
                porg.org_name,
                mst.material_desc,
                mst.material_spec,
                mst.material_type_code,
                mst.base_uom_code,
                // mst.material_group_code,
                // mst.purchasing_uom_code,
                // mst.variable_po_unit_indicator,
                // mst.material_class_code,
                // mst.commodity_code,
                // mst.maker_part_number,
                // mst.maker_code,
                // mst.maker_part_profile_code,
                // mst.maker_material_code,
                org.material_status_code,
                cd01.code_name as material_status_code_name : String(240)
                // org.purchasing_group_code,
                // org.batch_management_flag,
                // org.automatic_po_allow_flag,
                // org.hs_code,
                // org.import_group_code,
                // org.user_item_type_code,
                // org.purchasing_item_flag,
                // org.purchasing_enable_flag,
                // org.osp_item_flag,
                // org.buyer_empno,
                // org.eng_item_flag
        };

    annotate Material_Vw with {
        company_name              @description : '회사 이름';
        org_name                  @description : '조직 이름';
        material_status_code_name @title       : '자재상태명'  @description : '공통코드(CM_CODE_DTL, DP_MM_MATERIAL_STATUS)';
    };

// @readonly
// entity Code_Dtl                as
//     select from codeDtl as d {
//         key tenant_id,
//         key group_code,
//         key code,
//             (
//                 select code_name from codeLng l
//                 where
//                         l.tenant_id   = d.tenant_id
//                     and l.group_code  = d.group_code
//                     and l.code        = d.code
//                     and l.language_cd = 'KO'
//             ) as code_name : String(240),
//             code_description,
//             sort_no
//     }
//     where
//         $now between start_date and end_date;

// @readonly
// entity Org_Tenant              as projection on tenant;

// @readonly
// entity Org_Company             as projection on comp;

// @readonly
// entity Pur_Operation_Org       as projection on org;

// @readonly
// entity Hr_Employee             as projection on employee;

// @readonly
// entity Supplier_Mst            as projection on supplierMst;

// @readonly
// entity Material_Mst            as
//     select from materialMst {
//         tenant_id,
//         material_code,
//         material_type_code,
//         material_desc,
//         ifnull(
//             material_spec, ''
//         ) as material_spec : String(1000),
//         base_uom_code,
//         purchasing_uom_code,
//         commodity_code
//     };

// @readonly
// entity Material_Vw             as
//     select from materialMst m
//     left outer join materialOrg o
//         on  m.tenant_id     = o.tenant_id
//         and m.material_code = o.material_code
//     {
//         key m.tenant_id,
//         key m.material_code,
//             m.material_type_code,
//             m.material_desc,
//             ifnull(
//                 m.material_spec, ''
//             ) as material_spec : String(1000),
//             m.base_uom_code,
//             m.purchasing_uom_code,
//             o.material_status_code
//     };

}
