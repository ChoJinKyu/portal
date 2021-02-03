
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
  1. service       : Np 단가 품의
  2. description   : 단가 품의
  3. history
    -. 2021.01.29 : 윤상봉 최초작성
*************************************************/

namespace sp;

@path : '/sp.netpriceApprovalDetailV4Service'
service NpApprovalDetailV4Service {

    type masterType : {
        tenant_id                       : String(5)     ; // 'L1100'
        company_code                    : String(10)    ; // '회사코드'
        org_type_code                   : String(2)     ; // '구매운영조직유형'
        org_code                        : String(10)    ; // '구매운영조직코드'
        approval_number                 : String(50)    ; // '품의번호'

        approval_title                  : String(300)   ; // '품의제목'
        approval_contents               : LargeString   ; // '품의 내용'
        attch_group_number              : String(100)   ; // '첨부파일그룹번호'

        net_price_document_type_code    : String(30)    ; // '단가문서유형코드' 
        net_price_source_code           : String(30)    ; // '단가출처코드'
        buyer_empno                     : String(30)    ; // '구매담당자사번'
        tentprc_flag                    : Boolean       ; // '가단가여부'
        outcome_code                    : String(30)    ; // 'OutCome코드'
        //approval_excl_flag              : Boolean       ; // '승인제외여부'
    }

    /* */
    type DetailType : {
        item_sequence                   : Decimal       ; // '품목순번'	
        line_type_code                  : String(30)    ; // '라인유형코드'
        material_code                   : String(40)    ; // '자재코드'	
        payterms_code                   : String(30)    ; // '지불조건코드'	
        supplier_code                   : String(10)    ; // '공급업체코드'	
        effective_start_date            : Date          ; // '유효시작일자'	
        effective_end_date              : Date          ; // '유효종료일자'	
        surrogate_type_code             : String(30)    ; // '대리견적유형코드'	
        currency_code                   : String(3)     ; // '통화코드'	
        net_price                       : Decimal       ; // '단가'		
        vendor_pool_code                : String(20)    ; // '협력사풀코드'	
        market_code                     : String(30)    ; // '납선코드'	
        net_price_approval_reason_code  : String(30)    ; // '단가품의사유코드'	
        maker_code                      : String(10)    ; // '제조사코드'		
        incoterms                       : String(3)     ; // '인코텀즈'
    };

    /* */
    type ParamType : {
        master    : masterType;
        details   : array of DetailType;
        user_id   : String(255);
        user_no   : String(255);
    }

    /**
    
    */
    type ResultType : {
        return_code      : String(2);
        return_msg       : String(5000);
        approval_number  : String(50);
    };


    action ApprovalSaveProc( param : ParamType ) returns ResultType;

}