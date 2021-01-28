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
  6. service : uomClass
  7. service description : UOM 클래스 서비스
  8. history
  -. 2020.11.24 : 최미희 최초작성
*************************************************/
using { dp as Class } from '../../../../../db/cds/dp/mm/DP_MM_UOM_CLASS-model';
using { dp as ClassLng } from '../../../../../db/cds/dp/mm/DP_MM_UOM_CLASS_LNG-model';
namespace dp;
@path : '/dp.UomClassMgtService'

service UomClassMgtService {

    entity UomClass as projection on Class.Mm_Uom_Class;
    entity UomClassLng as projection on ClassLng.Mm_Uom_Class_Lng;

    view UomClassView as
    select Key m.tenant_id,
           Key m.uom_class_code,
           ifnull((select l.uom_class_name
                  from UomClassLng l
                  where l.tenant_id = m.tenant_id
                  and l.uom_class_name = m.uom_class_name
                  and l.language_code = 'KO') , m.uom_class_name) as uom_class_name : String(20),
           m.uom_class_desc,
           m.base_uom_code,
           m.base_uom_name,
           m.disable_date
    from  UomClass m
    ;

}
