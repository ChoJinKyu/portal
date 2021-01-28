namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Uc_Quotation_List_View {

    key tenant_id                  : String(5) not null     @title : '테넌트ID';
    key company_code               : String(10) not null    @title : '회사코드';
    key const_quotation_number     : String(30) not null    @title : '공사견적번호';
        const_name                 : String(200)            @title : '공사명';
        const_start_date           : Date                   @title : '공사시작일자';
        const_end_date             : Date                   @title : '공사종료일자';
        quotation_status_code      : String(30)             @title : '견적상태코드';
        quotation_status_name      : String(30)             @title : '견적상태';
        supplier_code              : String(30)             @title : '공급업체코드';
        buyer_empno                : String(30)             @title : '구매담당자사번';
        buyer_name                 : String(30)             @title : '구매담당자';
        const_person_empno         : String(30)             @title : '공사담당자사번';
        const_person_name          : String(30)             @title : '공사담당자';
        pr_number                  : String(50)             @title : '구매요청번호'; 
        quotation_write_date       : Date                   @title : '견적작성일자';
        remark                     : String(3000)           @title : '비고';
}

extend Uc_Quotation_List_View with util.Managed;