using {cm.Approval_Mst as arlMasterSuper} from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';
using {cm.Approver as arlApprover} from '../../../../../db/cds/cm/CM_APPROVER-model';
using {cm.Referer as arlReferer} from '../../../../../db/cds/cm/CM_REFERER-model';
using {sp.VI_Base_Price_Aprl_Item as arlItem} from '../../../../../db/cds/sp/vi/SP_VI_BASE_PRICE_APRL_ITEM-model';
using {sp.Vi_Base_Price_Aprl_Dtl as arlDetail} from '../../../../../db/cds/sp/vi/SP_VI_BASE_PRICE_APRL_DTL-model';
using {sp.Vi_Base_Price_Aprl_Type as arlTyp} from '../../../../../db/cds/sp/vi/SP_VI_BASE_PRICE_APRL_TYPE-model';
using {cm.Code_Dtl as codeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using {cm.Code_Lng as codeLng} from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using {cm.Org_Tenant as tenant} from '../../../../../db/cds/cm/CM_ORG_TENANT-model';
using {cm.Org_Company as comp} from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';
using {cm.Pur_Operation_Org as org} from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using {cm.Hr_Employee as employee} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {cm.Hr_Department as Dept} from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';
//using {cm.Control_Option_Dtl as controlDtl} from '../../../../../db/cds/cm/CM_CONTROL_OPTION_DTL-model';
using {dp.Mm_Material_Mst as materialMst} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';
using {dp.Mm_Material_Org as materialOrg} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_ORG-model';
using {dp.Mm_Material_Val as materialVal} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_VAL-model';
using {sp.Sm_Supplier_Mst as supplierMst} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';
using {cm.Currency as curr} from '../../../../../db/cds/cm/CM_CURRENCY-model';
using {pg.Vp_Vendor_Pool_Item_Dtl as VPoolDtl} from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_ITEM_DTL-model';
using {pg.Vp_Vendor_Pool_Mst as VPoolMst} from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MST-model';

namespace sp;

@path : '/sp.BasePriceArlService'
service BasePriceAprlService {

    entity Base_Price_Aprl_Master        as
        select from arlMasterSuper sup
        inner join arlItem sub
            on sup.tenant_id = sub.tenant_id
            and sup.approval_number = sub.approval_number
        inner join arlTyp typ 
            on sup.tenant_id = typ.tenant_id
            and sup.approval_number = typ.approval_number    
        inner join employee emp
            on sup.tenant_id = emp.tenant_id
            and sup.requestor_empno = emp.employee_number
        inner join Dept dept
            on emp.tenant_id = dept.tenant_id
            and emp.department_id = dept.department_id
        left outer join codeLng as cd01
            on cd01.tenant_id = sup.tenant_id
            and cd01.group_code = 'SP_VI_APPROVAL_TYPE'
            and cd01.code = sup.approval_type_code
            and cd01.language_cd = 'KO'
        left outer join codeLng as cd02
            on cd02.tenant_id = sup.tenant_id
            and cd02.group_code = 'CM_APPROVE_STATUS'
            and cd02.code = sup.approve_status_code
            and cd02.language_cd = 'KO'
        left outer join codeLng as cd03    
            on cd03.tenant_id = typ.tenant_id
            and cd03.group_code = 'SP_VI_NET_PRICE_TYPE_CODE'
            and cd03.code = typ.net_price_type_code
            and cd03.language_cd = 'KO'
        {
            key sup.tenant_id,
            key sup.approval_number,
                sup.legacy_approval_number,
                sup.company_code,
                sup.org_type_code,
                sup.org_code,
                sup.chain_code,
                sup.approval_type_code,
                cd01.code_name as approval_type_code_nm   : String(240),
                sup.approval_title,
                sup.approval_contents,
                sup.approve_status_code,
                cd02.code_name as approve_status_code_nm  : String(240),
                typ.net_price_type_code, 
                cd03.code_name as net_price_type_code_nm  : String(240),
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

    annotate Base_Price_Aprl_Master with {
        approve_status_code     @description : '공통코드(CM_CODE_DTL, CM_APPROVE_STATUS) : DR(Draft), AR(Approval Request), IA(In-Approval), AP(Approved), RJ(Rejected)';
        approve_status_code_nm  @title       : '결재상태명'  @description  : '결재상태코드 이름';
        net_price_type_code_nm  @title       : '단가유형명'  @description  : '단가유형코드 이름';
        requestor_local_nm      @title       : '요청자 이름'  @description : '요청자 이름';
        requestor_job_title     @title       : '요청자 직급'  @description : '요청자 직급';
        requestor_dept_local_nm @title       : '요청자 부서'  @description : '요청자 부서';
    };

    entity Base_Price_Aprl_Approver      as
        select from arlApprover app
        inner join employee emp
            on app.tenant_id = emp.tenant_id
            and app.approver_empno = emp.employee_number
        inner join Dept dept
            on emp.tenant_id = dept.tenant_id
            and emp.department_id = dept.department_id
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
                virtual cd01.code_name     as approver_type_code_nm: String(240),
                app.approve_comment,
                app.approve_status_code,
                virtual cd02.code_name     as approve_status_code_nm: String(240),
                app.approve_date_time,
                app.local_create_dtm,
                app.local_update_dtm,
                app.create_user_id,
                app.update_user_id,
                app.system_create_dtm,
                app.system_update_dtm
        };

    annotate Base_Price_Aprl_Approver with {
        approver_local_nm      @title       : '결재자 이름'  @description : '결재자 이름';
        approver_job_title     @title       : '결재자 직급'  @description : '결재자 직급';
        approver_dept_local_nm @title       : '결재자 부서'  @description : '결재자 부서';
        approver_type_code_nm  @title       : '결재유형명'  @description : '공통코드(CM_CODE_DTL, CM_APPROVER_TYPE)';
        approve_status_code_nm @title       : '결재상태명'  @description : '공통코드(CM_CODE_DTL, CM_APPROVE_STATUS)';
    };

    entity Base_Price_Aprl_Referer       as
        select from arlReferer ref
        inner join employee emp
            on ref.tenant_id = emp.tenant_id
            and ref.referer_empno = emp.employee_number
        inner join Dept dept
            on emp.tenant_id = dept.tenant_id
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

    annotate Base_Price_Aprl_Referer with {
        referer_local_nm      @title       : '참조자 이름'  @description : '참조자 이름';
        referer_job_title     @title       : '참조자 직급'  @description : '참조자 직급';
        referer_dept_local_nm @title       : '참조자 부서'  @description : '참조자 부서';
    };

    entity Base_Price_Aprl_Material       as
        select from materialMst mat
        inner join materialVal val
            on mat.tenant_id = val.tenant_id
            and mat.material_code = val.material_code
        inner join VPoolDtl pooldtl
            on mat.tenant_id = pooldtl.tenant_id
            and mat.material_code = pooldtl.material_code
        inner join VPoolMst poolmst
            on poolmst.tenant_id = pooldtl.tenant_id
            and poolmst.company_code = pooldtl.company_code
            and poolmst.org_type_code = pooldtl.org_type_code
            and poolmst.org_code = pooldtl.org_code
            and poolmst.vendor_pool_code = pooldtl.vendor_pool_code    
        {
            key mat.tenant_id,
            key mat.material_code,
                mat.material_desc,
                mat.material_type_code,
                mat.base_uom_code,
                val.material_price_unit,
                val.company_code,
                val.org_type_code,
                poolmst.org_code as plant_code,
            key pooldtl.vendor_pool_code,
                poolmst.vendor_pool_local_name,
                poolmst.vendor_pool_english_name,
                mat.local_create_dtm,
                mat.local_update_dtm,
                mat.create_user_id,
                mat.update_user_id,
                mat.system_create_dtm,
                mat.system_update_dtm
        };

    annotate Base_Price_Aprl_Material with {
        plant_code      @title       : '플랜트코드'  @description : '플랜트코드';
    };

 }
