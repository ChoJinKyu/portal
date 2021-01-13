using {cm.Org_Tenant as Org_Tenant} from '../../../../db/cds/cm/CM_ORG_TENANT-model';
using {cm.Org_Company as Org_Company} from '../../../../db/cds/cm/CM_ORG_COMPANY-model';
using {cm.Org_Purchasing as Org_Purchasing} from '../../../../db/cds/cm/CM_ORG_PURCHASING-model';
using {cm.Org_Plant as Org_Plant} from '../../../../db/cds/cm/CM_ORG_PLANT-model';
using {cm.Org_Division as Org_Division} from '../../../../db/cds/cm/CM_ORG_DIVISION-model';
using {cm.Org_Unit as Org_Unit} from '../../../../db/cds/cm/CM_ORG_UNIT-model';

namespace cm.util;

@path : '/cm.util.OrgService'
service OrgService {

    @readonly
    entity Tenant  as projection on Org_Tenant;

    @readonly
    entity Company as projection on Org_Company;

    @readonly
    entity Plant   as projection on Org_Plant;

    @readonly
    entity Unit   as projection on Org_Unit;

    @readonly
    view CompanyDetail as
        select
            key c.tenant_id,
            key c.company_code,
            key c.company_name,
            key c.use_flag,
                c.erp_type_code,
                c.currency_code,
                c.country_code,
                c.language_code
        from Org_Company as c
        where
                c.tenant_id = c.tenant_id
            and c.use_flag  = 'true';


}
