using {xx.Org_Code_View as xx_Org_Code} from '../../../../db/cds/xx/XX_ORG_CODE_VIEW-model';
using {cm.Org_Tenant as cm_Org_Tenant} from '../../../../db/cds/cm/CM_ORG_TENANT-model';
using {cm.Org_Company as cm_Org_Company} from '../../../../db/cds/cm/CM_ORG_COMPANY-model';
using {cm.Org_Purchasing as cm_Org_Purchasing} from '../../../../db/cds/cm/CM_ORG_PURCHASING-model';
using {cm.Org_Plant as cm_Org_Plant} from '../../../../db/cds/cm/CM_ORG_PLANT-model';
using {cm.Org_Division as cm_Org_Division} from '../../../../db/cds/cm/CM_ORG_DIVISION-model';
using {cm.Org_Unit as cm_Org_Unit} from '../../../../db/cds/cm/CM_ORG_UNIT-model';
using {xx.Pur_Org_Type_View as xx_Pur_Org_Type} from '../../../../db/cds/xx/XX_PUR_ORG_TYPE_VIEW-model';

namespace xx.util;

@path : '/xx.util.OrgService'
service OrgService {

    @readonly
    view Code as
        select
            key a.tenant_id,
            key a.group_code,
            key a.org_code,
            key a.language_code,
            key a.code,
            a.code_name,
            a.parent_group_code,
            a.parent_code,
            a.sort_no
        from
            xx_Org_Code a
        where
            a.language_code = 'KO'
            and $now between a.start_date and a.end_date
    ;

    @readonly
    view Tenant as 
        select
            key a.tenant_id,
            a.tenant_name
        from
            cm_Org_Tenant a
        where
            a.use_flag = true
    ;

    @readonly
    view Company as 
        select
            key a.tenant_id,
            key a.company_code,
            a.company_name,
            a.erp_type_code,
            a.currency_code,
            a.country_code,
            a.language_code,
            a.affiliate_code
        from
            cm_Org_Company a
        where
            a.use_flag = true
    ;

    @readonly
    view Purchasing as 
        select
            key a.tenant_id,
            key a.purchase_org_code,
            a.purchase_org_name
        from
            cm_Org_Purchasing a
        where
            a.use_flag = true
    ;

    @readonly
    view Plant as 
        select
            key a.tenant_id,
            key a.company_code,
            key a.plant_code,
            a.plant_name,
            a.purchase_org_code,
            a.bizdivision_code,
            a.au_code,
            a.hq_au_code,
            a.master_org_flag,
            a.validation_org_flag
        from
            cm_Org_Plant a
        where
            a.use_flag = true
    ;

    @readonly
    view Division as 
        select
            key a.tenant_id,
            key a.bizdivision_code,
            a.bizdivision_name,
            a.hq_au_flag,
            a.bizunit_code
        from
            cm_Org_Division a
        where
            a.use_flag = true
    ;

    @readonly
    view Unit as 
        select
            key a.tenant_id,
            key a.bizunit_code,
            a.bizunit_name
        from
            cm_Org_Unit a
        where
            a.use_flag = true
    ;

    @readonly
    view Pur_Org_Type as 
        select
            key a.tenant_id,
            key a.company_code,
            key a.process_type_code,
            a.process_type_name,
            a.org_type_code,
            a.org_type_name
        from
            xx_Pur_Org_Type(p_language_code: 'KO') a
        where
            a.use_flag = true
    ;

}
