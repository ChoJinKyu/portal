using {dp as pjt} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT-model';
using {dp as pjtEvt} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_EVENT-model';
using {dp as pjtExrate} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_BASE_EXRATE-model';
using {dp as pjtSimilarModel} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_SIMILAR_MODEL-model';
using {dp as pjtAddInfo} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_ADDITION_INFO-model';
using {cm as codeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using {cm as codeLng} from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using {cm as hrEmployee} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {cm as hrDept} from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';
using {cm as orgDiv} from '../../../../../db/cds/cm/CM_ORG_DIVISION-model';
using {dp as unitOfMeasure} from '../../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE-model';
using {cm as currency} from '../../../../../db/cds/cm/CM_CURRENCY-model';
using {cm as purOperOrg} from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';

namespace dp;

@path : '/dp.ProjectMgtService'
service ProjectMgtService {
    entity Project as projection on pjt.Tc_Project;
    entity ProjectEvent as projection on pjtEvt.Tc_Project_Event;
    entity ProjectExrate as projection on pjtExrate.Tc_Project_Base_Exrate;
    entity ProjectSimilarModel as projection on pjtSimilarModel.Tc_Project_Similar_Model;
    entity ProjectAddInfo as projection on pjtAddInfo.Tc_Project_Addition_Info;

    @readonly
    entity Code_Dtl                as
        select from codeDtl.Code_Dtl as d {
            key tenant_id,
            key group_code,
            key code,
                (
                    select code_name from codeLng.Code_Lng l
                    where
                            l.tenant_id   = d.tenant_id
                        and l.group_code  = d.group_code
                        and l.code        = d.code
                        and l.language_cd = 'KO'
                ) as code_name : String(240),
                code_description,
                sort_no
        }
        where
            $now between start_date and end_date;

    @readonly
    entity Hr_Employee             as projection on hrEmployee.Hr_Employee;

    //@readonly
    //entity Hr_Department            as projection on hrDept.Hr_Department; 

    @readonly
    entity Org_Division            as projection on orgDiv.Org_Division;

    @readonly
    entity Org_Div as
        select distinct key cpo.tenant_id
             , key cpo.company_code
             , key cod.bizdivision_code
             , cod.bizdivision_name
          from orgDiv.Org_Division cod
     left join purOperOrg.Pur_Operation_Org cpo
            on cod.tenant_id = cpo.tenant_id
           and cod.bizdivision_code = cpo.bizdivision_code
         where cpo.bizdivision_code is not null;

    @readonly
    entity MM_UOM                as
        select from unitOfMeasure.Mm_Unit_Of_Measure as d {
            key tenant_id,
            key uom_code,
                uom_name,
                uom_desc
        }
        where uom_class_code = 'AAAADL'
          and uom_desc is not null
          and disable_date is null;

    @readonly
    entity Currency as
        select from currency.Currency as c{
            key tenant_id,
            key currency_code
        }
        where use_flag = true;    


    view ProjectView as
        select key tp.tenant_id                  /*테넌트ID*/
            , key tp.project_code               /*프로젝트코드*/
            , key tp.model_code                 /*모델코드*/
            , tp.project_name               /*프로젝트명*/
            , tp.model_name                 /*모델명*/
            , tp.company_code               /*회사코드*/
            , tp.org_type_code              /*조직유형코드*/
            , tp.org_code                   /*조직코드*/
            , tp.bizdivision_code           /*사업부코드*/
            , tp.product_group_code         /*제품군코드*/
            , tp.source_type_code           /*출처구분코드*/
            , tp.quotation_project_code     /*견적프로젝트코드*/
            , tp.project_status_code        /*프로젝트상태코드*/
            , tp.project_grade_code         /*프로젝트등급코드*/
            , tp.production_company_code    /*생산회사코드*/
            , tp.project_leader_empno       /*프로젝트리더사번*/
            , tp.buyer_empno                /*구매담당자사번*/
            , tp.marketing_person_empno     /*마케팅담당자사번*/
            , tp.planning_person_empno      /*기획담당자사번*/
            , tp.customer_local_name        /*고객로컬명*/
            , tp.last_customer_name         /*최종고객명*/
            , tp.customer_model_desc        /*고객모델설명*/
            , tp.mcst_yield_rate            /*재료비수율*/
            , tp.bom_type_code              /*자재명세서유형코드*/
            , tp.sales_currency_code        /*매출통화코드*/
            , tp.project_creator_empno      /*프로젝트생성자사번*/
            , tp.project_create_date        /*프로젝트생성일자*/
            , tp.massprod_start_date        /*양산시작일자*/
            , tp.massprod_end_date          /*양산종료일자*/
            , ifnull(tp.mcst_excl_flag, false) AS  mcst_excl_flag: Boolean            /*재료비제외여부*/
            , tp.mcst_excl_reason           /*재료비제외사유*/
            , tp.direct_register_flag       /*직접등록여부*/
            , tp.develope_event_code     
            , CM_GET_CODE_NAME_FUNC (tp.tenant_id
                                    ,'DC_TC_PRODUCT_GROUP_CODE'
                                    ,tp.product_group_code
                                    ,'KO'
                                    ) AS product_group_text: String(240)        /*제품군명*/
            , CM_GET_CODE_NAME_FUNC (tp.tenant_id
                                    ,'DP_TC_PROJECT_GRADE_CODE'
                                    ,tp.project_grade_code
                                    ,'KO'
                                    ) AS project_grade_text: String(240)        /*프로젝트등급명*/
            , CM_GET_CODE_NAME_FUNC (tp.tenant_id
                                    ,'DP_TC_BOM_TYPE_CODE'
                                    ,tp.bom_type_code
                                    ,'KO'
                                    ) AS bom_type_text: String(240)              /*자재명세서유형명*/
            , CM_GET_CODE_NAME_FUNC (tp.tenant_id
                                    ,'DP_TC_PROJECT_STATUS_CODE'
                                    ,tp.project_status_code
                                    ,'KO'
                                    ) AS project_status_text: String(240)        /*프로젝트상태명*/
            , DP_TC_GET_USER_INFO_FUNC (tp.tenant_id
                                        ,tp.project_leader_empno
                                        ,'N'
                                        ) AS project_leader_name: String(100)     /*프로젝트리더이름*/
            , DP_TC_GET_USER_INFO_FUNC (tp.tenant_id
                                        ,tp.buyer_empno
                                        ,'N'
                                        ) AS buyer_name: String(100)              /*재료비총괄이름*/
            , (select cod.bizdivision_name
                 from orgDiv.Org_Division cod
                where cod.tenant_id = tp.tenant_id
                  and cod.bizdivision_code = tp.bizdivision_code) AS bizdivision_text: String(240)     /*사업부명*/ 
            , DP_TC_GET_MCST_LAST_REG_DATE_FUNC (tp.tenant_id
                                                ,tp.project_code
                                                ,tp.model_code
                                                ) AS last_register_date: String(30)
            , DP_TC_GET_MCST_PROJECT_STATUS_INFO_FUNC (tp.tenant_id
                                                    ,tp.project_code
                                                    ,tp.model_code
                                                    ,'QUOTATION'  /*견적*/
                                                    ,'KO'
                                                    ) AS quotation_status_name: String(30)
            , DP_TC_GET_MCST_PROJECT_STATUS_CODE_FUNC (tp.tenant_id
                                                    ,tp.project_code
                                                    ,tp.model_code
                                                    ,'QUOTATION'  /*견적*/
                                                ) AS quotation_status_code: String(30)
            , DP_TC_GET_MCST_PROJECT_STATUS_INFO_FUNC (tp.tenant_id
                                                ,tp.project_code
                                                ,tp.model_code
                                                ,'TARGETS'  /*목표*/
                                                ,'KO'
                                                ) AS target_status_name: String(30)
            , DP_TC_GET_MCST_PROJECT_STATUS_CODE_FUNC (tp.tenant_id
                                                    ,tp.project_code
                                                    ,tp.model_code
                                                    ,'TARGETS'  /*목표*/
                                                    ) AS target_status_code: String(30)
            , DP_TC_GET_MCST_PROJECT_STATUS_INFO_FUNC (tp.tenant_id
                                                ,tp.project_code
                                                ,tp.model_code
                                                ,'ESTIMATE'  /*예상*/
                                                ,'KO'
                                                ) AS estimate_status_name: String(30)
            , DP_TC_GET_MCST_PROJECT_STATUS_CODE_FUNC (tp.tenant_id
                                                    ,tp.project_code
                                                    ,tp.model_code
                                                    ,'ESTIMATE'  /*예상*/
                                                    ) AS estimate_status_code: String(30)


        from pjt.Tc_Project tp;
    
}