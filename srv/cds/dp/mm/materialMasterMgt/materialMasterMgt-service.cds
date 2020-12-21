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
using { dp as Valuation } from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_VAL-model';

using { dp as Class } from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_CLASS-model';
using { dp as ClassLng } from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_CLASS_LNG-model';
using { dp as Commodity }    from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_COMMODITY-model';
using { dp as CommodityLng } from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_COMMODITY_LNG-model';
using { dp as mtlGroup }    from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_GROUP-model';
using { dp as mtlGroupLng } from  '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_GROUP_LNG-model';

using { cm as OperationOrg} from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';


namespace dp;
@path : '/dp.MaterialMasterMgtService'

service MaterialMasterMgtService {

    entity MaterialMst as projection on Master.Mm_Material_Mst;
    entity MaterialDesc as projection on Description.Mm_Material_Desc_Lng;
    entity MaterialOrg as projection on Organization.Mm_Material_Org;
    entity MaterialOrgAttr as projection on OrgAttribute.Mm_Material_Org_Attr;
    entity MaterialVal as projection on Valuation.Mm_Material_Val;

    // 자재기본
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
    and des.language_code = 'EN'
    ;

    view MaterialMstAllView as
    select key mst.tenant_id,
           key mst.material_code,
           ifnull(des.material_desc, mst.material_desc) as material_desc : String(300),
           mst.material_spec,
           mst.base_uom_code,
           mst.material_group_code,
           ifnull(grp.material_group_name, grpl.material_group_name) as material_group_name : String(100),
           mst.purchasing_uom_code,
           mst.variable_po_unit_indicator,
           mst.material_class_code,
           ifnull(clsl.material_class_name, cls.material_class_name) as material_class_name : String(100),
           mst.commodity_code,
           ifnull(coml.commodity_name, com.commodity_name) as commodity_name : String(100),
           mst.maker_part_number,
           mst.maker_code,
           mst.maker_part_profile_code,
           mst.maker_material_code,
           des.language_code
    from Master.Mm_Material_Mst  mst
    left outer join Description.Mm_Material_Desc_Lng des
    on des.tenant_id = mst.tenant_id
    and des.material_code = mst.material_code
    and des.language_code = 'EN'
    left outer join mtlGroup.Mm_Material_Group  grp 
    on grp.tenant_id = mst.tenant_id
    and grp.material_group_code = mst.material_group_code
    left outer join mtlGroup.Mm_Material_Group_Lng grpl 
    on grpl.tenant_id = grp.tenant_id
    and grpl.material_group_code = grp.material_group_code
    and grpl.language_code = 'EN'
    left outer join Class.Mm_Material_Class cls
    on cls.tenant_id = mst.tenant_id
    and cls.material_class_code = mst.material_class_code
    left outer join ClassLng.Mm_Material_Class_Lng  clsl
    on clsl.tenant_id = cls.tenant_id
    and clsl.material_class_code = cls.material_class_code
    and clsl.language_code = 'EN'
    left outer join Commodity.Mm_Material_Commodity com
    on com.tenant_id = mst.tenant_id
    and com.commodity_code = mst.commodity_code
    left outer join CommodityLng.Mm_Material_Commodity_Lng coml
    on coml.tenant_id = com.tenant_id
    and coml.commodity_code = com.commodity_code
    and coml.language_code = 'EN'

    ;

    // 자재조직
    view MaterialOrgView as
    select key org.tenant_id,
           key org.material_code,
           key org.company_code,
           key org.org_type_code,
           key org.org_code,
           porg.org_name,
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
    from Organization.Mm_Material_Org  org
    left join OrgAttribute.Mm_Material_Org_Attr oat
    on oat.tenant_id = org.tenant_id
    and oat.material_code = org.material_code
    and oat.company_code = org.company_code
    and oat.org_type_code = org.org_type_code
    and oat.org_code = org.org_code
    left join OperationOrg.Pur_Operation_Org porg 
    on porg.tenant_id = org.tenant_id
    and porg.org_type_code = org.org_type_code
    and porg.org_code = org.org_code     
    left join Master.Mm_Material_Mst  mst
    on mst.tenant_id = org.tenant_id
    and mst.maker_material_code = org.tenant_id
    left outer join Description.Mm_Material_Desc_Lng des
    on des.tenant_id = mst.tenant_id
    and des.material_code = mst.material_code
    and des.language_code = 'EN'
    ;

view MaterialOrgAllView as
    select key org.tenant_id,
           key org.material_code,
           key org.company_code,
           key org.org_type_code,
           key org.org_code,
           porg.org_name,
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
    from Organization.Mm_Material_Org  org
    left join OrgAttribute.Mm_Material_Org_Attr oat
    on oat.tenant_id = org.tenant_id
    and oat.material_code = org.material_code
    and oat.company_code = org.company_code
    and oat.org_type_code = org.org_type_code
    and oat.org_code = org.org_code
    left join OperationOrg.Pur_Operation_Org porg 
    on porg.tenant_id = org.tenant_id
    and porg.org_type_code = org.org_type_code
    and porg.org_code = org.org_code     
    left join Master.Mm_Material_Mst  mst
    on mst.tenant_id = org.tenant_id
    and mst.maker_material_code = org.tenant_id
    left outer join Description.Mm_Material_Desc_Lng des
    on des.tenant_id = mst.tenant_id
    and des.material_code = mst.material_code
    and des.language_code = 'EN'
    ;
    // 자재평가
    view MaterialValView as
    select key val.tenant_id,
           key val.material_code,
           key val.company_code,
           key val.org_type_code,
           key val.org_code,
           key val.valuation_area_code,
           key val.valuation_class_code,
           porg.org_name,
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
           val.valuation_type_code,
           val.material_price_unit,
           val.standard_price,
           val.moving_average_price
    from Valuation.Mm_Material_Val val
    left join Valuation.Mm_Material_Org org
    on org.tenant_id = val.tenant_id
    and org.material_code = val.material_code
    and org.company_code = val.company_code
    and org.org_type_code = val.org_type_code
    and org.org_code = val.org_code    
    left join OperationOrg.Pur_Operation_Org porg 
    on porg.tenant_id = org.tenant_id
    and porg.org_type_code = org.org_type_code
    and porg.org_code = org.org_code 
    left join Master.Mm_Material_Mst  mst
    on mst.tenant_id = val.tenant_id
    and mst.material_code = val.material_code
    left outer join Description.Mm_Material_Desc_Lng des
    on des.tenant_id = mst.tenant_id
    and des.material_code = mst.material_code
    and des.language_code = 'EN'
    ;

    view MaterialValAllView as
    select key val.tenant_id,
           key val.material_code,
           key val.company_code,
           key val.org_type_code,
           key val.org_code,
           key val.valuation_area_code,
           key val.valuation_class_code,
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
           val.valuation_type_code,
           val.material_price_unit,
           val.standard_price,
           val.moving_average_price
    from Valuation.Mm_Material_Val val
    left join Valuation.Mm_Material_Org org
    on org.tenant_id = val.tenant_id
    and org.material_code = val.material_code
    and org.company_code = val.company_code
    and org.org_type_code = val.org_type_code
    and org.org_code = val.org_code    
    left join Master.Mm_Material_Mst  mst
    on mst.tenant_id = val.tenant_id
    and mst.material_code = val.material_code
    left outer join Description.Mm_Material_Desc_Lng des
    on des.tenant_id = mst.tenant_id
    and des.material_code = mst.material_code
    and des.language_code = 'EN'
    ;
}
