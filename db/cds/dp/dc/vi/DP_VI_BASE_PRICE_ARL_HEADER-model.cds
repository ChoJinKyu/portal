namespace dp;

using util from '../../../util/util-model';
using {dp.VI_Base_Price_Arl_Line as line} from './DP_VI_BASE_PRICE_ARL_LINE-model';
using {cm.Code_Dtl as code} from '../../../cm/codeMgr/CM_CODE_DTL-model';
using {cm.Org_Tenant as tenant} from '../../../cm/orgMgr/CM_ORG_TENANT-model';
using {cm.Org_Company as comp} from '../../../cm/orgMgr/CM_ORG_COMPANY-model';
using {cm.Hr_Employee as employee} from '../../../cm/hrEmployeeMgr/CM_HR_EMPLOYEE-model';

entity VI_Base_Price_Arl_Header {
    key tenant_id                   : String(5) not null  @title : '테넌트ID';
    key approval_number             : String(50) not null @title : '품의번호';
        company_code                : String(10) not null @title : '회사코드';
        org_type_code               : String(2) not null  @title : '조직유형코드';
        org_code                    : String(10) not null @title : '조직코드';
        approval_type_code          : String(30) not null @title : '품의유형코드';
        new_change_code             : String(30) not null @title : '신규변경코드';
        approval_status_code        : String(30) not null @title : '품의상태코드';
        approval_request_desc       : String(1000)        @title : '승인요청설명';
        approval_requestor_empno    : String(30) not null @title : '승인요청자사번';
        approval_request_date       : Date                @title : '승인요청일자';
        attch_group_number          : String(100)         @title : '첨부파일그룹번호';

        lines                       : Composition of many line
                                          on  lines.tenant_id       = tenant_id
                                          and lines.approval_number = approval_number;

        tenant_id_fk                : Association to tenant
                                          on tenant_id_fk.tenant_id = tenant_id;
        company_code_fk             : Association to comp
                                          on  company_code_fk.tenant_id    = tenant_id
                                          and company_code_fk.company_code = company_code;
        approval_type_code_fk       : Association to code
                                          on  approval_type_code_fk.tenant_id  = tenant_id
                                          and approval_type_code_fk.group_code = 'DP_DC_APPROVAL_TYPE_CODE'
                                          and approval_type_code_fk.group_code = approval_type_code;
        new_change_code_fk          : Association to code
                                          on  new_change_code_fk.tenant_id  = tenant_id
                                          and new_change_code_fk.group_code = 'DP_DC_NEW_CHANGE_CODE'
                                          and new_change_code_fk.group_code = new_change_code;
        approval_status_code_fk     : Association to code
                                          on  approval_status_code_fk.tenant_id  = tenant_id
                                          and approval_status_code_fk.group_code = 'DP_DC_APPROVAL_STATUS_CODE'
                                          and approval_status_code_fk.group_code = new_change_code;
        approval_requestor_empno_fk : Association to employee
                                          on  approval_requestor_empno_fk.tenant_id       = tenant_id
                                          and approval_requestor_empno_fk.employee_number = approval_requestor_empno;
}

extend VI_Base_Price_Arl_Header with util.Managed;
