
/************************************************
  ---------Service정의 Rule  ------------------
  1. 선언부(Using)
    - '체인명(pg)'만 주고 as 이후는 Naming은 소문자로 시작
  2. namespace
    -  체인 소문자로 작성
    -  체인하위의 소모듈 존재시 체인.소모듈 로 작성
  
  3. entity
    - 선언부 이름을 사용하되 첫 글자는 대문자로 변경하여 사용하고 as projection on 이후에는 선언부 이름.모델 파일에 정의된 Entity명으로 정의
  
  4. 서비스에서 정의하는 View는 첫글자는 대문자로 시작하고 끝은 View를 붙인다  
  5. 서비스에서 정의하는 View의 컬럼(속성)
    - 소문자로 작성

*  화면 및 서비스 확인을 위한 wap서버 올릴때 명령어 ==>  mvn spring-boot:run

  --------- 현 Service 설명 -------------------
  1. service       : Np 단가품의
  2. description   : 단가품의 상세화면 조회
  3. history
    -. 2021.02.01 : 우완희
*************************************************/

using { cm.Code_Dtl                  as CM_CODE_DTL                  } from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm.Code_Lng                  as CM_CODE_LNG                  } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using { cm.Pur_Operation_Org         as CM_PUR_OPERATION_ORG         } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using { cm.Approval_Mst              as CM_APPROVAL_MST              } from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';

using { cm.Hr_Employee               as CM_HR_EMPLOYEE               } from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using { cm.Hr_Department             as CM_HR_DEPARTMENT             } from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';

using { sp.Np_Net_Price_Approval_Mst as SP_NP_NET_PRICE_APPROVAL_MST } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_MST-model';
using { sp.Np_Net_Price_Approval_Dtl as SP_NP_NET_PRICE_APPROVAL_DTL } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_DTL-model';
using { sp.Np_Base_Price_Mst         as SP_NP_BASE_PRICE_MST         } from '../../../../../db/cds/sp/np/SP_NP_BASE_PRICE_MST-model';

/* 공급사 마스터 */
using { sp.Sm_Supplier_Mst           as SP_SM_SUPPLIER_MST           } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';

/* vendor pool 마스터 */
using { pg.Vp_Vendor_Pool_Mst        as PG_VP_VENDOR_POOL_MST        } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MST-model';


namespace sp;

