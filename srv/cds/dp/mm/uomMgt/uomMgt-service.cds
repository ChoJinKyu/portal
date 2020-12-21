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
  7. service description : UOM 서비스
  8. history
  -. 2020.11.24 : 최미희 최초작성
*************************************************/

using { dp as uom } from '../../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE-model';
using { dp as uomLng } from '../../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE_LNG-model';
namespace dp;
@path : '/dp.UomMgtService'

service UomMgtService {

    entity Uom as projection on uom.Mm_Unit_Of_Measure;
    entity UomLng as projection on uomLng.Mm_Unit_Of_Measure_Lng;

    view UomView as
    select key u.tenant_id,
           key u.uom_code,
           ifnull(l.uom_name, u.uom_name) as uom_name : String(30),
           u.uom_class_code,
           u.base_unit_flag,
           u.uom_desc,
           u.decimal_places,
           u.floating_decpoint_index,
           u.conversion_numerator,
           u.conversion_denominator,
           u.conversion_index,
           u.conversion_rate,
           u.conversion_addition_constant,
           u.decplaces_rounding,
           u.family_unit_flag,
           u.uom_iso_code,
           u.uom_iso_primary_code_flag,
           u.commercial_unit_flag,
           u.value_base_commitment_flag,
           u.disable_date,
           l.language_code
    from  uom.Mm_Unit_Of_Measure  u
    left outer join uomLng.Mm_Unit_Of_Measure_Lng l
    on l.tenant_id = u.tenant_id
      and l.uom_code = u.uom_code
    ;

}
