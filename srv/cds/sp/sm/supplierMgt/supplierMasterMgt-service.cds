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
  6. service : supplierMasterMgtService
  7. service description : supplierMasterMgtService 서비스
  8. history
  -. 2021.01.21 : 정병훈 최초작성
*************************************************/
using { sp as supplierAttrCtrl } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_ATTR_CTRL-model.cds';
using { sp as supplierMaster } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model.cds';
using { sp as supplierOrg } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_ORG-model.cds';
using { sp as supplierRole } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_ROLE-model.cds';
using { sp as makerRequest } from '../../../../../db/cds/sp/sm/SP_SM_MAKER_REQUEST-model.cds';


namespace sp; 
@path : '/sp.supplierMasterMgtService'

service supplierMasterMgtService {

   entity supplierAttrCtrl  as projection on sp.Sm_Supplier_Attr_Ctrl;
   entity supplierMaster    as projection on sp.Sm_Supplier_Mst;  
   entity supplierOrg       as projection on sp.Sm_Supplier_Org;
   entity supplierRole      as projection on sp.Sm_Supplier_Role;
   entity makerRequest      as projection on sp.Sm_Maker_Request;
   
}

