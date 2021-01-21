using {sp as supplView} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_VIEW-model';

//Common Organization
using {cm.Org_Company as OrgCompany} from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';	
using {cm.Org_Unit as OrgUnit} from '../../../../../db/cds/cm/CM_ORG_UNIT-model';
//Common Code
using {cm.Code_Mst as CodeMst} from '../../../../../db/cds/cm/CM_CODE_MST-model';
using {cm.Code_Dtl as CodeDtl} from '../../../../../db/cds/cm/CM_ORG_CODE_DTL-model';
using {cm.Code_Lng as CodeLng} from '../../../../../db/cds/cm/CM_ORG_CODE_LNG-model';

namespace sp;

@path : '/sp.supplierViewService'
service supplierViewService {

    @readonly
    view supplierView @(title : 'Supplier View') as select from supplView.Sm_Supplier_View;

    //Organiation View
    @readonly
    view companyView @(title : 'Company View') as
        select
            key tenant_id, //테넌트ID
            key company_code, //회사코드
                company_name //회사명
        from OrgCompany
        order by
            tenant_id,
            company_code;

    @readonly
    view bizUnitView @(title : 'Bizunit View') as
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
    view supplierTypeView @(title : 'Supplier Type View') as
        select
            key tenant_id, //테넌트ID
            key code, //공급업체유형코드
            key language_cd, //언어코드
                code_name //공급업체유형명
        from CodeLng
        // left join CodeDtl as dtl
        //     on  lng.tenant_id  = dtl.tenant_id
        //     and lng.group_code = dtl.group_code
        //     and lng.code       = dtl.code
        where
            group_code = 'SP_SM_SUPPLIER_TYPE'
        order by
            tenant_id,
            code,
            language_cd;
    // select
    //     key lng.tenant_id   as tenant_id, //테넌트ID
    //     key lng.code        as code, //공급업체유형코드
    //     key lng.language_cd as language_cd, //언어코드
    //         lng.code_name   as code_name //공급업체유형명
    // from CodeLng as lng
    // left join CodeDtl as dtl
    //     on  lng.tenant_id  = dtl.tenant_id
    //     and lng.group_code = dtl.group_code
    //     and lng.group_code = 'SP_SM_SUPPLIER_TYPE'
    //     and lng.code       = dtl.code
    // order by
    //     lng.tenant_id,
    //     dtl.sort_no;

    //Supplier Status View
    @readonly
    view supplierStatusView @(title : 'Supplier Status View') as
        select
            key tenant_id, //테넌트ID
            key code, //공급업체상태코드
            key language_cd, //언어코드
                code_name //공급업체상태명
        from CodeLng
        // left join CodeDtl as dtl
        //     on  lng.tenant_id  = dtl.tenant_id
        //     and lng.group_code = dtl.group_code
        //     and lng.code       = dtl.code
        where
            group_code = 'SP_SM_SUPPLIER_STATUS_CODE'
        order by
            tenant_id,
            code,
            language_cd;
// select
//     key lng.tenant_id   as tenant_id, //테넌트ID
//     key lng.code        as code, //공급업체상태코드
//     key lng.language_cd as language_cd, //언어코드
//         lng.code_name   as code_name //공급업체상태명
// from CodeLng as lng
// left join CodeDtl as dtl
//     on  lng.tenant_id  = dtl.tenant_id
//     and lng.group_code = dtl.group_code
//     and lng.group_code = 'SP_SM_SUPPLIER_STATUS_CODE'
//     and lng.code       = dtl.code
// order by
//     lng.tenant_id,
//     dtl.sort_no;
}
