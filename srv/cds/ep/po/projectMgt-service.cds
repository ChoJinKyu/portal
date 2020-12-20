using {ep as project} from '../../../../db/cds/ep/po/EP_PO_PROJECT-model';
using {cm as orgUnit} from '../../../../db/cds/cm/CM_ORG_UNIT-model';
using {cm as orgDivision} from '../../../../db/cds/cm/CM_ORG_DIVISION-model';
using {cm as orgPlant} from '../../../../db/cds/cm/CM_ORG_PLANT-model';

namespace ep;
@path : 'ep.projectMgtService'
service ProjectMgtService{

    entity Project as projection on project.Po_Project;

    // plant_name, bizunit_name, bizdivision_name 조회를 위한 View 추가
    view ProjectView as
    select 
        key ep.tenant_id,
        key ep.company_code,
        key ep_project_number,
        project_name,
        ep_purchasing_type_code,
        ep.plant_code,
        pl.plant_name,
        ep.bizunit_code,
        unit.bizunit_name,
        ep.bizdivision_code,
        div.bizdivision_name, 
        remark,
        ep.local_create_dtm,
        ep.local_update_dtm,
        ep.create_user_id,
        ep.update_user_id,
        ep.system_create_dtm,
        ep.system_update_dtm        
        from project.Po_Project as ep
        left outer join orgUnit.Org_Unit as unit
        on ep.tenant_id = unit.tenant_id and ep.bizunit_code = unit.bizunit_code
        left outer join orgDivision.Org_Division as div
        on ep.tenant_id = div.tenant_id and ep.bizdivision_code = div.bizdivision_code   
        left outer join orgPlant.Org_Plant as pl
        on ep.tenant_id = pl.tenant_id and ep.company_code = pl.company_code and ep.plant_code = pl.plant_code;  

}
