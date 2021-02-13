namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Li_Publish_View {

    key tenant_id                  : String(5) not null  @title : '테넌트ID';
    key company_code               : String(10) not null @title : '회사코드';
    key loi_publish_number         : String(50) not null @title : 'LOI발행번호';
        loi_publish_title          : String(100)         @title : 'LOI발행제목';
        loi_publish_status_code    : String(30)          @title : 'LOI발행상태코드';
        loi_publish_status_name    : String(240)         @title : 'LOI발행상태명';
        supplier_code              : String(10)          @title : '공급업체코드';
        supplier_name              : String(240)         @title : '공급업체명';
        contract_format_id         : String(100)         @title : '계약서식ID';
        offline_flag               : Boolean             @title : '오프라인여부';
        contract_date              : String(10)          @title : '계약일자';
        additional_condition_desc  : String(1000)        @title : '부대조건설명';
        special_note               : LargeString         @title : '특기사항';
        attch_group_number         : String(100)         @title : '첨부파일그룹번호';
        approval_number            : String(50)          @title : '품의번호';
        buyer_empno                : String(30)          @title : '구매담당자사번';
        buyer_name                 : String(50)          @title : '구매담당자명';
        purchasing_department_code : String(50)          @title : '구매부서코드';
        purchasing_department_name : String(200)         @title : '구매부서명';
        publish_date               : Date                @title : 'LOI요청제목';
        remark                     : String(3000)        @title : '비고';
        org_type_code              : String(2)           @title : '조직유형코드';
        org_code                   : String(10)          @title : '조직코드';

}

extend Li_Publish_View with util.Managed;
