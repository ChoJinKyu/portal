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
  6. service : MtlClassMgt
  7. service description : UOM 서비스
  8. history
  -. 2020.12.11 : 최미희 최초작성
*************************************************/
using { dp as Class } from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_CLASS-model';
using { dp as ClassLng } from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_CLASS_LNG-model';
namespace dp;
@path : '/dp.MtlClassMgtService'

service MtlClassMgtService {

    entity MtlClass as projection on Class.Mm_Material_Class;
    entity MtlClassLng as projection on ClassLng.Mm_Material_Class_Lng;

    view MtlClassView as
    select key m.tenant_id,
           key m.material_class_code,
           ifnull(l.material_class_name, m.material_class_name) as material_class_name : String(100),
           ifnull(l.material_class_desc, m.material_class_desc) as material_class_desc : String(1000),
           m.use_flag,
           l.language_code
    from  Class.Mm_Material_Class m
    left outer join ClassLng.Mm_Material_Class_Lng l
    on l.tenant_id = m.tenant_id
      and l.material_class_code = m.material_class_code
      and l.language_code = 'EN'
    ;

}
