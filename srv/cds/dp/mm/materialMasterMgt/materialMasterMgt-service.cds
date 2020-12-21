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
  6. service : materialMasterMgt
  7. service description : 자재마스터관리 서비스
  8. history
  -. 2020.12.21 : 최미희 최초작성
*************************************************/
using { dp as Master } from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';
using { dp as Description } from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_DESC_LNG-model';
using { dp as Organization } from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_ORG-model';
using { dp as OrgAttribute } from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_ORG_ATTR-model';
// using { dp as Accounting } from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_VAL-model';


namespace dp;
@path : '/dp.MaterialMasterMgtService'

service MaterialMasterMgtService {

    entity MaterialMst as projection on Master.Mm_Material_Mst;
    entity MaterialDesc as projection on Description.Mm_Material_Desc_Lng;
    entity MaterialOrg as projection on Organization.Mm_Material_Org;
    entity MaterialOrgAttr as projection on OrgAttribute.Mm_Material_Org_Attr;


    view MaterialMstView as
    select key mst.tenant_id,
           key mst.material_code,
           ifnull(des.material_desc, mst.material_desc) as material_desc : String(300),
           mst.material_spec,
           mst.base_uom_code,
           mst.material_group_code,
           mst.purchasing_uom_code,
           mst.variable_po_unit_indicator,
           mst.material_class_code,
           mst.commodity_code,
           mst.maker_part_number,
           mst.maker_code,
           mst.maker_part_profile_code,
           mst.maker_material_code,
           des.language_code
    from Master.Mm_Material_Mst  mst
    left outer join Description.Mm_Material_Desc_Lng des
    on des.tenant_id = mst.tenant_id
    and des.material_code = mst.material_code
    ;

    view MaterialOrgView as
    select key org.tenant_id,
           key org.material_code,
           key org.company_code,
           key org.org_type_code,
           key org.org_code,
           ifnull(des.material_desc, mst.material_desc) as material_desc : String(300),
           mst.material_spec,
           mst.base_uom_code,
           mst.material_group_code,
           mst.purchasing_uom_code,
           mst.variable_po_unit_indicator,
           mst.material_class_code,
           mst.commodity_code,
           mst.maker_part_number,
           mst.maker_code,
           mst.maker_part_profile_code,
           mst.maker_material_code,
           des.language_code,
           org.material_status_code,
           org.purchasing_group_code,
           org.batch_management_flag,
           org.automatic_po_allow_flag,
           org.hs_code,
           org.import_group_code,
           org.user_item_type_code,
           org.purchasing_item_flag,
           org.purchasing_enable_flag,
           org.osp_item_flag,
           org.buyer_empno,
           org.eng_item_flag,
           oat.develope_person_empno,
           oat.charged_osp_item_flag
    from Master.Mm_Material_Mst  mst
    left outer join Description.Mm_Material_Desc_Lng des
    on des.tenant_id = mst.tenant_id
    and des.material_code = mst.material_code
    left join Organization.Mm_Material_Org org
    on org.tenant_id = mst.tenant_id
    and org.material_code = mst.material_code
    left join OrgAttribute.Mm_Material_Org_Attr oat
    on oat.tenant_id = org.tenant_id
    and oat.material_code = org.material_code
    and oat.company_code = org.company_code
    and oat.org_type_code = org.org_type_code
    and oat.org_code = org.org_code
    ;

}
