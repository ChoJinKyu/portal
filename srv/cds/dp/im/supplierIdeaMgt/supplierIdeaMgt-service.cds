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
  6. service : supplierMgt
  7. service description : 공급업체 Idea 관리
  8. history
  -. 2020.12.30 : 최미희 최초작성
*************************************************/

using { dp as Idea } from '../../../../../db/cds/dp/im/DP_IM_SUPPLIER_IDEA-model';
using { dp as Performance } from '../../../../../db/cds/dp/im/DP_IM_SUPPLIER_IDEA_PERFORMANCE-model';


namespace dp;
@path : '/dp.SupplierIdeaMgtService'

service SupplierIdeaMgtService {

    entity SupplierIdea as projection on Idea.Im_Supplier_Idea;
    entity SupplierPerform as projection on Performance.Im_Supplier_Idea_Performance;
 
    @readonly
    view SupplierIdeaListView as
        select key isi.tenant_id,
               key isi.company_code,
               key isi.idea_number,
               isi.idea_title,
               isi.idea_progress_status_code,
               isi.supplier_code,
               isi.idea_create_user_id,
               isi.bizunit_code,
               isi.idea_product_group_code,
               isi.idea_type_code,
               isi.idea_period,
               isi.idea_manager_empno,
               isi.idea_part_desc,
               isi.current_proposal_contents,
               isi.change_proposal_contents,
               isi.idea_contents,
               isi.attch_group_number
        from Idea.Im_Supplier_Idea   isi 
    ;   
  
    
}
