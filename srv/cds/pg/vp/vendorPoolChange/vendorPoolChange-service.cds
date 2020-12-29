/************************************************
  ---------Service정의 Rule  ------------------
  1. namespace
    - 모듈코드 소문자로 작성
    - 소모듈 존재시 대모듈.소모듈 로 작성
  2. 선언부(Using)
    - as 이후는 Naming은 소문자로 시작
  3. entity
    - 대문자로 시작(as 이후는 Naming을 그대로 쓰되 대문자로 시작)
  4. 서비스에서 정의하는 View는 첫글자는 대문자로 시작하고 끝은 View를 붙인다  
  5. 컬럼(속성)
    - 소문자로 작성
   *  화면 및 서비스 확인을 위한 wap서버 올릴때 명령어 ==>  mvn spring-boot:run
   
  --------- 현 Service 설명 -------------------
  1. service       : VpChangeService
  2. description   : Vendor Pool 변경 List(Supplier변경) 
  3. history
    -. 2020.12.28 : 구본흥 최초작성
*************************************************/
using { pg.Vp_Vendor_Pool_supplier_Change_List_View as vpChangeList } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_CHANGE_LIST_VIEW-model';

namespace pg; 
@path : '/pg.vendorPoolChangeService'
service VpChangeService {

    entity VpChangeList as projection on vpChangeList;

    view VpEmpView as
    select distinct key changer_empno,  
                        write_by    changer_name 
    from vpChangeList; 
}