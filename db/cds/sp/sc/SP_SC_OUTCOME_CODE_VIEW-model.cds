namespace sp;

using util from '../../cm/util/util-model';
using {cm as codeMst} from '../../cm/CM_CODE_MST-model';
using {cm as codeDtl} from '../../cm/CM_CODE_DTL-model';
using {cm as codeLng} from '../../cm/CM_CODE_LNG-model';
using {cm as orgTenant} from '../../cm/CM_ORG_TENANT-model';

using {
    sp.Sc_Award_Type_Code_View,
    sp.Sc_Award_Method_Code_View
} from '../../sp/sc/SP_SC_REFERENCE_COMMON.model';



// using {sp as ScOutcomeCodeView} from '../../sp/sc/SP_SC_OUTCOME_CODE_VIEW-model';


//// 할일 목록
// L2100	SP_SC_NEGO_PROG_STATUS_CODE	SP	협상 진행 상태 코드	협상 진행 상태 코드
// L2100	SP_SC_AWARD_TYPE_CODE	SP	낙찰 유형 코드	낙찰 유형 코드
// # Outcome: NegoType과 복합키 구성
// # NegoType: 속성관리 필요(견적/입찰여부|가격/비가격여부) //예: RFQ/RFP/입찰/2step입찰

/*************************************************************************************/
//** 마스터 - 선언부
/*************************************************************************************/
/** 
// # 공통 코드
// ## 견적 헤더
  Sc_Award_Prog_Status_Code_View - [임시생성-삭제예정][공통코드=SP_SC_AWARD_PROG_STATUS_CODE] 낙찰진행상태 - 타스크럼 제공 예정
  Sc_Nego_Prog_Status_Code_View  - [공통코드=SP_SC_NEGO_PROG_STATUS_CODE][SP_SC] 협상진행상태
  Sc_Award_Type_Code_View        - [공통코드=SP_SC_AWARD_TYPE_CODE][SP_SC] 낙찰유형
  Sc_Award_Method_Code_View      - [공통코드=SP_SC_AWARD_METHOD_CODE][SP_SC] 낙찰방
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
    [1:N] Sc_Nego_Type_Code              - [SP_SC] 협상유형
  Sc_Nego_Type_Code              - [SP_SC] 협상유형
    [N:1] Sc_Nego_Parent_Type_Code       - [SP_SC] 협상상위유형[견적/입찰]
    [N:1] Sc_Nego_Supeval_Type_Code      - [SP_SC] 협상공급업체평가유형[가격/가격+비가격]
    [1:N] Sc_Outcome_Code                - [SP_SC] 아웃컴
  [폐기예정]Sc_Award_Type_Code             - [SP_SC] 낙찰유형[라인별기준|총액기준] - 폐기예정 : 현시점 견적/입찰 구분 불필요
  Sc_Nego_Award_Method_Code      - [SP_SC] 협상낙찰방법[최저가격공급업체/다중공급업체]
     ==> Nego Parent Type vs Award Type vs Award Method
    [N:1] Sc_Nego_Parent_Type_Code       - [SP_SC] 협상상위유형[견적/입찰]
    [N:1] Sc_Award_Type_Code_View        - [공통코드=SP_SC_AWARD_TYPE_CODE][SP_SC] 낙찰유형
    [N:1] Sc_Award_Method_Code_View      - [공통코드=SP_SC_AWARD_METHOD_CODE][SP_SC] 낙찰방법
  Sc_Nego_Supeval_Type_Code      - [SP_SC] 협상공급업체평가유형[가격/가격+비가격]
  [폐기]Sc_Evaluation_Type_Code        - [SP_SC] 평가유형[가격/가격+비가격] << 폐기예정
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


@cds.autoexpose  // 견적|입찰 여부 
//> SomeCodeListEntity will be auto-exposed as @readonly
entity Sc_Nego_Parent_Type_Code {
    key tenant_id             : type of orgTenant.Org_Tenant : tenant_id @title : '테넌트ID';
    key nego_parent_type_code : String(30) not null                      @title : '협상상위유형코드';
        sort_no               : Decimal not null                         @title : '정렬번호';
        nego_parent_type_name : localized String(240)                    @title : '협상상위유형이름';
        nego_types             : Composition of many Sc_Nego_Type_Code
                                    on nego_types.tenant_id = $self.tenant_id
                                    and nego_types.nego_parent_type_code = $self.nego_parent_type_code
// nego_parent_type_desc : localized String(1000)           @title : 'Description';
};

extend Sc_Nego_Parent_Type_Code with util.Managed;

@cds.autoexpose  // 협상유형코드(RFQ|RFP|BID|2ndBID)
entity Sc_Nego_Type_Code {
    key tenant_id             : type of orgTenant.Org_Tenant : tenant_id                 @title : '테넌트ID';
    key nego_type_code        : String(30) not null                                      @title : '협상타입코드';
        sort_no               : Decimal not null                                         @title : '정렬번호';
        nego_parent_type_code : type of Sc_Nego_Parent_Type_Code : nego_parent_type_code @title : '협상상위유형코드';
        nego_parent_type : Association to Sc_Nego_Parent_Type_Code 
                             on nego_parent_type.tenant_id       = $self.tenant_id
                             and nego_parent_type.nego_parent_type_code = $self.nego_parent_type_code
                             @title : '협상상위유형 Navi.';
        nego_supeval_type_code  : type of Sc_Nego_Supeval_Type_Code : nego_supeval_type_code   @title : '평가유형코드';
        nego_supeval_type : Association to Sc_Nego_Supeval_Type_Code 
                             on nego_supeval_type.tenant_id       = $self.tenant_id
                             and nego_supeval_type.nego_supeval_type_code = $self.nego_supeval_type_code
                             @title : '협상공급업체평가유형 Navi.';
        nego_type_name        : localized String(240)                                    @title : '협상타입이름';
        Outcomes : Association to many Sc_Outcome_Code 
                             on Outcomes.tenant_id       = $self.tenant_id
                             and Outcomes.nego_type_code = $self.nego_type_code
                             @title : 'Outcomes Navi.';
// nego_type_desc : localized String(1000)           @title : 'Description';
};

extend Sc_Nego_Type_Code with util.Managed;

// @cds.autoexpose  // 낙찰 유형(라인별기준|총액기준) - 보류 : 현기준 견적/입찰 구분 불필요
// entity Sc_Award_Type_Code {
//     key tenant_id             : type of orgTenant.Org_Tenant : tenant_id               @title : '테넌트ID';
//     key nego_parent_type_code : type of Sc_Nego_Parent_Type_Code:nego_parent_type_code @title : '협상상위유형코드';
//     key award_type_code       : String(30) not null                                    @title : '낙찰유형코드';
//         sort_no               : Decimal not null                                       @title : '정렬번호';
//         award_type_name       : localized String(240)                                  @title : '낙찰유형이름';
// // award_type_desc : localized String(1000)                 @title : 'Description';
// };

// extend Sc_Award_Type_Code with util.Managed;

@cds.autoexpose  // 낙찰 방법(최저가격공급업체|다중공급업체) : NegoParentType vs AwardType vs AwardMethod
entity Sc_Nego_Award_Method_Code {
    key tenant_id             : type of orgTenant.Org_Tenant : tenant_id               @title : '테넌트ID';
    key nego_parent_type_code : type of Sc_Nego_Parent_Type_Code:nego_parent_type_code @title : '협상상위유형코드';
        nego_parent_type : Association to Sc_Nego_Parent_Type_Code 
                             on nego_parent_type.tenant_id       = $self.tenant_id
                             and nego_parent_type.nego_parent_type_code = $self.nego_parent_type_code
                             @title : '협상상위유형 Navi.';
    key award_type_code       : type of Sc_Award_Type_Code_View:award_type_code        @title : '낙찰유형코드';
        award_type : Association to Sc_Award_Type_Code_View 
                             on award_type.tenant_id       = $self.tenant_id
                             and award_type.award_type_code = $self.award_type_code
                             @title : '낙찰유형 Navi.';
    key award_method_code     : type of Sc_Award_Method_Code_View: award_method_code   @title : '낙찰방법코드';
        award_method : Association to Sc_Award_Method_Code_View 
                             on award_method.tenant_id       = $self.tenant_id
                             and award_method.award_method_code = $self.award_method_code
                             @title : '낙찰방법 Navi.';
        sort_no               : Decimal not null                                       @title : '정렬번호';
// award_type_desc : localized String(1000)                 @title : 'Description';
};

extend Sc_Nego_Award_Method_Code with util.Managed;

@cds.autoexpose  // 낙찰 방법(최저가격공급업체|다중공급업체) : NegoType vs AwardType vs AwardMethod
entity Sc_Nego_Award_Method_Map as projection on Sc_Nego_Award_Method_Code {
        key tenant_id,
        key nego_parent_type.nego_types.nego_type_code,
        key award_type_code,
        key award_method_code,
            nego_parent_type.nego_types.nego_type_name,
            nego_parent_type_code,
            nego_parent_type.nego_parent_type_name,
            award_type.award_type_name,
            award_method.award_method_name
};

// Cannot Extend with View or Project => How to use????
// extend entity Sc_Nego_Award_Method_Map {
//         award_method2 : Association to Sc_Award_Method_Code_View 
//                              on award_method2.tenant_id       = $self.tenant_id
//                              and award_method2.award_method_code = $self.award_method_code
//                              @title : '낙찰방법2 Navi.';
// };

@cds.autoexpose  // 협상 스타일(최저가격공급업체|다중공급업체) : NegoParentType vs NegotiationStyle
entity Sc_Negotiation_Style_Code {
    key tenant_id             : type of orgTenant.Org_Tenant : tenant_id               @title : '테넌트ID';
    key nego_parent_type_code : type of Sc_Nego_Parent_Type_Code:nego_parent_type_code @title : '협상상위유형코드';
        nego_parent_type : Association to Sc_Nego_Parent_Type_Code 
                             on nego_parent_type.tenant_id       = $self.tenant_id
                             and nego_parent_type.nego_parent_type_code = $self.nego_parent_type_code
                             @title : '협상상위유형 Navi.';
    key negotiation_style_code: String(30)                                             @title : '협상스타일코드';
        negotiation_style_name: localized String(240)                                  @title : '협상스타일이름';
        sort_no               : Decimal not null                                       @title : '정렬번호';
// negotiation_style_desc : localized String(1000)                 @title : 'Description';
};
extend Sc_Negotiation_Style_Code with util.Managed;

@cds.autoexpose  // 낙찰 방법(최저가격공급업체|다중공급업체) : NegoType vs AwardType vs AwardMethod
entity Sc_Negotiation_Style_Map as projection on Sc_Negotiation_Style_Code {
        key tenant_id,
        key nego_parent_type.nego_types.nego_type_code,
            nego_parent_type.nego_types.nego_type_name,
        key negotiation_style_code,
            negotiation_style_name,
            nego_parent_type_code,
            nego_parent_type.nego_parent_type_name
};

// define view Sc_Nego_Award_Method_Code_View as
//     select from Sc_Nego_Type_Code as ntc
//     inner join Sc_Nego_Award_Method_Code namc
//         on ntc.tenant_id = namc.tenant_id
//         and ntc.nego_parent_type_code = namc.nego_parent_type_code
//     {
//         key namc.tenant_id,
//         key ntc.nego_type_code,
//         key namc.award_type_code,
//         key namc.award_method_code,
//             ntc.nego_type_name,
//             namc.nego_parent_type_code,
//             namc.nego_parent_type.nego_parent_type_name,
//             namc.award_type.award_type_name,
//             namc.award_method.award_method_name
//     };

// @cds.autoexpose  // 평가유형(가격|가격&비가격)-폐기예정
// entity Sc_Evaluation_Type_Code {
//     key tenant_id             : type of orgTenant.Org_Tenant : tenant_id @title : '테넌트ID';
//     key evaluation_type_code  : String(30) not null                      @title : '평가유형코드';
//         sort_no               : Decimal not null                         @title : '정렬번호';
//         evaluation_type_name  : localized String(240)                     @title : '평가유형이름';
// // evaluation_type_desc : localized String(1000)           @title : 'Description';
// };
// 
// extend Sc_Evaluation_Type_Code with util.Managed;

@cds.autoexpose  // 협상공급업체평가유형(가격|가격&비가격)
entity Sc_Nego_Supeval_Type_Code {
    key tenant_id               : type of orgTenant.Org_Tenant : tenant_id  @title : '테넌트ID';
    key nego_supeval_type_code  : String(30) not null                       @title : '협상공급업체평가유형코드';
        sort_no                 : Decimal not null                          @title : '정렬번호';
        nego_supeval_type_name  : localized String(240)                     @title : '협상공급업체평가유형이름';
// nego_supeval_type_desc : localized String(1000)           @title : 'Description';
};

extend Sc_Nego_Supeval_Type_Code with util.Managed;

@cds.autoexpose  // 아웃컴코드(BPA)
entity Sc_Outcome_Code {

    key tenant_id      : String(5) not null                 @title : '테넌트ID';
        // key nego_type      : Association to Nego_Type_Code {
        //                          nego_type_code as code
        //                      }                    @title : '협상타입코드';
    key nego_type_code : type of Sc_Nego_Type_Code : nego_type_code @title : '협상타입코드';
        nego_type      : Association to Sc_Nego_Type_Code
                             on nego_type.tenant_id       = $self.tenant_id
                             and nego_type.nego_type_code = $self.nego_type_code
                                                            @title : '협상타입';
    key outcome_code   : String(30) not null                @title : '아웃컴코드';
        sort_no        : Decimal not null                   @title : '정렬번호';
        outcome_name   : localized String(240)              @title : '아웃컴이름';
// outcome_descr  : localized String(1000)@title : 'Description';
};

extend Sc_Outcome_Code with util.Managed;
