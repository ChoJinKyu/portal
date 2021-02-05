using {sp.Vi_Mrp_Summary as MrpSummary} from '../../../../../db/cds/sp/vi/SP_VI_MRP_SUMMARY-model.cds';
using {dp.Mm_Material_Mst as MaterialMst} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';
using {dp.Mm_Material_Org as OrgMtl} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_ORG-model';
using {dp.Mm_Material_Class_View as MaterialClass} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_CLASS_VIEW-model';
using {dp.Mm_Material_Group_View as MaterialGroup} from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_GROUP_VIEW-model';
using {cm.Code_View as CodeDtl} from '../../../../../db/cds/cm/CM_CODE_VIEW-model';

namespace sp;
@path : '/sp.MrpService'
service MrpService {
    
    @readonly
    view MrpView as
        select
            key mrp.tenant_id,
            key mrp.plant_code,
            key mrp.material_code,
                mmm.material_group_code,
                mmg.material_group_name,                
                mmo.user_item_type_code as uit : String(10),
                mmm.material_class_code,
                mmc.material_class_name,
                mrp.stock_qty,
                mrp.mm_1_req_qty,
                mrp.mm_2_req_qty,
                mrp.mm_3_req_qty,
                mrp.mm_4_req_qty,
                mrp.mm_5_req_qty,
                mrp.mm_6_req_qty,
                mrp.mm_7_req_qty,
                mrp.mm_8_req_qty,
                mrp.mm_9_req_qty,
                mrp.mm_10_req_qty,
                mrp.mm_11_req_qty,
                mrp.mm_12_req_qty,
                mmm.material_desc,
                mmm.base_uom_code       as uom : String(3),
                mmm.material_spec,
                mmm.material_type_code
        from MrpSummary mrp
        join MaterialMst mmm
            on(
                mrp.tenant_id = mmm.tenant_id
                and mrp.material_code = mmm.material_code
            )
        join OrgMtl mmo
            on(
                mrp.tenant_id = mmo.tenant_id
                and mrp.plant_code = mmo.org_code
                and mrp.material_code = mmo.material_code
            )
        left outer join MaterialClass mmc
            on(
                mmm.tenant_id = mmc.tenant_id
                and mmm.material_class_code = mmc.material_class_code
                and mmc.language_code = 'KO'
            )
        left outer join CodeDtl cd
            on(
                mmm.tenant_id = cd.tenant_id
                and mmm.material_type_code = cd.code
                and cd.group_code = 'MATERIAL_TYPE_CODE'
                and cd.language_cd = 'KO'
            )
        left outer join MaterialGroup mmg
            on(
                mmm.tenant_id = mmg.tenant_id
                and mmm.material_group_code = mmg.material_group_code
                and mmg.language_code = 'KO'
            )
};
