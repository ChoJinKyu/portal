using {dp as mcstPjt} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT-model';
using {dp as mcstPartList} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_PART_LIST-model';
using {dp as mcstPartMapMst} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_PART_MAP_MST-model';
using {dp as mcstPartMapDtl} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_PART_MAP_DTL-model';
using {dp as mtlMst} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';
using {dp as mtlOrg} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_ORG-model';
using {dp as uom} from '../../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE-model';
using {cm as hrDept} from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';
using {cm as hrEmployee} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {cm as orgDiv} from '../../../../../db/cds/cm/CM_ORG_DIVISION-model';
using {dp as unitOfMeasure} from '../../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE-model';

namespace dp;

@path : '/dp.McstBomMgtService'
service McstBomMgtService {
    entity mcstProject as projection on mcstPjt.Tc_Mcst_Project;
    entity mcstProjectPartList as projection on mcstPartList.Tc_Mcst_Project_Part_List;
    entity mcstProjectPartMapMst as projection on mcstPartMapMst.Tc_Mcst_Project_Part_Map_Mst;
    entity mcstProjectPartMapDtl as projection on mcstPartMapDtl.Tc_Mcst_Project_Part_Map_Dtl;

    @readonly
    entity Hr_Employee             as projection on hrEmployee.Hr_Employee;

    @readonly
    entity Org_Division            as projection on orgDiv.Org_Division;        

    //@readonly
    //entity Hr_Department            as projection on hrDept.Hr_Department;

    view Org_Material as
        select key msi.tenant_id
             , key mmo.company_code
             , key mmo.org_type_code
             , key mmo.org_code
             , key msi.material_code
             , msi.material_type_code
             , msi.material_desc
             , msi.material_spec
             , msi.base_uom_code
             , uom.uom_name
             , msi.material_group_code
             , msi.purchasing_uom_code
             , msi.variable_po_unit_indicator
             , msi.material_class_code
             , msi.commodity_code
             , msi.maker_part_number
             , msi.maker_code
             , msi.maker_part_profile_code
             , msi.maker_material_code
             , msi.delete_mark
             , mmo.buyer_empno
          from mtlMst.Mm_Material_Mst msi
          left join mtlOrg.Mm_Material_Org mmo
            on msi.tenant_id = mmo.tenant_id
           and msi.material_code = mmo.material_code
          left outer join unitOfMeasure.Mm_Unit_Of_Measure uom
            on msi.tenant_id = uom.tenant_id
           and msi.base_uom_code = uom.uom_code
           //and uom.uom_class_code = 'AAAADL'
           and uom.uom_desc is not null
           and uom.disable_date is null;

    view PartListView as
        select key ppl.tenant_id
             , key ppl.project_code
             , key ppl.model_code
             , key ppl.version_number
             , key ppl.material_code
             , ppl.commodity_code
             , ppl.uom_code 
             , ifnull(muom.uom_name, ppl.uom_code) AS uom_name:String(30)   /*단위*/
             , ppl.material_reqm_quantity
             , ppl.material_reqm_diff_quantity
             , ppl.buyer_empno
             , ppl.supplier_code
             , ppl.change_info_code
             , ppl.direct_register_flag
             , ppl.mapping_id
             , msi.material_desc
             , msi.material_spec
             , CM_GET_CODE_NAME_FUNC (ppl.tenant_id
                                     ,'DP_TC_CHANGE_INFO_CODE'
                                     ,ppl.change_info_code
                                     ,'KO'
                                     ) AS change_info_text: String(240)        /*변경정보*/
             , pmm.change_reason  /*매핑사유*/
          from mcstPartList.Tc_Mcst_Project_Part_List ppl
left outer join mtlMst.Mm_Material_Mst msi
            on msi.tenant_id = ppl.tenant_id
           and msi.material_code = ppl.material_code
left outer join mcstPartMapMst.Tc_Mcst_Project_Part_Map_Mst pmm
            on pmm.tenant_id = ppl.tenant_id
           and pmm.mapping_id = ppl.mapping_id
left outer join uom.Mm_Unit_Of_Measure muom
            on muom.tenant_id = ppl.tenant_id
           and muom.uom_code = ppl.uom_code;           

    @readonly
    entity MM_UOM                as
        select from unitOfMeasure.Mm_Unit_Of_Measure as d {
            key tenant_id,
            key uom_code,
                uom_name,
                uom_desc
        }
        where uom_desc is not null
          and disable_date is null
          //and uom_class_code = 'AAAADL'
          ;           

}