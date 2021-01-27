/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시
  entity 위에 @cds.persistence.exists 명시  
  
  5. namespace : sp
  6. entity : Sm_Supplier_Mst
  7. entity description : Supplier Master
  8. history
  -. 2021.01.19 : 정병훈 최초작성
*************************************************/
namespace sp;	
using util from '../../cm/util/util-model';

entity Sm_Supplier_Mst {	
  key   tenant_id                           : String(5)  not null	@title: '테넌트ID' ;	
  key   supplier_code                       : String(10) not null	@title: '공급업체 코드' ;
        supplier_local_name                 : String(240)  	        @title: '공급업체 로컬명' ;
        supplier_english_name               : String(240) 	        @title: '공급업체 영문명' ;
        tax_id                              : String(30)  	        @title: '세금등록번호' ;
        vat_number                          : String(30)            @title: 'VAT등록번호' ;
        CRNO                                : String(50)            @title: '법인등록번호' ;
        tax_id_except_flag                  : Boolean  	            @title: '세금등록번호예외여부' ;
        tax_id_except_nm                    : String(30)  	        @title: '세금등록번호예외명' ;
        tax_id_except_rsn                   : String(200)  	        @title: '세금등록번호예외사유' ;
        duns_number                         : String(9)  	        @title: 'DUNS 번호' ;
        duns_number_4                       : String(4)  	        @title: 'DUNS 번호4' ;
        country_code                        : String(2)  	        @title: '국가코드' ;
        country_name                        : String(30)  	        @title: '국가명' ;
        zip_code                            : String(20)  	        @title: '우편번호' ;
        local_address_1                     : String(240)  	        @title: '로컬주소1' ;
        local_address_2                     : String(240)  	        @title: '로컬주소2' ;
        local_address_3                     : String(240)  	        @title: '로컬주소3' ;
        local_address_4                     : String(240)  	        @title: '로컬주소4' ;
        english_address_1                   : String(240)  	        @title: '영문주소1' ;
        english_address_2                   : String(240)  	        @title: '영문주소2' ;
        english_address_3                   : String(240)  	        @title: '영문주소3' ;
        english_address_4                   : String(240)  	        @title: '영문주소4' ;
        local_full_address                  : String(1000)  	    @title: '로컬 전체주소' ;
        english_full_address                : String(1000)  	    @title: '영문 전체주소' ;
        common_class_code                   : String(30)  	        @title: '공용분류코드' ;
        common_class_name                   : String(50)  	        @title: '공용분류명' ;
        affiliate_code                      : String(10)  	        @title: '관계사코드' ;
        affiliate_code_name                 : String(50)  	        @title: '관계사코드명' ;
        individual_biz_flag                 : Boolean  	            @title: '개인사업자여부' ;
        individual_biz_desc                 : String(1000)  	    @title: '개인사업자설명' ;
        company_register_number             : String(30)  	        @title: '회사등록번호' ;
        company_class_code                  : String(30)  	        @title: '회사분류코드' ;
        company_class_name                  : String(50)  	        @title: '회사분류코드' ;
        subcon_flag                         : Boolean               @title: '하도급여부';
        repre_name                          : String(30)  	        @title: '대표자명' ;
        biz_type                            : String(50)  	        @title: '업태' ;
        industry                            : String(50)  	        @title: '업종' ;
        biz_certi_attch_number              : String(100)  	        @title: '사업자등록증첨부파일번호' ;
        attch_number_2                      : String(100)  	        @title: '첨부파일번호2' ;
        attch_number_3                      : String(100)  	        @title: '첨부파일번호3' ;
        inactive_status_code                : String(30)  	        @title: '비활성상태코드' ;
        inactive_status_name                : String(50)  	        @title: '비활성상태명' ;
        inactive_date                       : Date  	            @title: '비활성일자' ;
        inactive_reason                     : String(1000)  	    @title: '비활성사유' ;
        bp_status_code                      : String(30)  	        @title: '상태코드' ;
        bp_status_name                      : String(50)  	        @title: '상태명' ;
        tel_number                          : String(50)  	        @title: '전화번호' ;
        extens_number                       : String(15)  	        @title: '내선번호' ;
        mobile_phone_number                 : String(15)  	        @title: '휴대폰번호' ;
        fax_number                          : String(50)  	        @title: '팩스번호' ;
        url_address                         : String(240)  	        @title: 'URL주소' ;
        email_address                       : String(240)  	        @title: '이메일주소' ;
        fmytr_code                          : String(30)  	        @title: 'FamilyTree코드' ;
        fmytr_name                          : String(50)  	        @title: 'FamilyTree명' ;
        credit_evaluation_interface_code    : String(100)  	        @title: '신용평가인터페이스번호' ;
}

extend Sm_Supplier_Mst with util.Managed;