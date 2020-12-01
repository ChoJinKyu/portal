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
  6. service : uomClassView
  7. service description : UOM 클래스 View
  8. history
  -. 2020.11.24 : 최미희 최초작성
*************************************************/
using { dp as uomClass } from '../../../../../db/cds/dp/materialMgr/uomMgr/DP_MM_UOM_CLASS-model';
using { dp as uomClassLng } from '../../../../../db/cds/dp/materialMgr/uomMgr/DP_MM_UOM_CLASS_LNG-model';
namespace dp;
@path : '/dp.UomClassMgrService'

service UomClassMgrService {
    view uomClassView(language_code: String) as
    select m.tenant_id
          ,m.uom_class_code
          ,ifnull(l.uom_class_name, m.uom_class_name) as uom_class_name
          ,ifnull(l.uom_class_desc, m.uom_class_desc) as uom_class_desc
          ,m.base_uom_code
          ,m.base_uom_name
          ,m.disable_date
    from  uomClass.Mm_Uom_Class  m
    left join uomClassLng.Mm_Uom_Class_Lng l
    on l.tenant_id = m.tenant_id
    and l.uom_class_code = m.uom_class_code
    and l.language_code = :language_code
    ;

}