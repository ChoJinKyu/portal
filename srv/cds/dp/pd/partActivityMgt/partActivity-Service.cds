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
  6. service : sourcingSupplierMgt
  7. service description : Sourcing Supplier 서비스
  8. history
  -. 2020.12.29 : 최초작성
*************************************************/

using { dp as OperationOrg } from '../../../../../db/cds/dp/pd/DP_PD_OPERATION_ORG_VIEW-model';
using { dp as PartActivityTemplateView } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE_VIEW-model';
using { dp as partActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';
using { dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';

namespace dp;
@path : '/dp.partActivityService'

service PartActivityService {
    entity PdOperationOrg as projection on OperationOrg.Pd_Operation_Org_View;
    entity pdPartactivityTemplateView as projection on PartActivityTemplateView.Pd_Part_Activity_Template_View ;
    entity PdPartActivityTemplate as projection on partActivityTemplate.Pd_Part_Activity_Template;
    entity pdActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
}