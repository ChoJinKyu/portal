/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시 entity 위에 @cds.persistence.exists 명시    
  5. namespace : pg
  6. entity : It_Txn_Po_Doc
  7. entity description : PO 업무용 (SAC)
  8. history
  -. 2021.01.04 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Txn_Po_Doc {
    key tenant_id                        : String(5) not null  @title : '테넌트ID';
    key company_code                     : String(10) not null @title : '회사코드';
    key org_type_code                    : String(30) not null @title : '조직유형코드';
    key org_code                         : String(10) not null @title : '조직코드';
    key po_number                        : String(50) not null @title : 'PO번호';
    key po_item_number                   : String(10) not null @title : 'PO품목번호';
        po_category_cd                   : String(2)           @title : 'PO범주코드';
        po_type_code                     : String(6)           @title : 'PO유형코드';
        supplier_code                    : String(15)          @title : '공급업체코드';
        payterms_code                    : String(30)          @title : '지불조건코드';
        po_pay_days                      : Decimal(5, 0)       @title : 'PO지급일수';
        purchasing_org_code              : String(10)          @title : '구매조직코드';
        purchasing_group_code            : String(3)           @title : '구매그룹코드';
        po_currency_code                 : String(3)           @title : 'PO통화코드';
        po_exrate                        : Decimal(20, 10)     @title : 'PO환율';
        po_doc_date                      : Date                @title : 'PO증빙일자';
        effective_start_date             : Date                @title : '유효시작일자';
        effective_end_date               : Date                @title : '유효종료일자';
        issue_plant_code                 : String(4)           @title : '출고플랜트코드';
        termsdelv_code                   : String(30)          @title : '인도조건코드';
        termsdelv_desc_2                 : String(50)          @title : '인도조건내역2';
        remark                           : String(100)         @title : '비고';
        buyer_empno                      : String(30)          @title : '구매담당자사번';
        buyer_name                       : String(50)          @title : '구매담당자명';
        massprod_flag                    : String(1)           @title : '양산여부';
        delete_flag                      : String(1)           @title : '삭제여부';
        po_desc                          : String(100)         @title : 'PO내역';
        material_code                    : String(40)          @title : '자재코드';
        plant_code                       : String(4)           @title : '플랜트코드';
        sloc_code                        : String(30)          @title : '저장위치코드';
        po_unit                          : String(3)           @title : '구매오더단위';
        purchasing_quantity              : Decimal             @title : '구매수량';
        price_unit_switch_numerator      : Decimal(5, 0)       @title : '가격단위전환분자';
        price_unit_switch_denominator    : Decimal(5, 0)       @title : '가격단위전환분모';
        base_unit_switch_numerator       : Decimal(5, 0)       @title : '기본단위전환분자';
        base_unit_switch_denominator     : Decimal(5, 0)       @title : '기본단위전환분모';
        po_net_price                     : Decimal             @title : 'PO단가';
        po_price_unit                    : Decimal(5, 0)       @title : 'PO가격단위';
        po_amount                        : Decimal             @title : '구매오더금액';
        tax_code                         : String(10)          @title : '세금코드';
        valuation_type_code              : String(30)          @title : '평가유형코드';
        delivery_complete_indicator      : String(1)           @title : '납품완료지시자';
        po_item_category_code            : String(2)           @title : 'PO품목범주코드';
        account_assignment_category_code : String(2)           @title : '계정지정범주코드';
        purchasing_contract_number       : String(50)          @title : '구매계약번호';
        contract_item_number             : String(10)          @title : '계약품목번호';
        special_inventory_indicator      : String(2)           @title : '특별재고지시자';
        item_termsdelv_code              : String(30)          @title : '품목인도조건코드';
        item_termsdelv_desc_2            : String(50)          @title : '품목인도조건내역2';
        erp_pr_number                    : String(50)          @title : 'ERP구매요청번호';
        pr_item_number                   : String(10)          @title : '구매요청품목번호';
        material_type_code               : String(6)           @title : '자재유형코드';
        return_item_flag                 : String(1)           @title : '반품품목여부';
        cert_tax_pay_raw_processed_flag  : String(1)           @title : '기납증처리여부';
        gl_account_code                  : String(30)          @title : 'GL계정코드';
        cctr_code                        : String(10)          @title : '비용부서코드';
        prctr_code                       : String(15)          @title : '손익센터코드';
        project_code                     : String(15)          @title : '프로젝트코드';
        delivery_schedule_item_number    : String(10)          @title : '납품일정품목번호';
        delivery_request_date            : Date                @title : '납품요청일자';
        special_note                     : LargeString         @title : '특기사항';
}

extend It_Txn_Po_Doc with util.Managed;
