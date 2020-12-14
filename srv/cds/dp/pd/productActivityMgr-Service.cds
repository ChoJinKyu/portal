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
  6. service : productActivity
  7. service description : 제품 Activity 서비스
  8. history
  -. 2020.12.14 : 박근록 최초작성
*************************************************/
using { dp as ProductActivity } from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE-model';

namespace dp;
@path : '/dp.ProductActivityMgrService'

service ProductActivityMgrService {

    entity ProductActivity as projection on ProductActivity.Pd_Product_Activity_Template;

}
