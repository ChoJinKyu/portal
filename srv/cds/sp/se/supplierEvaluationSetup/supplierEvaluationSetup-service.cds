using { cm.Pur_Org_Type_Mapping as orgTypeMapping } from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using { cm.Pur_Operation_Org as operationOrg } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';


namespace sp; 
@path : '/sp.supEvalSetupService'
service SupEvalSetupService {
    
    /* Evaluation ORG. (Condition) */
    view SupEvalOrgView as
        select org.tenant_id,
               org.company_code,
               org.org_type_code,
               org.org_code,
               org_name || map(org.company_code, '*', '', ' (' || org.company_code || ')') org_name: String(100)
        from   orgTypeMapping ma,
               operationOrg org
        where  org.tenant_id = ma.tenant_id
        and    org.company_code = ma.company_code
        and    ma.process_type_code = 'SP08'
        ;

    

}
