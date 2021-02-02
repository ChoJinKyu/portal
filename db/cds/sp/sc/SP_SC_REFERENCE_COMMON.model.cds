namespace sp;

using util from '../../cm/util/util-model';
using {cm as codeMst} from '../../cm/CM_CODE_MST-model';
using {cm as codeDtl} from '../../cm/CM_CODE_DTL-model';
using {cm as codeLng} from '../../cm/CM_CODE_LNG-model';
using {cm as orgTenant} from '../../cm/CM_ORG_TENANT-model';

// using {sp as ScOutcomeCodeView} from '../../sp/sc/SP_SC_NEGO_MASTERS-model';


//// 할일 목록
// L2100	SP_SC_NEGO_PROG_STATUS_CODE	SP	협상 진행 상태 코드	협상 진행 상태 코드
// L2100	SP_SC_AWARD_TYPE_CODE	SP	낙찰 유형 코드	낙찰 유형 코드
// # Outcome: NegoType과 복합키 구성
// # NegoType: 속성관리 필요(견적/입찰여부|가격/비가격여부) //예: RFQ/RFP/입찰/2step입찰

/*************************************************************************************/
//** 마스터 리스트
/*************************************************************************************/
/** 
// # 공통 코드
// ## 견적 헤더
  Sc_Award_Prog_Status_Code_View - [임시생성-삭제예정][공통코드=SP_SC_AWARD_PROG_STATUS_CODE] 낙찰진행상태 - 타스크럼 제공 예정
  Sc_Nego_Prog_Status_Code_View  - [공통코드=SP_SC_NEGO_PROG_STATUS_CODE][SP_SC] 협상진행상태
  Sc_Award_Type_Code_View        - [공통코드=SP_SC_AWARD_TYPE_CODE][SP_SC] 낙찰유형
  Sc_Award_Method_Code_View      - [공통코드=SP_SC_AWARD_METHOD_CODE][SP_SC] 낙찰방법
  
// ## 견적 아이템
  Sc_Market_Code_View            - [공통코드=DP_VI_MARKET_CODE] 마켓코드
  Sc_Payment_Terms_View          - [공통코드=PAYMENT_TERMS] 페이먼트텀즈
  Sc_Incoterms_View              - [공통코드=OP_INCOTERMS] 인커텀즈법

--# 공통코드 DB 조회
SELECT TOP 500 
  TENANT_ID, GROUP_CODE, CHAIN_CODE, GROUP_NAME, GROUP_DESCRIPTION, MAXIMUM_COLUMN_SIZE
, children.CODE, children.CODE_DESCRIPTION, children.SORT_NO
, children.children[LANGUAGE_CD='KO'].LANGUAGE_CD, children.children[LANGUAGE_CD='KO'].CODE_NAME
FROM cm_Code_Mst WHERE 1=1 
AND ( 1=0 
    OR upper(group_code) like upper('%DP_VI_MARKET_CODE%')
    OR upper(group_code) like upper('%PAYMENT_TERMS%')
    OR upper(group_code) like upper('%OP_INCOTERMS%')
    OR upper(group_code) like upper('%SP_SC_AWARD_PROG_STATUS_CODE%')
    OR upper(group_code) like upper('%SP_SC_NEGO_PROG_STATUS_CODE%')
    OR upper(group_code) like upper('%SP_SC_AWARD_TYPE_CODE%')
    OR upper(group_code) like upper('%SP_SC_AWARD_METHOD_CODE%')
);
***************************************************************************************
// # 양산(전략) 구매 - 소싱 코드
// ## 견적 헤더
  Sc_Nego_Parent_Type_Code       - [SP_SC] 협상상위유형[견적/입찰]
  Sc_Award_Type_Code             - [SP_SC] 낙찰유형[라인별기준|총액기준]
  Sc_Nego_Award_Method_Code      - [SP_SC] 협상낙찰방법[최저가격공급업체/다중공급업체]
     ==> Nego Parent Type vs Award Type vs Award Method
    Ref. Sc_Nego_Parent_Type_Code       - [SP_SC] 협상상위유형[견적/입찰]
    Ref. Sc_Award_Type_Code_View        - [공통코드=SP_SC_AWARD_TYPE_CODE][SP_SC] 낙찰유형
    Ref. Sc_Award_Method_Code_View      - [공통코드=SP_SC_AWARD_METHOD_CODE][SP_SC] 낙찰방법
  Sc_Nego_Supeval_Type_Code      - [SP_SC] 협상공급업체평가유형[가격/가격+비가격]
  Sc_Evaluation_Type_Code        - [SP_SC] 평가유형[가격/가격+비가격] << 폐기예정
  Sc_Nego_Type_Code              - [SP_SC] 협상유형
  Sc_Outcome_Code                - [SP_SC] 아웃컴
**/
/*************************************************************************************/

