namespace ep;

@cds.persistence.exists
entity Po_Forex_Declaration_View {
    key tenant_id                   : String(5) not null    @title : '테넌트ID';
    key company_code                : String(10) not null   @title : '회사코드';
    key po_number                   : String(50) not null   @title : 'LOI작성번호';
        forex_declare_status_code   : String(30)            @title : '외환신고상태코드';
        forex_declare_status_name   : String(240)           @title : '외환신고상태';
        management_target_flag      : Boolean               @title : '관리대상여부';
        declare_target_flag         : Boolean               @title : '신고대상여부';
        declare_scheduled_date      : Date                  @title : '신고예정일자';
        declare_date                : Date                  @title : '신고일자';
        processed_complete_date     : Date                  @title : '처리완료일자';
        attch_group_number          : String(100)           @title : '첨부파일그룹번호';
        remark                      : String(3000)          @title : '비고';
        org_type_code               : String(2)             @title : '조직유형코드';
        org_code                    : String(10)            @title : '조직코드';
        po_name                     : String(50)            @title : 'PO명';
        plant_code                  : String(10)            @title : '플랜트코드';
        plant_name                  : String(240)           @title : '플랜트명';
        currency_name               : String(15)            @title : '통화코드';
        po_amount                   : Decimal               @title : 'PO금액';
        prepay_amount               : Decimal               @title : '선급금액';
        supplier_code               : String(10)            @title : '공급업체코드';
        supplier_name               : String(240)           @title : '공급업체로컬명';	
        po_date                     : Date                  @title : 'PO일자';	
        prepay_date                 : Date                  @title : '선급금지급일자';			
        receipt_scheduled_date      : Date                  @title : '입고예정일자';	
        receipt_date                : Date                  @title : '입고일자';	
        purchasing_department_code  : String(30)            @title : '구매담당부서코드';	
        purchasing_department_name  : String(240)           @title : '구매담당부서로컬명';        
        buyer_empno                 : String(50)            @title : '구매담당자사번';	
        buyer_name                  : String(240)           @title : '구매담당자로컬명';	
        color_type_code             : String(30)            @title : '선정상태컬러';        
}