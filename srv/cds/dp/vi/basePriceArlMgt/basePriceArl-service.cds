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
using {cm.Hr_Department as Dept} from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';
using {cm.Control_Option_Dtl as controlDtl} from '../../../../../db/cds/cm/CM_CONTROL_OPTION_DTL-model';
using {dp.Mm_Material_Mst as materialMst} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';
using {dp.Mm_Material_Org as materialOrg} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_ORG-model';
using {sp.Sm_Supplier_Mst as supplierMst} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';

namespace dp;

@path : '/dp.BasePriceArlService'
service BasePriceArlService {

    entity Base_Price_Arl_Master   as
        select from arlMasterSuper sup
        inner join arlMaster sub
            on  sup.tenant_id       = sub.tenant_id
            and sup.approval_number = sub.approval_number
        inner join employee emp
            on  sup.tenant_id       = emp.tenant_id
            and sup.requestor_empno = emp.employee_number
        inner join Dept dept
            on  emp.tenant_id     = dept.tenant_id
            and emp.department_id = dept.department_id
        {
            key sup.tenant_id,
            key sup.approval_number,
                sup.legacy_approval_number,
                sup.company_code,
                sup.org_type_code,
                sup.org_code,
                sup.chain_code,
                sup.approval_type_code,
                (
                    select code_name from codeLng
                    where
                            tenant_id   = sup.tenant_id
                        and group_code  = 'DP_VI_APPROVAL_TYPE'
                        and code        = sup.approval_type_code
                        and language_cd = 'KO'
                )                          as approval_type_code_nm   : String(240),
                sup.approval_title,
                sup.approval_contents,
                sup.approve_status_code,
                (
                    select code_name from codeLng
                    where
                            tenant_id   = sup.tenant_id
                        and group_code  = 'CM_APPROVE_STATUS'
                        and code        = sup.approve_status_code
                        and language_cd = 'KO'
                )                          as approve_status_code_nm  : String(240),
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

    entity Base_Price_Arl_Approver as
        select from arlApprover app
        inner join employee emp
            on  app.tenant_id      = emp.tenant_id
            and app.approver_empno = emp.employee_number
        inner join Dept dept
            on  emp.tenant_id     = dept.tenant_id
            and emp.department_id = dept.department_id
        {
            key app.tenant_id,
            key app.approval_number,
            key app.approve_sequence,
            key app.approver_empno,
                emp.user_local_name        as approver_local_nm      : String(240),
                emp.job_title              as approver_job_title     : String(100),
                dept.department_local_name as approver_dept_local_nm : String(240),
                app.approver_type_code,
                (
                    select code_name from codeLng
                    where
                            tenant_id   = app.tenant_id
                        and group_code  = 'CM_APPROVER_TYPE'
                        and code        = app.approver_type_code
                        and language_cd = 'KO'
                )                          as approver_type_code_nm  : String(240),
                app.approve_comment,
                app.approve_status_code,
                (
                    select code_name from codeLng l
                    where
                            tenant_id   = app.tenant_id
                        and group_code  = 'CM_APPROVE_STATUS'
                        and code        = app.approve_status_code
                        and language_cd = 'KO'
                )                          as approve_status_code_nm : String(240),
                app.approve_date_time,
                app.local_create_dtm,
                app.local_update_dtm,
                app.create_user_id,
                app.update_user_id,
                app.system_create_dtm,
                app.system_update_dtm
        }
        order by
            app.tenant_id,
            app.approval_number,
            app.approve_sequence,
            app.approver_empno;

    entity Base_Price_Arl_Referer  as
        select from arlReferer ref
        inner join employee emp
            on  ref.tenant_id     = emp.tenant_id
            and ref.referer_empno = emp.employee_number
        inner join Dept dept
            on  emp.tenant_id     = dept.tenant_id
            and emp.department_id = dept.department_id
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

    entity Base_Price_Arl_Detail   as
        select from arlDetail as dtl
        left outer join org as org
            on  dtl.tenant_id     = org.tenant_id
            and dtl.company_code  = org.company_code
            and org.org_type_code = 'PL'
            and dtl.org_code      = org.org_code
        left outer join materialMst as mtr
            on  dtl.tenant_id     = mtr.tenant_id
            and dtl.material_code = mtr.material_code
        left outer join supplierMst as sup
            on  dtl.tenant_id     = sup.tenant_id
            and dtl.supplier_code = sup.supplier_code
        {
            key dtl.tenant_id,
            key dtl.approval_number,
            key dtl.item_sequence,
                dtl.company_code,
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
                (
                    select code_name from codeLng
                    where
                            tenant_id   = dtl.tenant_id
                        and group_code  = 'DP_VI_BASE_PRICE_GROUND_CODE'
                        and code        = dtl.base_price_ground_code
                        and language_cd = 'KO'
                ) as base_price_ground_code_nm : String(240),
                dtl.local_create_dtm,
                dtl.local_update_dtm,
                dtl.create_user_id,
                dtl.update_user_id,
                dtl.system_create_dtm,
                dtl.system_update_dtm
        };

    entity Base_Price_Arl_Price    as
        select from arlPrice as prc {
            key prc.tenant_id,
            key prc.approval_number,
            key prc.item_sequence,
            key prc.market_code,
                (
                    select code_name from codeLng
                    where
                            tenant_id   = prc.tenant_id
                        and group_code  = 'DP_VI_MARKET_CODE'
                        and code        = prc.market_code
                        and language_cd = 'KO'
                ) as market_code_nm : String(240),
                prc.new_base_price,
                prc.new_base_price_currency_code,
                prc.current_base_price,
                prc.current_base_price_currency_code,
                prc.first_purchasing_net_price,
                prc.first_pur_netprice_curr_cd,
                prc.first_pur_netprice_str_dt,
                prc.local_create_dtm,
                prc.local_update_dtm,
                prc.create_user_id,
                prc.update_user_id,
                prc.system_create_dtm,
                prc.system_update_dtm
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

    @readonly
    entity Base_Price_Arl_Config   as
        select from controlDtl m {
            key tenant_id,
            key control_option_code,
                case
                    when
                        control_option_code    =  'DP_VI_COMPANY_EDITABLE_FLAG'
                        and control_option_val is null
                    then
                        'N'
                    when
                        control_option_code    =  'DP_VI_SUPPLY_DISPLAY_FLAG'
                        and control_option_val is null
                    then
                        'N'
                    when
                        control_option_code    =  'DP_VI_PURORG_DISPLAY_NM'
                        and control_option_val is null
                    then
                        'Pur Org'
                    when
                        control_option_code    =  'DP_VI_MARKETCODE0_DISPLAY_FLAG'
                        and control_option_val is null
                    then
                        'N'
                    when
                        control_option_code    =  'DP_VI_MARKETCODE1_DISPLAY_FLAG'
                        and control_option_val is null
                    then
                        'N'
                    when
                        control_option_code    =  'DP_VI_MARKETCODE2_DISPLAY_FLAG'
                        and control_option_val is null
                    then
                        'N'
                    else
                        control_option_val
                end as control_option_val : String(100)
        }
        where
                control_option_code       in      (
                'DP_VI_COMPANY_EDITABLE_FLAG', 'DP_VI_SUPPLY_DISPLAY_FLAG', 'DP_VI_PURORG_DISPLAY_NM', 'DP_VI_MARKETCODE0_DISPLAY_FLAG', 'DP_VI_MARKETCODE1_DISPLAY_FLAG', 'DP_VI_MARKETCODE2_DISPLAY_FLAG'
            )
            and control_option_level_code =       'T'
            and org_type_code             =       '*'
            and control_option_level_val  =       'Default'
            and $now                      between start_date and end_date;

}
