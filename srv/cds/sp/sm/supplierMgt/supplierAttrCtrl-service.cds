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
  
  5. namespace : db
  6. service : supplierAttrCtrl
  7. service description : supplierAttrCtrl 서비스
  8. history
  -. 2021.01.21 : 정병훈 최초작성
*************************************************/
using { sp as supplierAttrCtrl } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_ATTR_CTRL-model.cds';
namespace sp; 
@path : '/sp.supplierAttrCtrlService'

service supplierAttrCtrlService {

    entity supplierAttrCtrl as projection on sp.Sm_Supplier_Attr_Ctrl;

}