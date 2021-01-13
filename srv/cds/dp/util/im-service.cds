using { dp.SupplierIdeaBasicDataMgtService as Idea } from '../im/supplierIdeaBasicDataMgt/supplierIdeaBasicDataMgt-service';


namespace dp.util;

@path : '/dp.util.ImService'
service ImService {

    @readonly
    view IdeaManager as
    select  key t.tenant_id,
            key t.company_code,
            key t.idea_role_code,
            key t.role_person_empno,
            t.user_local_name,
            t.department_local_name,
            t.company_name,
            t.idea_role_name,
            t.bizunit_code,
            t.bizunit_name,
            t.idea_product_group_code,
            t.idea_product_group_name,
            t.effective_start_date,
            t.effective_end_date
    from  Idea.IdeaRoleAssignView t
    where $now between t.effective_start_date and t.effective_end_date
    ;

}
