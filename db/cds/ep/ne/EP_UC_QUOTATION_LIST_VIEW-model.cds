namespace ep;

using util from '../../cm/util/util-model';

@cds.persistence.exists
entity Uc_Quotation_List_View {

    key tenant_id                  : String(5) not null     @title : '테넌트ID';
    key company_code               : String(10) not null    @title : '회사코드';
    key const_quotation_number     : String(30) not null    @title : '공사견적번호';
        org_code                   : String(10)             @title : '조직코드';
        org_name                   : String(10)             @title : '조직';
        const_name                 : String(200)            @title : '공사명';
        ep_item_code               : String(200)            @title : '대분류(공종)';
        ep_item_name               : String(200)            @title : '대분류(공종)';
        const_start_date           : Date                   @title : '공사시작일자';
        const_end_date             : Date                   @title : '공사종료일자';
        quotation_status_code      : String(30)             @title : '견적상태코드';
        quotation_status_name      : String(30)             @title : '견적상태';
        supplier_code              : String(30)             @title : '공급업체코드';
        supplier_name              : String(30)             @title : '공급업체';
        supplier_person_id         : String(255)            @title : '공급업체담당자ID';
        buyer_empno                : String(30)             @title : '구매담당자사번';
        buyer_name                 : String(30)             @title : '구매담당자';
        const_person_empno         : String(30)             @title : '공사담당자사번';
        const_person_name          : String(30)             @title : '공사담당자';
        purchasing_department_code : String(50)             @title : '구매부서코드';
        purchasing_department_name : String(50)             @title : '구매부서';
        pr_number                  : String(50)             @title : '구매요청번호'; 
        quotation_write_date       : Date                   @title : '견적작성일자';
        remark                     : String(3000)           @title : '비고';
        currency_code              : String(15)             @title : '통화코드';
        attch_group_number         : String(100)            @title : '첨부파일그룹번호';
        supplier_write_flag        : Boolean                @title : '공급업체작성여부';
        completion_flag            : Boolean                @title : '준공여부';
        completion_date            : Date                   @title : '준공일자';
        facility_person_empno      : String(30)             @title : '시설담당자사번';
        facility_person_name       : String(30)             @title : '시설담당자'; 
        facility_department_code   : String(50)             @title : '시설부서코드'; 
        completion_attch_group_number   : String(50)        @title : '준공첨부파일그룹번호'; 
        delivery_request_date      : Date                   @title : '납품요청일자';
        color_type_code             : String(30)            @title : '선정상태컬러';


}

extend Uc_Quotation_List_View with util.Managed;