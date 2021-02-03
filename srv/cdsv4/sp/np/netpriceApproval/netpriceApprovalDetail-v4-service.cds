
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

    /* */
    type DetailType : {
        item_sequence                   : Decimal       ; // '품목순번'	
        quotation_number                : Decimal       ; // '견적번호'	
        quotation_item_number           : Decimal       ; // '견적품목번호'	
        bidding_number                  : Decimal       ; // '입찰번호'	
        bidding_item_number             : Decimal       ; // '입찰품목번호'	
        line_type_code                  : String(30)    ; // '라인유형코드'	
        material_code                   : String(40)    ; // '자재코드'	
        material_desc                   : String(300)   ; // '자재내역'	
        uom_code                        : String(3)     ; // 'UOM코드'	
        payterms_code                   : String(30)    ; // '지불조건코드'	
        supplier_code                   : String(10)    ; // '공급업체코드'	
        effective_start_date            : Date          ; // '유효시작일자'	
        effective_end_date              : Date          ; // '유효종료일자'	
        surrogate_type_code             : String(30)    ; // '대리견적유형코드'	
        currency_code                   : String(3)     ; // '통화코드'	
        net_price                       : Decimal       ; // '단가'	
        purchasing_quantity             : Decimal       ; // '구매수량'	
        purchasing_amount               : Decimal       ; // '구매금액'	
        vendor_pool_code                : String(20)    ; // '협력사풀코드'	
        market_code                     : String(30)    ; // '납선코드'	
        net_price_approval_reason_code  : String(30)    ; // '단가품의사유코드'	
        maker_code                      : String(10)    ; // '제조사코드'	
        agent_code                      : String(30)    ; // '대행사코드'	
        net_price_agreement_sign_flag   : Boolean       ; // '단가합의서명여부'	
        net_price_agreement_status_code : String(30)    ; // '단가합의상태코드'	
        pyear_july_base_currency_code   : String(3)     ; // '전년7월기준통화코드'	
        pyear_july_base_price           : Decimal       ; // '전년7월기준단가'	
        pyear_july_ci_rate              : Decimal       ; // '전년7월CI비율'	
        pyear_dec_base_currency_code    : String(3)     ; // '전년12월기준통화코드'	
        pyear_dec_base_price            : Decimal       ; // '전년12월기준단가'	
        pyear_dec_ci_rate               : Decimal       ; // '전년12월CI비율'	
        quarter_base_currency_code      : String(3)     ; // '분기기준통화코드'	
        quarter_base_price              : Decimal       ; // '분기기준단가'	
        quarter_ci_rate                 : Decimal       ; // '분기CI비율'	
        base_price_type_code            : String(30)    ; // '기준단가유형코드'	
        quality_certi_flag              : Boolean       ; // '품질인증여부'	
        exrate_type_code                : String(30)    ; // '환율유형코드'	
        exrate_date                     : Date          ; // '환율일자'	
        exrate                          : Decimal       ; // '환율'	
        pr_number                       : String(50)    ; // '구매요청번호'	
        pr_item_number                  : String(10)    ; // '구매요청품목번호'	
        material_class_code             : String(30)    ; // '자재클래스코드'	
        po_unit                         : String(3)     ; // '구매오더단위'	
        material_price_unit             : String(3)     ; // '자재가격단위'	
        conversion_net_price            : Decimal       ; // '환산단가'	
        net_price_type_code             : String(30)    ; // '단가유형코드'	
        contract_date                   : String(8)     ; // '계약일자'	
        incoterms                       : String(3)     ; // '인코텀즈'	
        incoterms_2                     : String(3)     ; // '인코텀즈2'	
        tax_code                        : String(10)    ; // '세금코드'	
        overdlv_tolerance               : Decimal       ; // '초과납품허용율'	
        hs_code                         : String(17)    ; // 'HS코드'	
        fta_code                        : String(30)    ; // 'FTA코드'
    };

    /* */
    type ParamType : {
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

        details                         : array of DetailType;

        user_id                         : String(255);
        user_no                         : String(255);
    }

    /**
    
    */
    type ResultType : {
        return_code      : String(2);
        return_msg       : String(5000);
        approval_number  : String(5000);
    };


    action ApprovalSaveProc( param : ParamType ) returns ResultType;

}