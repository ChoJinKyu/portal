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
  6. service : HsCodeMgt
  7. service description : UOM 서비스
  8. history
  -. 2020.12.11 : 최미희 최초작성
  -. 2021.01.23 : 최미희 HS Code 언어 추가
*************************************************/
using { dp as Hs } from '../../../../../db/cds/dp/mm/DP_MM_HS_CODE-model';
using { dp as HsLng } from '../../../../../db/cds/dp/mm/DP_MM_HS_CODE_LNG-model';

namespace dp;
@path : '/dp.HsCodeMgtService'

service HsCodeMgtService {

    entity HsCode as projection on Hs.Mm_Hs_Code;
    entity HsCodeLng as projection on HsLng.Mm_Hs_Code_Lng;

}