@path : '/sp.netpriceApprovalDetailService'
service NpApprovalDetailService {

    /*---------------------------------------------------------------------------------------------------------------------*/
    view NpApprovalDetailMasterView @(title : '단가품의 마스터조회 View') as
        SELECT
               key pam.tenant_id
             , key pam.company_code
             , key pam.org_type_code
             , key pam.org_code	                    /* operating org */
             , key pam.approval_number              /* Approval No. */

             , (SELECT org.org_name
                  FROM CM_PUR_OPERATION_ORG  org
                 WHERE org.tenant_id     = pam.tenant_id
                   AND org.company_code  = pam.company_code
                   AND org.org_type_code = pam.org_type_code
                   AND org.org_code      = pam.org_code
			   ) AS org_name : String               /* org */

            ,   cam.approval_title                   /* title !!! */
            ,   cam.approve_status_code              /* status !!! */

            ,   pam.net_price_document_type_code    /* 단가문서유형코드 */
            ,   pam.net_price_source_code           /* 견적번호??? */

             , (SELECT cd.code_name
                  FROM CM_CODE_LNG AS cd
                 WHERE cd.tenant_id   = cam.tenant_id
                   AND cd.group_code  = 'sp_net_price_type'
                   AND cd.language_cd = clc.language_code
               	   AND cd.code        = cam.approve_status_code
			   )  AS approve_status_name : String

             , cam.requestor_empno                      /* requestor !!! */
			 , CASE WHEN clc.language_code = 'EN' THEN che.user_english_name
			        WHEN clc.language_code = 'KO' THEN che.user_local_name
					ELSE che.user_english_name
			   END AS requestor_empnm : String

			 , CASE WHEN clc.language_code = 'EN' THEN chd.department_english_name
			        WHEN clc.language_code = 'KO' THEN chd.department_local_name
					ELSE che.user_english_name
			   END AS requestor_teamnm : String         /* requestor team */

                                                        /* ??? outcome ??? */
             , cam.request_date                         /* request date !!!! */
                                                        /* ??? negotiation no ??? */
 
             , pam.local_create_dtm AS creation_date    /* creation date */

          FROM SP_NP_NET_PRICE_APPROVAL_MST   pam

         INNER JOIN (SELECT a.tenant_id 
					       ,a.code AS language_code
                       FROM CM_CODE_DTL a
                      WHERE a.group_code = 'CM_LANG_CODE'
                     ) clc  /* 공통코드 언어코드(EN,KO) */
			ON clc.tenant_id         = pam.tenant_id

         INNER JOIN CM_APPROVAL_MST          cam
            ON cam.tenant_id         = pam.tenant_id
           AND cam.approval_number   = pam.approval_number

          LEFT JOIN CM_HR_EMPLOYEE           che
            ON che.tenant_id         = cam.tenant_id
           AND che.employee_number   = cam.requestor_empno

          LEFT JOIN CM_HR_DEPARTMENT         chd
            ON chd.tenant_id         = che.tenant_id
           AND chd.department_id     = che.department_id
    ;

    /*---------------------------------------------------------------------------------------------------------------------*/
    view NpApprovalDetailGeneralView @(title : '단가품의 상세 General 조회 View') as
        SELECT
                key pad.tenant_id		                /*	테넌트ID	*/
            ,	key pad.company_code		            /*	회사코드	*/
            ,	key pad.org_type_code		            /*	구매운영조직유형	*/
            ,	key pad.org_code		                /*	구매운영조직코드	*/
            ,	key pad.approval_number		            /*	품의번호	*/
            ,	key pad.item_sequence		            /*	품목순번	*/

            ,   (SELECT org.org_name
                   FROM CM_PUR_OPERATION_ORG  org
                  WHERE org.tenant_id     = pad.tenant_id
                    AND org.company_code  = pad.company_code
                    AND org.org_type_code = pad.org_type_code
                    AND org.org_code      = pad.org_code
			    ) AS org_name : String                   /*	구매운영조직코드 명	*/

            ,	pad.material_code		                /*	자재코드	*/
            ,	pad.material_desc		                /*	자재내역	*/

            ,	pad.supplier_code		                /*	공급업체코드	*/
            ,   sm.supplier_local_name
            ,   sm.supplier_english_name                /*  공급업체명 확인필요 */
           

            /*  SD-Mapping */
            /*  SD-File */

            ,	pad.vendor_pool_code		            /*	협력사풀코드	*/
            ,   vpm.vendor_pool_local_name              /*  협력사풀 명 확인필요 */
            ,   vpm.vendor_pool_english_name
            

            ,	pad.net_price_approval_reason_code		/*	단가품의사유코드	*/
            ,	pad.market_code		                    /*	납선코드	*/
            ,	pad.uom_code		                    /*	UOM코드	*/

            /* 이전 통화코드 */
            /* 이전 단가 */

            ,	pad.currency_code		                /*	통화코드	*/
            ,	pad.net_price		                    /*	단가	*/
            
            /* 변동비율 */
            /* 로얄티 */
            /* 임가공비 */
            /* 감상비 */
            /* 기타 */
            /* 통화 */
            /* price */
            /* others */
            /* 합계 */
            /* 최저가part여부 */
            /* import 유형 */
            /* surrogate */

            ,	pad.maker_code		                    /*	제조사코드	*/
            ,	pad.payterms_code		                /*	지불조건코드	*/ 

            /* 단가합의여부 */
            /* 단가합의상태 */
 
            ,	pad.incoterms		                    /*	인코텀즈	*/
            ,	pad.incoterms_2		                    /*	인코텀즈2	*/

            /* end customer */            
            /* 지정유형 */
            /* project name */
            /* 영업담당자 */
            /* 영업부서 */
            /* PO No */
            /* Reference Doc Mapping */
            /* Pcs Revision */
            /* S/part 단가증가사유 */
            /* S/part 공급유형 */
            /* 부품인정여부(품의시/현재) */
            /* Global 동일단가 */

            ,	pad.quotation_number		            /*	견적번호	*/
            ,	pad.quotation_item_number		        /*	견적품목번호	*/
            ,	pad.bidding_number		                /*	입찰번호	*/
            ,	pad.bidding_item_number		            /*	입찰품목번호	*/
            ,	pad.line_type_code		                /*	라인유형코드	*/

            ,	pad.effective_start_date	            /*	유효시작일자	*/
            ,	pad.effective_end_date		            /*	유효종료일자	*/
            ,	pad.surrogate_type_code		            /*	대리견적유형코드	*/

            ,	pad.purchasing_quantity		            /*	구매수량	*/
            ,	pad.purchasing_amount		            /*	구매금액	*/

            ,	pad.agent_code		                    /*	대행사코드	*/
            ,	pad.net_price_agreement_sign_flag		/*	단가합의서명여부	*/
            ,	pad.net_price_agreement_status_code		/*	단가합의상태코드	*/
            

            ,	pad.base_price_type_code		        /*	기준단가유형코드	*/
            ,	pad.quality_certi_flag		            /*	품질인증여부	*/
            ,	pad.exrate_type_code		            /*	환율유형코드	*/
            ,	pad.exrate_date		                    /*	환율일자	*/
            ,	pad.exrate		                        /*	환율	*/
            ,	pad.pr_number		                    /*	구매요청번호	*/
            ,	pad.pr_item_number		                /*	구매요청품목번호	*/
            ,	pad.material_class_code		            /*	자재클래스코드	*/
            ,	pad.po_unit		                        /*	구매오더단위	*/
            ,	pad.material_price_unit		            /*	자재가격단위	*/
            ,	pad.conversion_net_price		        /*	환산단가	*/
            ,	pad.net_price_type_code		            /*	단가유형코드	*/
            ,	pad.contract_date		                /*	계약일자	*/

            ,	pad.tax_code		                    /*	세금코드	*/
            ,	pad.overdlv_tolerance		            /*	초과납품허용율	*/
            ,	pad.hs_code		                        /*	HS코드	*/
            ,	pad.fta_code		                    /*	FTA코드	*/

        FROM SP_NP_NET_PRICE_APPROVAL_DTL   pad

        LEFT OUTER JOIN SP_SM_SUPPLIER_MST sm    /*  공급업체명 확인필요 */
                ON pad.tenant_id     = sm.tenant_id
               AND pad.supplier_code  = sm.supplier_code

        LEFT OUTER JOIN PG_VP_VENDOR_POOL_MST vpm
                ON pad.tenant_id        = vpm.tenant_id
               AND pad.company_code     = vpm.company_code
               AND pad.org_type_code    = vpm.org_type_code
               AND pad.org_code         = vpm.org_code
               AND pad.vendor_pool_code = vpm.vendor_pool_code

    ;


    /*---------------------------------------------------------------------------------------------------------------------*/
    view NpApprovalDetailBasePriceInfoView @(title : '단가품의 상세 BasePriceInfo 조회 View') as
        SELECT
                key pad.tenant_id		                        /*	테넌트ID	*/
            ,	key pad.company_code		                    /*	회사코드	*/
            ,	key pad.org_type_code		                    /*	구매운영조직유형	*/
            ,	key pad.org_code		                        /*	구매운영조직코드	*/
            ,	key pad.approval_number		                    /*	품의번호	*/
            ,	key pad.item_sequence		                    /*	품목순번	*/

            ,	pad.material_code		                        /*	자재코드	*/
            ,	pad.material_desc		                        /*	자재내역	*/

            ,	pad.supplier_code		                        /*	공급업체코드	*/
            ,   sm.supplier_local_name
            ,   sm.supplier_english_name                        /*  공급업체명 확인필요 */              

            ,	pad.currency_code		                        /*	통화코드	*/
            ,	pad.net_price		                            /*	단가	*/

            ,   pad.base_price_type_code                        /*  기준단가유형코드 */

            ,   pad.pyear_dec_base_currency_code                /*  전년12월기준통화코드 */
            ,   pad.pyear_dec_base_price                        /*  전년12월기준단가 */	
            ,   pad.pyear_dec_ci_rate                           /*  전년12월CI비율' */	

            ,	pad.quarter_base_currency_code		            /*	분기기준통화코드	*/
            ,	pad.quarter_base_price		                    /*	분기기준단가	*/
            ,	pad.quarter_ci_rate		                        /*	분기CI비율	*/

            ,	pad.vendor_pool_code		                    /*	협력사풀코드	*/
            ,   vpm.vendor_pool_local_name
            ,   vpm.vendor_pool_english_name                    /*  협력사풀 명 확인필요 */

            ,	pad.net_price_approval_reason_code		        /*	단가품의사유코드	*/
            

        FROM SP_NP_NET_PRICE_APPROVAL_DTL   pad

        LEFT OUTER JOIN SP_SM_SUPPLIER_MST sm    /*  공급업체명 확인필요 */
                ON pad.tenant_id        = sm.tenant_id
               AND pad.supplier_code    = sm.supplier_code

        LEFT OUTER JOIN PG_VP_VENDOR_POOL_MST vpm
                ON pad.tenant_id        = vpm.tenant_id
               AND pad.company_code     = vpm.company_code
               AND pad.org_type_code    = vpm.org_type_code
               AND pad.org_code         = vpm.org_code
               AND pad.vendor_pool_code = vpm.vendor_pool_code

    ;



    /*---------------------------------------------------------------------------------------------------------------------*/
    view NpApprovalDetailNegoHistoryInfoView @(title : '단가품의 상세 Nego History Info 조회 View') as
        SELECT
                key pad.tenant_id		        /*	테넌트ID	*/
            ,	key pad.company_code		    /*	회사코드	*/
            ,	key pad.org_type_code		    /*	구매운영조직유형	*/
            ,	key pad.org_code		        /*	구매운영조직코드	*/
            ,	key pad.approval_number		    /*	품의번호	*/
            ,	key pad.item_sequence		    /*	품목순번	*/

            , (SELECT org.org_name
                  FROM CM_PUR_OPERATION_ORG  org
                 WHERE org.tenant_id     = pad.tenant_id
                   AND org.company_code  = pad.company_code
                   AND org.org_type_code = pad.org_type_code
                   AND org.org_code      = pad.org_code
			   ) AS org_name : String           /*	구매운영조직코드 명	*/

            ,	pad.material_code		        /*	자재코드	*/
            ,	pad.material_desc		        /*	자재내역	*/

            ,	pad.supplier_code		        /*	공급업체코드	*/
            ,   sm.supplier_local_name
            ,   sm.supplier_english_name        /*  공급업체명 확인필요 */
           
            /*  SD-Mapping */
            /*  SD-File */

            ,	pad.vendor_pool_code		    /*	협력사풀코드	*/
            ,   vpm.vendor_pool_local_name 
            ,   vpm.vendor_pool_english_name    /*  협력사풀 명 확인필요 */
            
            ,	pad.net_price_approval_reason_code		/*	단가품의사유코드	*/
            
        FROM SP_NP_NET_PRICE_APPROVAL_DTL   pad

        LEFT OUTER JOIN SP_SM_SUPPLIER_MST sm    /*  공급업체명 확인필요 */
                ON sm.tenant_id     = pad.tenant_id
               AND sm.supplier_code  = pad.supplier_code

        LEFT OUTER JOIN PG_VP_VENDOR_POOL_MST vpm
                ON vpm.tenant_id        = pad.tenant_id
               AND vpm.company_code     = pad.company_code
               AND vpm.org_type_code    = pad.org_type_code
               AND vpm.org_code         = pad.org_code
               AND vpm.vendor_pool_code = pad.vendor_pool_code
    ;

}