
using { dp.Mm_Unit_Of_Measure as UnitOfMeasure, dp.Mm_Unit_Of_Measure_Lng as UomLng } from '../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE_LNG-model';
using { dp as Hs_Code } from '../../../../db/cds/dp/mm/DP_MM_HS_CODE-model';
using { dp.Mm_Material_Class as Class, dp.Mm_Material_Class_Lng as ClassLng } from  '../../../../db/cds/dp/mm/DP_MM_MATERIAL_CLASS_LNG-model';
using { dp.Mm_Material_Commodity as Commodity, dp.Mm_Material_Commodity_Lng as CommodityLng } from  '../../../../db/cds/dp/mm/DP_MM_MATERIAL_COMMODITY_LNG-model';
using { dp.Mm_Material_Group as MtlGroup, dp.Mm_Material_Group_Lng as MtlGroupLng } from  '../../../../db/cds/dp/mm/DP_MM_MATERIAL_GROUP_LNG-model';

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



}
