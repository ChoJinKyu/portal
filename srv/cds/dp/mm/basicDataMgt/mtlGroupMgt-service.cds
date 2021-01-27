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
  6. service : MtlGroupMgt
  7. service description : Material Group Service
  8. history
  -. 2020.12.11 : 최미희 최초작성
  -. 2021.01.22 : 최미희 자재그룹 View 추가
*************************************************/
using { dp as mtlGroup }    from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_GROUP-model';
using { dp as mtlGroupLng } from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_GROUP_LNG-model';
//using { dp as mtlGroupView } from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_GROUP_VIEW-model';

namespace dp;
@path : '/dp.MtlGroupMgtService'

service MtlGroupMgtService {

    entity MtlGroup as projection on mtlGroup.Mm_Material_Group;
    entity MtlGroupLng as projection on mtlGroupLng.Mm_Material_Group_Lng;
    //entity MtlGroupView as projection on mtlGroupView.Mm_Material_Group_View;

    view MtlGroupView as
    select key m.tenant_id,
           key m.material_group_code,
           ifnull((select l.material_group_name
                   from MtlGroupLng as l
                   where l.tenant_id = m.tenant_id
                   and l.material_group_code = m.material_group_code
                   and l.language_code = 'KO'), m.material_group_name) as material_group_name : String(100),
           m.material_group_desc,
           m.use_flag
    from MtlGroup as m
    ;


}