//Test-Begin
/* entity Sc_Outcome_Code2 {

    key tenant_id      : type of orgTenant.Org_Tenant : tenant_id @title : '테넌트ID';
    key nego_type_code : String(30) not null  @title : '협상타입코드';
    key outcome_code   : String(30) not null  @title : '아웃컴코드';
        sort_no        : Decimal not null     @title : '정렬번호';
        nego_type_name : localized String(240)@title : '협상타입이름';
// nego_type_descr  : localized String(1000)@title : 'Description';
}; */
//Test-End

@cds.autoexpose  // SP_SC_NEGO_PROG_STATUS_CODE : 협상 상태 코드[예:Approval]
define view Sc_Nego_Prog_Status_Code_View as
    select from codeMst.Code_Dtl as cd {
        key cd.tenant_id,
        key cd.code      as nego_progress_status_code,
            cd.sort_no,
            children[lower(language_cd) = substring($user.locale, 1, 2)].code_name as nego_progress_status_name
    } 
    where group_code = 'SP_SC_NEGO_PROG_STATUS_CODE';

@cds.autoexpose  // SP_SC_NEGO_PROG_STATUS_CODE : 협상 상태 코드[예:Approval]
define view Sc_Award_Prog_Status_Code_View as
    select from codeMst.Code_Dtl as cd {
        key cd.tenant_id,
        key cd.code      as award_progress_status_code,
            cd.sort_no,
            children[lower(language_cd) = substring($user.locale, 1, 2)].code_name as award_progress_status_name
    } 
    where group_code = 'SP_SC_AWARD_PROG_STATUS_CODE';

@cds.autoexpose  // SP_SC_AWARD_TYPE_CODE : 어워드 유형[예:Award By Lines]
define view Sc_Award_Type_Code_View as
    select from codeMst.Code_Dtl as cd {
        key cd.tenant_id,
        key cd.code      as award_type_code,
            cd.sort_no,
            children[lower(language_cd) = substring($user.locale, 1, 2)].code_name as award_type_name
    }
    where group_code = 'SP_SC_AWARD_TYPE_CODE';

@cds.autoexpose  // SP_SC_AWARD_METHOD_CODE : 어워드 유형[예:Award By Lines]
define view Sc_Award_Method_Code_View as
    select from codeMst.Code_Dtl as cd {
        key cd.tenant_id,
        key cd.code      as award_method_code,
            cd.sort_no,
            children[lower(language_cd) = substring($user.locale, 1, 2)].code_name as award_method_name
    }
    where group_code = 'SP_SC_AWARD_METHOD_CODE';

@cds.autoexpose  // OP_INCOTERMS : 인커텀즈 코드[예:]
define view Sc_Incoterms_View as
    select from codeMst.Code_Dtl {
        key tenant_id,
        key code      as incoterms_code,
            sort_no,
            children[lower(language_cd) = substring($user.locale, 1, 2)].code_name 
                      as incoterms_name
    } 
    where group_code = 'OP_INCOTERMS';
    
@cds.autoexpose  // PAYMENT_TERMS : 페이먼트텀즈 코드[예:]
define view Sc_Payment_Terms_View as
    select from codeMst.Code_Dtl {
        key tenant_id,
        key code      as payment_terms_code,
            sort_no,
            children[lower(language_cd) = substring($user.locale, 1, 2)].code_name 
                      as payment_terms_name
    } 
    where group_code = 'PAYMENT_TERMS';

@cds.autoexpose  // DP_VI_MARKET_CODE : 마켓 코드[예:]
define view Sc_Market_Code_View as
    select from codeMst.Code_Dtl {
        key tenant_id,
        key code      as market_code,
            sort_no,
            children[lower(language_cd) = substring($user.locale, 1, 2)].code_name 
                      as market_name
    } 
    where group_code = 'DP_VI_MARKET_CODE';

@cds.autoexpose  //
define view Sc_Award_Type_Code_View1 as
    select
        key cd.tenant_id,
        key cd.code            as award_type_code,
            cd.sort_no,
            children.code_name as award_type_name
    from codeDtl.Code_Dtl as cd
    left outer join codeLng.Code_Lng as children
        on ((   children.tenant_id = cd.tenant_id
                and children.group_code = cd.group_code
                and children.code = cd.code   )
            and ( lower(children.language_cd) = substring($user.locale, 1, 2) )
        )
    where cd.group_code = 'SP_SC_AWARD_TYPE_CODE';

/* 
--# DB SQL Statement
select
    cd.tenant_id,
    cd.code            as award_type_code,
    cd.sort_no,
    children.code_name as award_type_name
from codeDtl.Code_Dtl as cd
left outer join codeLng.Code_Lng as children
    on ((   children.tenant_id = cd.tenant_id
            and children.group_code = cd.group_code
            and children.code = cd.code   )
        and ( lower(children.language_cd) = substring(session_context('LOCALE'), 1, 2) )
    )
where cd.group_code = 'SP_SC_AWARD_TYPE_CODE';
 */