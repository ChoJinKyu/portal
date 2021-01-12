namespace dp;

using util from '../../cm/util/util-model';
using {dp.VI_Base_Price_Arl_Dtl as detail} from './DP_VI_BASE_PRICE_ARL_DTL-model';
using {cm.Code_Dtl as code} from '../../cm/CM_CODE_DTL-model';
using {cm.Org_Tenant as tenant} from '../../cm/CM_ORG_TENANT-model';
using {cm.Hr_Employee as employee} from '../../cm/CM_HR_EMPLOYEE-model';

entity VI_Base_Price_Arl_Mst {
    key tenant_id                   : String(5) not null;
    key approval_number             : String(50) not null;
        approval_title              : String(300) not null;
        approval_type_code          : String(30) not null;
        new_change_code             : String(30) not null;
        approval_status_code        : String(30) not null;
        approval_request_desc       : String(1000);
        approval_requestor_empno    : String(30) not null;
        approval_request_date       : Date;
        attch_group_number          : String(100);

        details                     : Composition of many detail
                                          on  details.tenant_id       = tenant_id
                                          and details.approval_number = approval_number;

        tenant_id_fk                : Association to tenant
                                          on tenant_id_fk.tenant_id = tenant_id;
        approval_type_code_fk       : Association to code
                                          on  approval_type_code_fk.tenant_id  = tenant_id
                                          and approval_type_code_fk.group_code = 'DP_VI_APPROVAL_TYPE_CODE'
                                          and approval_type_code_fk.code       = approval_type_code;
        new_change_code_fk          : Association to code
                                          on  new_change_code_fk.tenant_id  = tenant_id
                                          and new_change_code_fk.group_code = 'DP_VI_NEW_CHANGE_CODE'
                                          and new_change_code_fk.code       = new_change_code;
        approval_status_code_fk     : Association to code
                                          on  approval_status_code_fk.tenant_id  = tenant_id
                                          and approval_status_code_fk.group_code = 'DP_VI_APPROVAL_STATUS_CODE'
                                          and approval_status_code_fk.code       = approval_status_code;
        approval_requestor_empno_fk : Association to employee
                                          on  approval_requestor_empno_fk.tenant_id       = tenant_id
                                          and approval_requestor_empno_fk.employee_number = approval_requestor_empno;
};

extend VI_Base_Price_Arl_Mst with util.Managed;

annotate VI_Base_Price_Arl_Mst with @title : '품의 마스터'  @description : '개발단가 품의 마스터';

annotate VI_Base_Price_Arl_Mst with {
    tenant_id                @title : '테넌트ID'  @description    : '테넌트ID(CM_ORG_TENANT, TENANT_ID)';
    approval_number          @title : '품의번호'  @description     : '품의번호';
    approval_title           @title : '품의제목'  @description     : '품의제목';
    approval_type_code       @title : '품의유형코드'  @description   : '공통코드(CM_CODE_DTL, DP_VI_APPROVAL_TYPE_CODE) : 10(개발기준단가품의)';
    new_change_code          @title : '신규변경코드'  @description   : '공통코드(CM_CODE_DTL, DP_VI_NEW_CHANGE_CODE) : 10(신규), 20(변경)';
    approval_status_code     @title : '품의상태코드'  @description   : '공통코드(CM_CODE_DTL, DP_VI_APPROVAL_STATUS_CODE) : 10(작성중), 20(결재진행중), 30(승인), 40(반려)';
    approval_request_desc    @title : '승인요청설명'  @description   : '승인요청설명';
    approval_requestor_empno @title : '승인요청자사번'  @description  : '승인요청자사번(CM_HR_EMPLOYEE, EMPLOYEE_NUMBER)';
    approval_request_date    @title : '승인요청일자'  @description   : '승인요청일자';
    attch_group_number       @title : '첨부파일그룹번호'  @description : '첨부파일그룹번호';
};
