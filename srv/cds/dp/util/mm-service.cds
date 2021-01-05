
using { dp.Mm_Unit_Of_Measure as UnitOfMeasure, dp.Mm_Unit_Of_Measure_Lng as UomLng } from '../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE_LNG-model';
using { dp as Hs_Code } from '../../../../db/cds/dp/mm/DP_MM_HS_CODE-model';
using { dp.Mm_Material_Class as Class, dp.Mm_Material_Class_Lng as ClassLng } from  '../../../../db/cds/dp/mm/DP_MM_MATERIAL_CLASS_LNG-model';
using { dp.Mm_Material_Commodity as Commodity, dp.Mm_Material_Commodity_Lng as CommodityLng } from  '../../../../db/cds/dp/mm/DP_MM_MATERIAL_COMMODITY_LNG-model';
using { dp.Mm_Material_Group as MtlGroup, dp.Mm_Material_Group_Lng as MtlGroupLng } from  '../../../../db/cds/dp/mm/DP_MM_MATERIAL_GROUP_LNG-model';
using { dp as Material_Master } from '../mm/materialMasterMgt/materialMasterMgt-service';

namespace dp.util;

@path : '/dp.util.MmService'
service MmService {
    @readonly
    view Uom as
        select 
            key m.tenant_id,
            key m.uom_code,
            ifnull(l.uom_name, m.uom_name) as uom_name : String(30),
            l.language_code
        from  UnitOfMeasure as m
        left outer join UomLng as  l
        on l.tenant_id = m.tenant_id
        and l.uom_code = m.uom_code
        and l.language_code = 'KO'
    ;

    @readonly
    view HsCode as
        select 
            key m.tenant_id,
            key m.country_code,
            key m.hs_code,
            m.hs_text1 as hs_text
        from Hs_Code.Mm_Hs_Code as m
        where m.use_flag = true
    ;
    
    @readonly
    view MaterialClass as
        select 
            key m.tenant_id,
            key m.material_class_code, 
            ifnull(l.material_class_name, m.material_class_name) as material_class_name : String(100),
            ifnull(l.material_class_desc, m.material_class_desc) as material_class_desc : String(1000),
            m.use_flag,
            l.language_code
        from Class as m
        left outer join ClassLng as l 
        on l.tenant_id = m.tenant_id
        and l.material_class_code = m.material_class_code
        and l.language_code = 'KO'
        where m.use_flag = true
    ;

    @readonly
    view MaterialCommodity as 
        select
            key m.tenant_id,
            key m.commodity_code,
            ifnull(l.commodity_name, m.commodity_name) as commodity_name : String(100),
            ifnull(l.commodity_desc, m.commodity_desc) as commodity_desc : String(1000),
            m.use_flag,
            l.language_code
        from Commodity as m 
        left outer join CommodityLng as l 
        on l.tenant_id = m.tenant_id
        and l.commodity_code = m.commodity_code
        and l.language_code = 'KO'
        where m.use_flag = true
    ;
    @readonly
    view MaterialGroup as 
        select
            key m.tenant_id,
            key m.material_group_code,
            ifnull(l.material_group_name, m.material_group_name) as material_group_name : String(100),
            ifnull(l.material_group_desc, m.material_group_desc) as material_group_desc : String(1000),
            m.use_flag,
            l.language_code
        from MtlGroup as m 
        left outer join MtlGroupLng as l 
        on l.tenant_id = m.tenant_id
        and l.material_group_code = m.material_group_code
        and l.language_code = 'KO'
        where m.use_flag = true
    ;

// 자재코드 검색 View
/*
    @readonly
    view SearchMaterialMstView as
    select key mst.tenant_id,
           key mst.material_code,
           case when fav.material_code is not null then true else false end as favofites_flag : Boolean,
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
    from Material_Master.MaterialOrgAllView 
    left outer join Description.Mm_Material_Desc_Lng des
    on des.tenant_id = mst.tenant_id
    and des.material_code = mst.material_code
    and des.language_code = 'KO'
    left outer join Favorites.Mm_Mtl_User_Favorites fav
    on fav.tenant_id = mst.tenant_id
    and fav.material_code = mst.material_code
    left outer join mtlGroup.Mm_Material_Group  grp 
    on grp.tenant_id = mst.tenant_id
    and grp.material_group_code = mst.material_group_code
    left outer join mtlGroup.Mm_Material_Group_Lng grpl 
    on grpl.tenant_id = grp.tenant_id
    and grpl.material_group_code = grp.material_group_code
    and grpl.language_code = 'KO'
    left outer join Class.Mm_Material_Class cls
    on cls.tenant_id = mst.tenant_id
    and cls.material_class_code = mst.material_class_code
    left outer join ClassLng.Mm_Material_Class_Lng  clsl
    on clsl.tenant_id = cls.tenant_id
    and clsl.material_class_code = cls.material_class_code
    and clsl.language_code = 'KO'
    left outer join Commodity.Mm_Material_Commodity com
    on com.tenant_id = mst.tenant_id
    and com.commodity_code = mst.commodity_code
    left outer join CommodityLng.Mm_Material_Commodity_Lng coml
    on coml.tenant_id = com.tenant_id
    and coml.commodity_code = com.commodity_code
    and coml.language_code = 'KO'
    ;

    view SearchMaterialOrgView as
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
    left outer join Favorites.Mm_Mtl_User_Favorites fav
    on fav.tenant_id = org.tenant_id
    and fav.material_code = org.material_code
    ;
*/

}
