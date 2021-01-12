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
  6. entity : It_Mst_Mrp_Manager
  7. entity description : MRP관리자 마스터 업무용 (SAC)
  8. history
  -. 2020.12.23 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Mst_Mrp_Manager {
    key tenant_id              : String(5) not null  @title : '테넌트ID';
    key plant_code             : String(4) not null  @title : '플랜트코드';
    key mrp_manager_code       : String(30) not null @title : 'MRP관리자코드';
        mrp_manager_name       : String(30)          @title : 'MRP관리자명';
        mrp_manager_tel_number : String(30)          @title : 'MRP관리자전화번호';
        purchasing_group_code  : String(3)           @title : '구매그룹코드';
        receiver_name          : String(30)          @title : '수신자명';
        business_area_code     : String(30)          @title : '사업영역코드';
        prctr_code             : String(15)          @title : '손익센터코드';
}

extend It_Mst_Mrp_Manager with util.Managed;