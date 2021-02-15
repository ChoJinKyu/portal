
/************************************************
  ---------Service정의 Rule  ------------------
  1. 선언부(Using)
    - '체인명(pg)'만 주고 as 이후는 Naming은 소문자로 시작
  2. namespace
    -  체인 소문자로 작성
    -  체인하위의 소모듈 존재시 체인.소모듈 로 작성
  
  3. entity
    - 선언부 이름을 사용하되 첫 글자는 대문자로 변경하여 사용하고 as projection on 이후에는 선언부 이름.모델 파일에 정의된 Entity명으로 정의
  
  4. 서비스에서 정의하는 View는 첫글자는 대문자로 시작하고 끝은 View를 붙인다  
  5. 서비스에서 정의하는 View의 컬럼(속성)
    - 소문자로 작성

*  화면 및 서비스 확인을 위한 wap서버 올릴때 명령어 ==>  mvn spring-boot:run

  --------- 현 Service 설명 -------------------
  1. service       : Np 기본가조회
  2. description   : 기본가조회
  3. history
    -. 2021.02.04 : 우완희
*************************************************/
using { sp.Np_Net_Price_Approval_Dtl as SP_NP_NET_PRICE_APPROVAL_DTL } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_DTL-model';
using { sp.Np_Base_Price_Mst         as SP_NP_BASE_PRICE_MST         } from '../../../../../db/cds/sp/np/SP_NP_BASE_PRICE_MST-model';
using { sp.Sm_Supplier_Mst           as SP_SM_SUPPLIER_MST           } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';


namespace sp;

@path : '/sp.netpriceApprovalDetailPriceV4Service'
service NpApprovalDetailPriceV4Service {

    type inputTableType : {
        tenant_id                       : type of SP_NP_NET_PRICE_APPROVAL_DTL : tenant_id          ; // 'L1100'
        company_code                    : type of SP_NP_NET_PRICE_APPROVAL_DTL : company_code       ; // '회사코드'
        org_type_code                   : type of SP_NP_NET_PRICE_APPROVAL_DTL : org_type_code      ; // '구매운영조직유형'
        org_code                        : type of SP_NP_NET_PRICE_APPROVAL_DTL : org_code           ; // '구매운영조직코드'
        approval_number                 : type of SP_NP_NET_PRICE_APPROVAL_DTL : approval_number    ; 
        item_sequence                   : type of SP_NP_NET_PRICE_APPROVAL_DTL : item_sequence      ;   
        supplier_code                   : type of SP_NP_NET_PRICE_APPROVAL_DTL : supplier_code      ; 
        material_code                   : type of SP_NP_NET_PRICE_APPROVAL_DTL : material_code      ; 
        market_code                     : type of SP_NP_NET_PRICE_APPROVAL_DTL : market_code        ; 
        currency_code                   : type of SP_NP_NET_PRICE_APPROVAL_DTL : currency_code      ; 
    }

    /*  */
    type outTableType : {
        tenant_id                       : type of SP_NP_NET_PRICE_APPROVAL_DTL : tenant_id                       ; // 'L1100'
        company_code                    : type of SP_NP_NET_PRICE_APPROVAL_DTL : company_code                    ; // '회사코드'
        org_type_code                   : type of SP_NP_NET_PRICE_APPROVAL_DTL : org_type_code                   ; // '구매운영조직유형'
        org_code                        : type of SP_NP_NET_PRICE_APPROVAL_DTL : org_code                        ; // '구매운영조직코드'
        approval_number                 : type of SP_NP_NET_PRICE_APPROVAL_DTL : approval_number                 ; 
        item_sequence                   : type of SP_NP_NET_PRICE_APPROVAL_DTL : item_sequence                   ;   
        supplier_code                   : type of SP_NP_NET_PRICE_APPROVAL_DTL : supplier_code                   ; 
        supplier_name                   : type of SP_SM_SUPPLIER_MST : supplier_local_name                       ; 
        material_code                   : type of SP_NP_NET_PRICE_APPROVAL_DTL : material_code                   ; 
        market_code                     : type of SP_NP_NET_PRICE_APPROVAL_DTL : market_code                     ; 
        currency_code                   : type of SP_NP_NET_PRICE_APPROVAL_DTL : currency_code                   ; 
        net_price                       : type of SP_NP_NET_PRICE_APPROVAL_DTL : net_price                       ; 
        base_price_type_code            : type of SP_NP_NET_PRICE_APPROVAL_DTL : base_price_type_code            ; 
        pyear_dec_base_currency_code    : type of SP_NP_NET_PRICE_APPROVAL_DTL : pyear_dec_base_currency_code    ;
        pyear_dec_base_price            : type of SP_NP_NET_PRICE_APPROVAL_DTL : pyear_dec_base_price            ; 
        pyear_dec_ci_rate               : type of SP_NP_NET_PRICE_APPROVAL_DTL : pyear_dec_ci_rate               ; 
        quarter_base_currency_code      : type of SP_NP_NET_PRICE_APPROVAL_DTL : quarter_base_currency_code      ;
        quarter_base_price              : type of SP_NP_NET_PRICE_APPROVAL_DTL : quarter_base_price              ;
        quarter_ci_rate                 : type of SP_NP_NET_PRICE_APPROVAL_DTL : quarter_ci_rate                 ;
        base_date                       : type of SP_NP_BASE_PRICE_MST : base_date                  ;
        base_currency_code              : type of SP_NP_BASE_PRICE_MST : currency_code              ; 
        base_price                      : type of SP_NP_BASE_PRICE_MST : base_price                 ; 
        base_apply_start_yyyymm         : type of SP_NP_BASE_PRICE_MST : apply_start_yyyymm         ; 
        base_apply_end_yyyymm           : type of SP_NP_BASE_PRICE_MST : apply_end_yyyymm           ;                          
    };

    /* */
    type ParamType : {
        tenant_id                       : type of SP_NP_NET_PRICE_APPROVAL_DTL : tenant_id                       ;
        language_code   : String(2);
        inDetails       : array of inputTableType;
    }

    /*  */
    type ResultType : {
        return_code     : String(5);
        return_msg      : String(4000);
        outDetails      : array of outTableType;
    };

    action ApprovalPriceInfoProc( param : ParamType ) returns ResultType;

}