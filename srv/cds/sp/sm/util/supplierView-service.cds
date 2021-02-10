using {sp as supplView} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_VIEW-model';
using {sp as supplCalView} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_CAL_VIEW-model';
using {sp as supplWoOrgCalView} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_WO_ORG_CAL_VIEW-model';
//Common Organization
using {cm.Org_Company as OrgCompany} from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';
using {cm.Org_Unit as OrgUnit} from '../../../../../db/cds/cm/CM_ORG_UNIT-model';
//Common Code
using {cm.Code_Mst as CodeMst} from '../../../../../db/cds/cm/CM_CODE_MST-model';
using {cm.Code_Dtl as CodeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using {cm.Code_Lng as CodeLng} from '../../../../../db/cds/cm/CM_CODE_LNG-model';

namespace sp;

@cds.query.limit: { max: 99999 }
@path : '/sp.supplierViewService'
service supplierViewService {

    // @cds.query.limit: {default: 500, max: 100000}
    // @cds.query.limit: {max: 100000}
    @readonly
    view supplierView @(title : '공급업체 View') as select from supplCalView.Sm_Supplier_Cal_View;

    @readonly
    view supplierWithoutOrgView @(title : '공급업체(조직X) View') as select from supplWoOrgCalView.Sm_Supplier_Wo_Org_Cal_View;

    //Organiation View
    @readonly
    view companyView @(title : '회사코드 View') as
        select
            key tenant_id, //테넌트ID
            key company_code, //회사코드
                company_name //회사명
        from OrgCompany
        order by
            tenant_id,
            company_code;

    @readonly
    view bizUnitView @(title : '사업부분 View') as
        select
            key tenant_id, //테넌트ID
            key bizunit_code, //사업부분코드
                bizunit_name //사업부분명
        from OrgUnit
        order by
            tenant_id,
            bizunit_code;

    //Supplier Type View
    @readonly
    view supplierTypeView @(title : '공급업체유형 View') as
        select
            key tenant_id, //테넌트ID
            key code, //공급업체유형코드
            key language_cd, //언어코드
                code_name //공급업체유형명
        from CodeLng
        where
            group_code = 'SP_SM_SUPPLIER_TYPE'
        order by
            tenant_id,
            code,
            language_cd;

    //Supplier Status View
    @readonly
    view supplierStatusView @(title : '공급업체상태 View') as
        select
            key tenant_id, //테넌트ID
            key code, //공급업체상태코드
            key language_cd, //언어코드
                code_name //공급업체상태명
        from CodeLng
        where
            group_code = 'SP_SM_SUPPLIER_STATUS_CODE'
        order by
            tenant_id,
            code,
            language_cd;

    @readonly
    view bpRoleCodeiew @(title : 'BP Role Code View') as
        select
            key tenant_id, //테넌트ID
            key code, //공급업체역할코드
            key language_cd, //언어코드
                code_name //공급업체역할명
        from CodeLng
        where
            group_code = 'SP_SM_BP_ROLE_CODE'
        order by
            tenant_id,
            code,
            language_cd;
}
