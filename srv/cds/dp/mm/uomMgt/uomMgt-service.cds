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

}
