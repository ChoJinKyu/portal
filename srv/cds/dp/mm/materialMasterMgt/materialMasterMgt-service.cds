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


using { dp.MtlClassMgtService as MtlClass } from '../../mm/basicDataMgt/mtlClassMgt-service';
using { dp.MtlCommodityMgtService as MtlCommodity } from '../../mm/basicDataMgt/mtlCommodityMgt-service';
using { dp.MtlGroupMgtService as MtlGroup } from '../../mm/basicDataMgt/mtlGroupMgt-service';

// Global Sourcing Supplier
using { dp as Supplier } from '../../../../../db/cds/dp/gs/DP_GS_SUPPLIER_GEN-model';
// HR Employee
using { cm as Employee } from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
// 공통코드
using { cm as Code } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';

// 조직코드
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
    @readonly
    view MaterialMstView as
    select  key m.tenant_id,
            key m.material_code,
            ifnull((select l.material_desc 
             from MaterialDesc l
             where l.tenant_id = m.tenant_id
             and l.material_code = m.material_code
             and l.language_code = 'KO' ), m.material_desc) as material_desc: String(300),
            m.material_spec,
            m.material_type_code,
            m.base_uom_code,
            m.material_group_code,
            m.purchasing_uom_code,
            m.variable_po_unit_indicator,
            m.material_class_code,
            m.commodity_code,
            m.maker_part_number,
            m.maker_code,
            m.maker_part_profile_code,
            m.maker_material_code
    from MaterialMst m
    ;

    @readonly
    view MaterialMstAllView as
    select key mst.tenant_id,
           key mst.material_code,
           mst.material_desc,
           mst.material_spec,
           mst.material_type_code,
           cd1.code_name  as material_type_name : String(240),
           mst.base_uom_code,
           mst.material_group_code,
           grp.material_group_name,
           mst.purchasing_uom_code,
           mst.variable_po_unit_indicator,
           cd2.code_name as variable_po_unit_indic_name : String(240),
           mst.material_class_code,
           cls.material_class_name,
           mst.commodity_code,
           com.commodity_name,
           mst.maker_part_number,
           mst.maker_code,
           mst.maker_part_profile_code,
           mst.maker_material_code
    from MaterialMstView mst
    left join MtlClass.MtlClassView cls
    on cls.tenant_id = mst.tenant_id
    and cls.material_class_code = mst.material_class_code
    left outer join MtlGroup.MtlGroupView grp
    on grp.tenant_id = mst.tenant_id
    and grp.material_group_code = mst.material_group_code
    left join MtlCommodity.MtlCommodityView com
    on com.tenant_id = mst.tenant_id
    and com.commodity_code = mst.commodity_code
    left join Code.Code_View cd1
    on cd1.tenant_id = mst.tenant_id
    and cd1.group_code = 'DP_MM_MATERIAL_TYPE'
    and cd1.code = mst.material_type_code
    and cd1.language_cd = 'KO'
    left join Code.Code_View cd2
    on cd1.tenant_id = mst.tenant_id
    and cd1.group_code = 'DP_MM_VAR_PO_UNIT_INDICATOR'
    and cd1.code = mst.variable_po_unit_indicator
    and cd1.language_cd = 'KO'
    ;

    // 자재조직 View
    @readonly
    view MaterialOrgView as 
    select key org.tenant_id,
           key org.material_code,
           key org.company_code,
           key org.org_type_code,
           key org.org_code,
           poo.org_name,
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
    left join OperationOrg.Pur_Operation_Org poo 
    on poo.tenant_id = org.tenant_id
    and poo.company_code = org.company_code
    and poo.org_type_code = org.org_type_code
    and poo.org_code = org.org_code 
    ;

    view MaterialOrgAllView as
    select key org.tenant_id,
           key org.material_code,
           key org.company_code,
           key org.org_type_code,
           key org.org_code,
           org.org_name,
           mst.material_desc,
           mst.material_spec,
           mst.material_type_code,
           mst.material_type_name,
           mst.base_uom_code,
           mst.material_group_code,
           mst.material_group_name,
           mst.purchasing_uom_code,
           mst.variable_po_unit_indicator,
           mst.variable_po_unit_indic_name,
           mst.material_class_code,
           mst.material_class_name,
           mst.commodity_code,
           mst.commodity_name,
           mst.maker_part_number,
           mst.maker_code,
           mst.maker_part_profile_code,
           mst.maker_material_code,
           org.material_status_code,
           cd1.code_name as material_status_name : String(240),
           org.purchasing_group_code,
           org.batch_management_flag,
           org.automatic_po_allow_flag,
           org.hs_code,
           org.import_group_code,
           cd2.code as import_group_name : String(240),
           org.user_item_type_code,
           cd3.code_name as user_item_type_name : String(240),
           org.purchasing_item_flag,
           org.purchasing_enable_flag,
           org.osp_item_flag,
           org.buyer_empno,
           hr1.user_local_name as buyer_local_name : String(240),
           org.eng_item_flag,
           org.develope_person_empno,
           hr2.user_local_name as develope_person_local_name : String(240),
           org.charged_osp_item_flag
    from MaterialOrgView  org
    left join MaterialMstAllView mst
    on mst.tenant_id = org.tenant_id
    and mst.material_code = org.material_code
    left join Code.Code_View cd1
    on cd1.tenant_id = org.tenant_id
    and cd1.group_code = 'DP_MM_MATERIAL_STATUS'
    and cd1.code = org.material_status_code
    and cd1.language_cd = 'KO'
    left join Code.Code_View cd2
    on cd1.tenant_id = org.tenant_id
    and cd1.group_code = 'DP_MM_IMPORT_GROUP_CODE'
    and cd1.code = org.import_group_code
    and cd1.language_cd = 'KO'
    left join Code.Code_View cd3
    on cd1.tenant_id = org.tenant_id
    and cd1.group_code = 'DP_MM_USER_ITEM_TYPE'
    and cd1.code = org.user_item_type_code
    and cd1.language_cd = 'KO'
    left join Employee.Hr_Employee hr1
    on hr1.tenant_id = org.tenant_id
    and hr1.employee_number = org.buyer_empno
    left join Employee.Hr_Employee hr2
    on hr1.tenant_id = org.tenant_id
    and hr1.employee_number = org.develope_person_empno
    ;

    
    // 자재평가
    @readonly
    view MaterialValView as
    select key val.tenant_id,
           key val.material_code,
           key val.company_code,
           key val.org_type_code,
           key val.org_code,
           key val.valuation_area_code,
           key val.valuation_class_code,
           porg.org_name,
           val.valuation_type_code,
           val.material_price_unit,
           val.standard_price,
           val.moving_average_price
    from Valuation.Mm_Material_Val val  
    left join OperationOrg.Pur_Operation_Org porg 
    on porg.tenant_id = val.tenant_id
    and porg.org_type_code = val.org_type_code
    and porg.org_code = val.org_code 
    ;

    @readonly
    view MaterialValAllView as
    select key val.tenant_id,
           key val.material_code,
           key val.company_code,
           key val.org_type_code,
           key val.org_code,
           key val.valuation_area_code,
           key val.valuation_class_code,
           mst.material_desc,
           cd1.code_name as valuation_area_name : String(240),
           cd2.code_name as valuation_class_name : String(240),
           val.valuation_type_code,
           cd3.code_name as valuation_type_name : String(240),
           val.material_price_unit,
           val.standard_price,
           val.moving_average_price
    from MaterialValView val
    left join MaterialMstView mst
    on mst.tenant_id = val.tenant_id
    and mst.material_code = val.material_code
    left join Code.Code_View cd1 
    on cd1.tenant_id = val.tenant_id
    and cd1.group_code = 'DP_MM_MTL_VALUATION_AREA'
    and cd1.code = val.valuation_area_code
    and cd1.language_cd = 'KO'
    left join Code.Code_View cd2
    on cd1.tenant_id = val.tenant_id
    and cd2.group_code = 'DP_MM_MTL_VALUATION_CLASS'
    and cd2.code = val.valuation_class_code
    and cd2.language_cd = 'KO'
    left join Code.Code_View cd3
    on cd1.tenant_id = val.tenant_id
    and cd2.group_code = 'DP_MM_MTL_VALUATION_TYPE'
    and cd2.code = val.valuation_type_code
    and cd2.language_cd = 'KO'
    ;


}
