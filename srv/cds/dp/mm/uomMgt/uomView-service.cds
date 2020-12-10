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
  6. service : uomView
  7. service description : UOM View
  8. history
  -. 2020.11.26 : 최미희 최초작성
*************************************************/
using { dp as uom }    from '../../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE-model';
using { dp as uomLng } from '../../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE_LNG-model';
namespace dp;
@path : '/dp.UomMgtService'

service UomMgtService {
    view UomView(language_code: String) as
    select u.tenant_id
          ,u.uom_code
          ,ifnull(l.uom_name, u.uom_name)  as uom_name
          ,ifnull(l.commercial_uom_code, u.commercial_uom_code) as commercial_uom_code
          ,ifnull(l.commercial_uom_name, u.commercial_uom_name) as commercial_uom_name
          ,ifnull(l.technical_uom_code, u.technical_uom_code) as technical_uom_code
          ,ifnull(l.technical_uom_name, u.technical_uom_name) as technical_uom_name
          ,u.uom_class_code
          ,u.base_unit_flag
          ,u.uom_desc
          ,u.decimal_places
          ,u.floating_decpoint_index
          ,u.conversion_numerator
          ,u.conversion_denominator
          ,u.conversion_index
          ,u.conversion_rate
          ,u.conversion_addition_constant
          ,u.decplaces_rounding
          ,u.family_unit_flag
          ,u.uom_iso_code
          ,u.uom_iso_primary_code_flag
          ,u.commercial_unit_flag
          ,u.value_base_commitment_flag
          ,u.disable_date 
    from  uom.Mm_Unit_Of_Measure  u
    left join uomLng.Mm_Unit_Of_Measure_Lng l
    on l.tenant_id = u.tenant_id
      and l.uom_code = u.uom_code
      and l.language_code = :language_code
    ;

}