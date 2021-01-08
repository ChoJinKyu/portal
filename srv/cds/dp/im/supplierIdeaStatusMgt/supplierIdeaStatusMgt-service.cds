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
  6. service : SupplierIdeaStatusMgt
  7. service description : 공급업체 Idea 진행상태 관리
  8. history
  -. 2021.01.07 : 최미희 최초작성
*************************************************/
// 협력사제안관리
using { dp as Status } from '../../../../../db/cds/dp/im/DP_IM_SUPPLIER_IDEA_STATUS-model';

// 공통코드
using { cm as Code } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';

// User
using { cm as User }          from '../../../../../db/cds/cm/CM_USER-model';

namespace dp;
@path : '/dp.SupplierIdeaStatusMgtService'

service SupplierIdeaStatusMgtService {

    entity IdeaStatus as projection on Status.Im_Supplier_Idea_Status;

    @readonly
    view IdeaStatusView as
    select  key sis.tenant_id,
            key sis.company_code,
            key sis.idea_number,
            key sis.status_change_sequence,
            sis.idea_progress_status_code,
            cd.code_name as idea_progress_status_name: String(240),
            sis.status_change_user_id,
            usr.user_name as status_change_user_name: String(240),
            sis.status_change_date_time,
            sis.status_change_comment
    from Status.Im_Supplier_Idea_Status sis 
    left join Code.Code_View cd
    on cd.tenant_id = sis.tenant_id
    and cd.group_code = 'DP_IM_IDEA_PROGRESS_STATUS'
    and cd.code = sis.idea_progress_status_code
    and cd.language_cd = 'KO'
    left join User.User usr 
    on usr.tenant_id = sis.tenant_id
    and usr.user_id = sis.status_change_user_id
    ;

}