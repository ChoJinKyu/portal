// Table
using {sp as mkCntry} from '../../../../../db/cds/sp/sm/SP_SM_COUNTRY_MST-model';
// View
using {sp as mkView} from '../../../../../db/cds/sp/sm/SP_SM_MAKER_VIEW-model';
using {sp as mkMstView} from '../../../../../db/cds/sp/sm/SP_SM_MASTER_CAL_VIEW-model';
//Common Organization
using {cm as OrgCompany} from '../../../../../db/cds/cm/CM_ORG_COMPANY-model';
using {cm as OrgUnit} from '../../../../../db/cds/cm/CM_ORG_UNIT-model';
//Common Code
using {cm as CodeMst} from '../../../../../db/cds/cm/CM_CODE_MST-model';
using {cm as CodeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using {cm as CodeLng} from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using {cm as Cntry} from '../../../../../db/cds/cm/CM_COUNTRY-model';
using {cm as CntryLng} from '../../../../../db/cds/cm/CM_COUNTRY_LNG-model';

namespace sp;

@path : '/sp.makerViewService'
service makerViewService {

    //Table
    entity MakerCountryManagement @(title : '제조사 국가관리') as projection on mkCntry.Sm_Country_Mst;

    // View
    @readonly
    view MakerView @(title : '제조사 View') as select from mkView.Sm_Maker_View;

    //Organiation View
    // @readonly
    // view companyView @(title : '회사코드 View') as
    //     select
    //         key tenant_id, //테넌트ID
    //         key company_code, //회사코드
    //             company_name //회사명
    //     from OrgCompany
    //     order by
    //         tenant_id,
    //         company_code;

    // @readonly
    // view bizUnitView @(title : '사업부분 View') as
    //     select
    //         key tenant_id, //테넌트ID
    //         key bizunit_code, //사업부분코드
    //             bizunit_name //사업부분명
    //     from OrgUnit
    //     order by
    //         tenant_id,
    //         bizunit_code;

    //Maker Status View
    @readonly
    view MakerStatusView @(title : '제조사상태 View') as
        // select
        //     key detail.tenant_id   as tenant_id,
        //     key detail.code        as code,
        //         detail.sort_no     as sort_no,
        //         lang.code_name as code_name
        // from CodeDtl as detail
        // left outer join CodeLng as lang
        //     on(
        //         (
        //             lang.tenant_id = detail.tenant_id
        //             and lang.group_code = detail.group_code
        //             and lang.code = detail.code
        //         )
        //         and (
        //             lang.language_cd = upper(
        //                 substring(
        //                     session_context(
        //                         'LOCALE'
        //                     ), 1, 2
        //                 )
        //             )
        //         )
        //     )
        // where
        //     detail.group_code = 'SP_SM_SUPPLIER_STATUS_CODE'
        // order by
        //     detail.tenant_id asc,
        //     detail.sort_no   asc;
        select
            key tenant_id, //테넌트ID
            key code, //제조사상태코드
                code_name //제조사상태명
        from CodeLng.Code_Lng
        where
                group_code = 'SP_SM_SUPPLIER_STATUS_CODE'
            and language_cd = upper(substring(session_context('LOCALE'),1,2))
            and code <> 'S'
        order by
            tenant_id,
            code
        ;
    view MakerCalView @(title : '제조사 View') as
        select from mkMstView.Sm_Master_Cal_View as makerView {
            key makerView.tenant_id,
            key makerView.code,
                makerView.sort_no,
                makerView.code_name
        }
        where
            group_code = 'SP_SM_SUPPLIER_STATUS_CODE'
            and code <> 'S'
        order by
            tenant_id,
            sort_no;

    //Maker Registration Request Status View
    @readonly
    view MakerRegistrationRequestStatusView @(title : '제조사 등록 요청 상태 View') as
        // select
        //     key detail.tenant_id   as tenant_id,
        //     key detail.code        as code,
        //         detail.sort_no     as sort_no,
        //         lang.code_name as code_name
        // from CodeDtl as detail
        // left outer join CodeLng as lang
        //     on(
        //         (
        //             lang.tenant_id = detail.tenant_id
        //             and lang.group_code = detail.group_code
        //             and lang.code = detail.code
        //         )
        //         and (
        //             lang.language_cd = upper(
        //                 substring(
        //                     session_context(
        //                         'LOCALE'
        //                     ), 1, 2
        //                 )
        //             )
        //         )
        //     )
        // where
        //     detail.group_code = 'SP_SM_SUPPLIER_STATUS_CODE'
        // order by
        //     detail.tenant_id asc,
        //     detail.sort_no   asc;
        select
            key tenant_id, //테넌트ID
            key code, //제조사상태코드
                code_name //제조사상태명
        from CodeLng.Code_Lng
        where
                group_code = 'SP_SM_SUPPLIER_REG_STATUS_CODE'
            and language_cd = upper(substring(session_context('LOCALE'),1,2))
        order by
            tenant_id,
            code
        ;

    view MakerRegistrationRequestStatusCalView @(title : '제조사 View') as
        select from mkMstView.Sm_Master_Cal_View as makerView {
            key makerView.tenant_id,
            key makerView.code,
                makerView.sort_no,
                makerView.code_name
        }
        where
            group_code = 'SP_SM_SUPPLIER_REG_STATUS_CODE'
        order by
            tenant_id,
            sort_no;

    //BP Role Code View
    @readonly
    view BpRoleCodeView @(title : 'BP Role Code View') as
        // select
        //     key Code_Dtl.tenant_id  as tenant_id,
        //     key Code_Dtl.code       as code,
        //         Code_Dtl.sort_no    as sort_no,
        //         Code_Lng.code_name  as code_name
        // from CodeDtl.Code_Dtl
        // left outer join CodeLng.Code_Lng
        //     on(
        //         (
        //             Code_Lng.tenant_id = Code_Dtl.tenant_id
        //             and Code_Lng.group_code = Code_Dtl.group_code
        //             and Code_Lng.code = Code_Dtl.code
        //         )
        //         and (
        //             Code_Lng.language_cd = upper(
        //                 substring(
        //                     session_context(
        //                         $user.locale
        //                     ), 1, 2
        //                 )
        //             )
        //         )
        //     )
        // where
        //     Code_Dtl.group_code = 'SP_SM_BP_ROLE_CODE'
        // order by
        //     Code_Dtl.tenant_id asc,
        //     Code_Dtl.sort_no   asc
        // ;
        select
            key tenant_id, //테넌트ID
            key code, //제조사역할코드
                code_name //제조사역할명
        from CodeLng.Code_Lng
        where
                group_code = 'SP_SM_BP_ROLE_CODE'
            and language_cd = upper(substring(session_context('LOCALE'),1,2))
        order by
            tenant_id,
            code
        ;

    view BpRoleCodeCalView @(title : '제조사 View') as
        select from mkMstView.Sm_Master_Cal_View as makerView {
            key makerView.tenant_id,
            key makerView.code,
                makerView.sort_no,
                makerView.code_name
        }
        where
            group_code = 'SP_SM_BP_ROLE_CODE'
        order by
            tenant_id,
            sort_no;

    //Contry View
    @readonly
    view CountryView @(title : '국가 View') as
        select
            key tenant_id,
            key country_code,
                country_name,
                description
        from CntryLng.Country_Lng
        where
            language_code = upper(substring(session_context('LOCALE'),1,2))
        order by
            tenant_id,
            country_code
        ;
        // select
        //     key detail.tenant_id    as tenant_id,
        //     key detail.country_code as country_code,
        //         lang.country_name   as country_name,
        //         lang.description    as description
        // from Cntry as detail
        // left outer join CntryLng as lang
        //     on detail.tenant_id = lang.tenant_id
        //     and detail.country_code = lang.country_code
        //     and lang.language_code = upper(
        //         substring(
        //             session_context(
        //                 'LOCALE'
        //             ), 1, 2
        //         )
        //     )
        // order by
        //     detail.tenant_id,
        //     detail.country_code;
}
