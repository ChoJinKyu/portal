
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

namespace sp;

@path : '/sp.netpriceApprovalDetailPriceV4Service'
service NpApprovalDetailPriceV4Service {


    type inputTableType : {
        tenant_id                       : String(5)     ; // 'L1100'
        company_code                    : String(10)    ; // '회사코드'
        org_type_code                   : String(2)     ; // '구매운영조직유형'
        org_code                        : String(10)    ; // '구매운영조직코드'
        approval_number                 : String(50)    ; 
        item_sequence                   : Integer64     ;   
        supplier_code                   : String(15)    ; 
        material_code                   : String(40)    ; 
        market_code                     : String(30)    ; 
    }

    /*  */
    type outTableType : {
        tenant_id                       : String(5)     ; // 'L1100'
        company_code                    : String(10)    ; // '회사코드'
        org_type_code                   : String(2)     ; // '구매운영조직유형'
        org_code                        : String(10)    ; // '구매운영조직코드'
        approval_number                 : String(50)    ; 
        item_sequence                   : Integer64     ;   
        supplier_code                   : String(15)    ; 
        supplier_name                   : String(240)   ; 
        material_code                   : String(40)    ; 
        market_code                     : String(30)    ; 
        currency_code                   : String(3)     ; 
        base_price                      : Decimal(34,10); 
        base_price_type_code            : String(30)    ; 
        pyear_dec_base_currency_code    : String(3)     ;
        pyear_dec_base_price            : Decimal(34,10); 
        pyear_dec_ci_rate               : Decimal(34,10); 
        quarter_base_currency_code      : String(3)     ;
        quarter_base_price              : Decimal(34,10);
        quarter_ci_rate                 : Decimal(34,10);
    };

    /* */
    type ParamType : {
        tenant_id : String(5);
        language_code : String(2);
        inDetails    : array of inputTableType;
    }

    /*  */
    type ResultType : {
        return_code     : String(5);
        return_msg      : String(4000);
        outDetails      : array of outTableType;
    };

    action ApprovalPriceInfoProc( param : ParamType ) returns ResultType;

}