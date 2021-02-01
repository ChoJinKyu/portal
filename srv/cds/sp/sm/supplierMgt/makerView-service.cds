// Table
using {sp as mkCntry} from '../../../../../db/cds/sp/sm/SP_SM_COUNTRY_MST-model';
// View
using {sp as mkView} from '../../../../../db/cds/sp/sm/SP_SM_MAKER_VIEW-model';
using {sp as mkCalView} from '../../../../../db/cds/sp/sm/SP_SM_MAKER_CAL_VIEW-model';
using {sp as bpCalView} from '../../../../../db/cds/sp/sm/SP_SM_BUSINESS_PARTNER_CAL_VIEW-model';
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
    view MakerView @(title : '제조사 View') as select from mkCalView.Sm_Maker_Cal_View;

    @readonly
    view BusinessPartnerView @(title : '비즈니스파트너 View') as select from bpCalView.Sm_Business_Partner_Cal_View;

    //Maker Master View
    //Maker Status View
    @readonly
    view MakerStatusView @(title : '제조사 상태 코드 View') as
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
            sort_no
        ;

    //Business Partner Master View
    //Business Partner Role Code View
    @readonly
    view BusinessPartnerRoleCodeView @(title : 'Business Partner Role Code View') as
        select from mkMstView.Sm_Master_Cal_View as makerView {
            key makerView.tenant_id,
            key makerView.code,
                makerView.sort_no,
                makerView.code_name
        }
        where
            group_code = 'SP_SM_BP_ROLE_CODE'
        and trim(code) <> '100000'
        order by
            tenant_id,
            sort_no
        ;

    //Business Partner Registration Progress View
    @readonly
    view BusinessPartnerRegistrationProgressView @(title : '비즈니스파트너 등록 진행 View') as
        select from mkMstView.Sm_Master_Cal_View as makerView {
            key makerView.tenant_id,
            key makerView.code,
                makerView.sort_no,
                makerView.code_name
        }
        where
            group_code = 'SP_SM_SUPPLIE_REG_PROG_CODE'
        order by
            tenant_id,
            sort_no
        ;

    //Business Partner Status View
    @readonly
    view BusinessPartnerStatusView @(title : '비즈니스파트너 상태 코드 View') as
        select from mkMstView.Sm_Master_Cal_View as makerView {
            key makerView.tenant_id,
            key makerView.code,
                makerView.sort_no,
                makerView.code_name
        }
        where
            group_code = 'SP_SM_SUPPLIER_STATUS_CODE'
        order by
            tenant_id,
            sort_no
        ;

    //Master View
    //Maker Registration Request Status View
    @readonly
    view MakerRegistrationRequestStatusView @(title : '제조사 등록 요청 상태 View') as
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
            sort_no
        ;

    //Supplier Type View
    @readonly
    view SupplierTypeView @(title : '공급업체 유형 View') as
        select from mkMstView.Sm_Master_Cal_View as makerView {
            key makerView.tenant_id,
            key makerView.code,
                makerView.sort_no,
                makerView.code_name
        }
        where
            group_code = 'SP_SM_SUPPLIER_TYPE'
        order by
            tenant_id,
            sort_no
        ;

    //Organization View
    @readonly
    view OrganizationView @(title : '조직 View') as
        select
            key tenant_id,
            key bizunit_code,
                bizunit_name
        from OrgUnit.Org_Unit
        where
            use_flag = true
        order by
            tenant_id,
            bizunit_code
    ;

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

}
