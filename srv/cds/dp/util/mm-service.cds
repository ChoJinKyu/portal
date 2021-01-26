/*
using { dp.Mm_Unit_Of_Measure as UnitOfMeasure, dp.Mm_Unit_Of_Measure_Lng as UomLng } from '../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE_LNG-model';
using { dp as Hs_Code } from '../../../../db/cds/dp/mm/DP_MM_HS_CODE-model';
using { dp.Mm_Material_Class as Class, dp.Mm_Material_Class_Lng as ClassLng } from  '../../../../db/cds/dp/mm/DP_MM_MATERIAL_CLASS_LNG-model';
using { dp.Mm_Material_Commodity as Commodity, dp.Mm_Material_Commodity_Lng as CommodityLng } from  '../../../../db/cds/dp/mm/DP_MM_MATERIAL_COMMODITY_LNG-model';
using { dp.Mm_Material_Group as MtlGroup, dp.Mm_Material_Group_Lng as MtlGroupLng } from  '../../../../db/cds/dp/mm/DP_MM_MATERIAL_GROUP_LNG-model';
*/

using { dp.UomMgtService as uom } from '../mm/uomMgt/uomMgt-service';
using { dp.HsCodeMgtService as Hs } from '../mm/basicDataMgt/hsCodeMgt-service';
using { dp.MtlClassMgtService as MtlClass } from '../mm/basicDataMgt/mtlClassMgt-service';
using { dp.MtlCommodityMgtService as Commodity } from '../mm/basicDataMgt/mtlCommodityMgt-service';
using { dp.MtlGroupMgtService as MtlGroup } from '../mm/basicDataMgt/mtlGroupMgt-service';
using { dp.MaterialMasterMgtService as Material } from '../mm/materialMasterMgt/materialMasterMgt-service';
using { dp as Favorites } from '../../../../db/cds/dp/mm/DP_MM_MTL_USER_FAVORITES-model';

namespace dp.util;

@path : '/dp.util.MmService'
service MmService {

    @readonly
    view Uom as
    select  key m.tenant_id,
            key m.uom_code,
            ifnull((select l.uom_name
             from uom.UomLng l 
             where l.tenant_id = m.tenant_id
             and l.uom_code = m.uom_code
             and l.language_code = 'KO' ), m.uom_name)  as uom_name : String(30)
    from  uom.Uom as m
    ;

    @readonly
    view HsCode as
    select  key m.tenant_id,
            key m.country_code,
            key m.hs_code,
            ifnull((select l.hs_text
             from  Hs.HsCodeLng l
             where l.tenant_id = m.tenant_id
             and l.country_code = m.country_code
             and l.hs_code = m.hs_code
             and l.language_code = 'KO'
            ), m.hs_text)   as hs_text : String(500)
    from Hs.HsCode as m
    where m.use_flag = true
    ;
    
    @readonly
    view MaterialClass as
    select  key m.tenant_id,
            key m.material_class_code, 
            ifnull((select l.material_class_name
                    from MtlClass.MtlClassLng l
                    where l.tenant_id = m.tenant_id
                    and l.material_class_code = m.material_class_code
                    and l.language_code = 'KO'
            ), m.material_class_name) as material_class_name : String(100),
            m.material_class_desc,
            m.use_flag
    from MtlClass.MtlClass as m
    where m.use_flag = true
    ;

    @readonly
    view MaterialCommodity as 
    select  key m.tenant_id,
            key m.commodity_code,
            ifnull((select l.commodity_name
             from Commodity.MtlCommodityLng l
             where l.tenant_id = m.tenant_id
             and l.commodity_code = m.commodity_code
             and l.language_code = 'KO'), m.commodity_name) as commodity_name : String(100),
            m.commodity_desc,
            m.use_flag
    from Commodity.MtlCommodity as m 
    where m.use_flag = true
    ;
    @readonly
    view MaterialGroup as 
    select  key m.tenant_id,
            key m.material_group_code,
            ifnull((select l.material_group_name
             from MtlGroup.MtlGroupLng l
             where l.tenant_id = m.tenant_id
             and l.material_group_code = m.material_group_code
             and l.language_code = 'KO' ), m.material_group_name) as material_group_name : String(100),
            m.material_group_desc,
            m.use_flag
    from MtlGroup.MtlGroup as m 
    where m.use_flag = true
    ;

   // 자재코드 검색 View
    @readonly
    view SearchMaterialMstView as
    select key mst.tenant_id,
           key mst.material_code,
           case when fav.material_code is not null then true else false end as favofites_flag : Boolean,
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
           mst.maker_material_code
    from Material.MaterialMstAllView mst
    left join Favorites.Mm_Mtl_User_Favorites fav
    on fav.tenant_id = mst.tenant_id
    and fav.material_code = mst.material_code
    and fav.user_id = 'A'
    ;

    @readonly
    view SearchMaterialOrgView as
    select key org.tenant_id,
           key org.material_code,
           key org.company_code,
           key org.org_type_code,
           key org.org_code,
           org.org_name,
           org.material_desc,
           org.material_spec,
           org.material_type_code,
           org.material_type_name,
           org.base_uom_code,
           org.material_group_code,
           org.material_group_name,
           org.purchasing_uom_code,
           org.variable_po_unit_indicator,
           org.variable_po_unit_indic_name,
           org.material_class_code,
           org.material_class_name,
           org.commodity_code,
           org.commodity_name,
           org.maker_part_number,
           org.maker_code,
           org.maker_part_profile_code,
           org.maker_material_code,
           org.material_status_code,
           org.material_status_name,
           org.purchasing_group_code,
           org.batch_management_flag,
           org.automatic_po_allow_flag,
           org.hs_code,
           org.import_group_code,
           org.import_group_name,
           org.user_item_type_code,
           org.user_item_type_name,
           org.purchasing_item_flag,
           org.purchasing_enable_flag,
           org.osp_item_flag,
           org.buyer_empno,
           org.buyer_local_name,
           org.eng_item_flag,
           org.develope_person_empno,
           org.develope_person_local_name,
           org.charged_osp_item_flag
    from Material.MaterialOrgAllView org
    left join Favorites.Mm_Mtl_User_Favorites fav
    on fav.tenant_id = org.tenant_id
    and fav.material_code = org.material_code
    and fav.user_id = 'A'
    ;

}
