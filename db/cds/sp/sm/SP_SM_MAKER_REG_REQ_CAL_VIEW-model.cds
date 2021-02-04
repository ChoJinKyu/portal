namespace sp;

@cds.persistence.exists

entity Sm_Maker_Reg_Req_Cal_View {
    key tenant_id                         : String(5)   @title : '테넌트ID';
    key maker_request_sequence            : Integer64   @title : '제조사요청순번';
        maker_request_type_code           : String(30)  @title : '제조사요청타입코드';
        maker_progress_status_code        : String(30)  @title : '제조사진행상태코드';
        requestor_empno                   : String(30)  @title : '요청자사번';
        requestor_local_name              : String(240) @title : '요청자로컬명';
        requestor_korean_name             : String(240) @title : '요청자한글명';
        requestor_english_name            : String(240) @title : '요청자영문명';
        requestor_department_code         : String(50)  @title : '요청자부서';
        requestor_department_local_name   : String(240) @title : '요청자부서로컬명';
        requestor_department_korean_name  : String(240) @title : '요청자부서한글명';
        requestor_department_english_name : String(240) @title : '요청자부서영문명';
        tax_id                            : String(30)  @title : '세금등록번호';
        maker_code                        : String(10)  @title : '제조사코드';
        maker_local_name                  : String(240) @title : '제조사로컬명';
        maker_english_name                : String(240) @title : '제조사영문명';
        country_code                      : String(2)   @title : '국가코드';
        country_name                      : String(30)  @title : '국가명';
        vat_number                        : String(30)  @title : 'VAT등록번호';
        zip_code                          : String(20)  @title : '우편번호';
        maker_local_city                  : String(240) @title : '로컬주소(도시)';
        maker_local_region                : String(240) @title : '로컬주소(지역)';
        maker_local_address               : String(240) @title : '로컬주소(상세주소)';
        maker_local_full_address          : String(1000)@title : '로컬전체주소';
        maker_english_city                : String(240) @title : '영문주소(도시)';
        maker_english_region              : String(240) @title : '영문주소(지역)';
        maker_english_address             : String(240) @title : '영문주소(상세주소)';
        maker_english_full_address        : String(1000)@title : '영문전체주소';
        affiliate_code                    : String(10)  @title : '관계사코드';
        affiliate_name                    : String(50)  @title : '관계사코드명';
        company_class_code                : String(30)  @title : '회사분류코드';
        company_class_name                : String(50)  @title : '회사분류명';
        represent_name                    : String(30)  @title : '대표자명';
        company_tel_number                : String(50)  @title : '전화번호';
        company_email_address             : String(240) @title : '이메일주소';
        maker_status_code                 : String(30)  @title : '제조사상태코드';
        maker_status_name                 : String(50)  @title : '제조사상태명';
        biz_certi_attch_number            : String(100) @title : '사업자등록증첨부파일번호';
        attch_number_2                    : String(100) @title : '첨부파일번호2';
        attch_number_3                    : String(100) @title : '첨부파일번호3';
        local_create_dtm                  : DateTime    @title : '로컬등록시간';
        local_update_dtm                  : DateTime    @title : '로컬수정시간';
        create_user_id                    : String(255) @title : '등록사용자ID';
        update_user_id                    : String(255) @title : '변경사용자ID';
        system_create_dtm                 : DateTime    @title : '시스템등록시간';
        system_update_dtm                 : DateTime    @title : '시스템수정시간';
}
