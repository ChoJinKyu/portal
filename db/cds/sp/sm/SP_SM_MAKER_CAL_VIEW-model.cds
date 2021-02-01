namespace sp;

@cds.persistence.exists

entity Sm_Maker_Cal_View {
    key tenant_id                  : String(5)   @title : '테넌트ID';
    key maker_code                 : String(10)  @title : '제조사코드';
        maker_local_name           : String(240) @title : '제조사로컬명';
        maker_english_name         : String(240) @title : '제조사영문명';
        tax_id                     : String(30)  @title : '세금등록번호';
        vat_number                 : String(30)  @title : 'VAT등록번호';
        country_code               : String(2)   @title : '국가코드';
        country_name               : String(30)  @title : '국가명';
        eu_flag                    : String(1)   @title : 'EU Flag';
        maker_status_code          : String(1)   @title : '제조사상태코드';
        maker_status_name          : String(240) @title : '제조사상태코드명';
        zip_code                   : String(20)  @title : '우편번호';
        maker_local_city           : String(240) @title : '로컬주소(도시)';
        maker_local_region         : String(240) @title : '로컬주소(지역)';
        maker_local_address        : String(240) @title : '로컬주소(상세주소)';
        maker_local_full_address   : String(1000)@title : '로컬 전체주소';
        maker_english_city         : String(240) @title : '영문주소(도시)';
        maker_english_region       : String(240) @title : '영문주소(지역)';
        maker_english_address      : String(240) @title : '영문주소(상세주소)';
        maker_english_full_address : String(1000)@title : '영문 전체주소';
        affiliate_code             : String(10)  @title : '관계사코드';
        affiliate_name             : String(50)  @title : '관계사코드명';
        company_class_code         : String(30)  @title : '회사분류코드';
        company_class_name         : String(50)  @title : '회사분류명';
        represent_name             : String(30)  @title : '대표자명';
        company_tel_number         : String(50)  @title : '전화번호';
        company_email_address      : String(240) @title : '이메일주소';
        old_maker_code             : String(15)  @title : '구제조사코드';
        local_create_dtm           : DateTime    @title : '로컬등록시간';
        local_update_dtm           : DateTime    @title : '로컬수정시간';
        create_user_id             : String(255) @title : '등록사용자ID';
        update_user_id             : String(255) @title : '변경사용자ID';
        system_create_dtm          : DateTime    @title : '시스템등록시간';
        system_update_dtm          : DateTime    @title : '시스템수정시간';
}
