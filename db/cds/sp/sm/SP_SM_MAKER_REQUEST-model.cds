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
  6. entity : Sm_Maker_Request
  7. entity description : Maker 요청 관리
  8. history
  -. 2021.01.26 : 정병훈 최초작성
*************************************************/
namespace sp;	
using util from '../../cm/util/util-model';  	
// using {sp as makerRequest} from '../sup/SP_SM_MAKER_REQUEST-model';	
	
entity Sm_Maker_Request {	
  key   tenant_id                   : String(5)  not null   @title: '테넌트ID' ;	
  key   maker_request_sequence      : Integer64  not null   @title: '제조사요청순번' ;	
        maker_request_type_code     : String(30)            @title: '제조사요청타입코드' ;	
        maker_progress_status_code  : String(30)            @title: '제조사진행상태코드' ;	
        tax_id                      : String(30)            @title: '세금등록번호' ;	
        supplier_code               : String(10)            @title: '공급업체 코드' ;	
        supplier_local_name         : String(240)           @title: '공급업체 로컬명' ;	
        supplier_english_name       : String(240)           @title: '공급업체 영문명' ;	
        country_code                : String(2)             @title: '국가코드' ;	
        country_name                : String(30)            @title: '국가명' ;	
        vat_number                  : String(30)            @title: 'VAT등록번호' ;	
        zip_code                    : String(20)            @title: '우편번호' ;	
        local_address_1             : String(240)           @title: '로컬주소1' ;	
        local_address_2             : String(240)           @title: '로컬주소2' ;	
        local_address_3             : String(240)           @title: '로컬주소3' ;	
        local_full_address          : String(1000)          @title: '로컬 전체주소' ;	
        english_address_1           : String(240)           @title: '영문주소1' ;	
        english_address_2           : String(240)           @title: '영문주소2' ;	
        english_address_3           : String(240)           @title: '영문주소3' ;	
        english_full_address        : String(1000)          @title: '영문 전체주소' ;	
        affiliate_code              : String(10)            @title: '관계사코드' ;	
        affiliate_code_name         : String(50)            @title: '관계사코드명' ;	
        company_class_code          : String(30)            @title: '회사분류코드' ;	
        company_class_name          : String(50)            @title: '회사분류명' ;	
        repre_name                  : String(30)            @title: '대표자명' ;	
        tel_number                  : String(50)            @title: '전화번호' ;	
        email_address               : String(240)           @title: '이메일주소' ;	
        supplier_status_code        : String(30)            @title: 'Maker 상태코드' ;	
        supplier_status_name        : String(50)            @title: 'Maker 상태명' ;	
        biz_certi_attch_number      : String(100)           @title: '사업자등록증첨부파일번호' ;	
        attch_number_2              : String(100)           @title: '첨부파일번호2' ;	
        attch_number_3              : String(100)           @title: '첨부파일번호3' ;	

}	
extend Sm_Maker_Request with util.Managed;	
