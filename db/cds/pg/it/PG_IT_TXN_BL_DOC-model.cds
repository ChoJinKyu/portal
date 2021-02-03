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
  6. entity : It_Txn_Bl_Doc
  7. entity description : 수입BL정보 업무용 (SAC)
  8. history
  -. 2021.01.11 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Txn_Bl_Doc {
    key tenant_id                     : String(5) not null  @title : '테넌트ID';
    key company_code                  : String(10) not null @title : '회사코드';
    key org_type_code                 : String(30) not null @title : '조직유형코드';
    key org_code                      : String(10) not null @title : '조직코드';
    key bl_number                     : String(50) not null @title : 'BL번호';
    key bl_item_number                : String(10) not null @title : 'BL품목번호';
        shipment_degree               : String(1)           @title : '선적차수';
        po_number                     : String(50)          @title : 'PO번호';
        po_item_number                : String(10)          @title : 'PO품목번호';
        bl_publish_date               : Date                @title : 'BL발행일자';
        house_bl_number               : String(50)          @title : 'HouseBL번호';
        w_exch_flag                   : String(1)           @title : '유환여부';
        etd                           : Date                @title : '출발예정일자';
        eta                           : Date                @title : '도착예정일자';
        bef_accpt_indicator           : String(1)           @title : '수입신고수리전반출지시자';
        ata                           : Date                @title : '실제도착일자';
        remark_2                      : String(3000)        @title : '비고2';
        remark_3                      : String(3000)        @title : '비고3';
        remark                        : String(3000)        @title : '비고';
        import_declare_type_code      : String(1)           @title : '수입신고유형코드';
        strategy_purchasing_indicator : String(1)           @title : '전략구매지시자';
        pol_code                      : String(30)          @title : '선적항코드';
        pol_code_name                 : String(100)         @title : '선적항코드명';
        via                           : String(30)          @title : 'VIA';
        plant_code                    : String(4)           @title : '플랜트코드';
        create_date                   : Date                @title : '생성일자';
        purchasing_group_code         : String(3)           @title : '구매그룹코드';
        supplier_code                 : String(15)          @title : '공급업체코드';
        bwt_incoterms                 : String(3)           @title : 'BWT인코텀즈';
        pod_code                      : String(30)          @title : '도착항코드';
        pod_code_name                 : String(100)         @title : '도착항코드명';
        bl_amount_currency_code       : String(3)           @title : 'BL금액통화코드';
        bl_amount                     : Decimal             @title : 'BL금액';
        shipdocs_receiver_name        : String(30)          @title : '선적서류수신자명';
        bl_send_date                  : Date                @title : 'BL송부일자';
        vessel_nationality_code       : String(2)           @title : '선기국적코드';
        material_code                 : String(40)          @title : '자재코드';
        bl_base_unit_code             : String(3)           @title : 'BL기본단위코드';
        bl_net_price                  : Decimal             @title : 'BL단가';
        bl_price_unit                 : Decimal             @title : 'BL가격단위';
        bl_quantity                   : Decimal             @title : 'BL수량';
        bonded_area_code              : String(10)          @title : '보세구역코드';
        bonded_area_internal_code     : String(2)           @title : '보세구역내부코드';
        bonded_trans_serial_number    : String(10)          @title : '보세운송일련번호';
        entry_date                    : Date                @title : '반입일자';
        invoice_amount                : Decimal             @title : '송장금액';
        invoice_amount_currency_code  : String(3)           @title : '송장금액통화코드';
        invoice_local_currency_amount : Decimal             @title : '송장현지통화금액';
        exrate                        : Decimal(20, 10)     @title : '환율';
        commercial_invoice_quantity   : Decimal             @title : '상업송장수량';
        bonded_wh_issue_date          : Date                @title : '보세창고출고일자';
        bonded_wh_issue_quantity      : Decimal             @title : '보세창고출고수량';
        issue_unit                    : String(3)           @title : '출고단위';
}

extend It_Txn_Bl_Doc with util.Managed;