
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
using { cm.Spp_User_Session_View     as CM_SPP_USER_SESSION_VIEW     } from '../../../../../db/cds/cm/util/CM_SPP_USER_SESSION_VIEW-model';
using { cm.Code_Dtl                  as CM_CODE_DTL                  } from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm.Code_Lng                  as CM_CODE_LNG                  } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using { cm.Pur_Operation_Org         as CM_PUR_OPERATION_ORG         } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using { cm.Approval_Mst              as CM_APPROVAL_MST              } from '../../../../../db/cds/cm/CM_APPROVAL_MST-model';

using { cm.Hr_Employee               as CM_HR_EMPLOYEE               } from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using { cm.Hr_Department             as CM_HR_DEPARTMENT             } from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';

using { sp.Np_Net_Price_Approval_Mst as SP_NP_NET_PRICE_APPROVAL_MST } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_MST-model';
using { sp.Np_Net_Price_Approval_Dtl as SP_NP_NET_PRICE_APPROVAL_DTL } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_APPROVAL_DTL-model';
using { sp.Np_Base_Price_Mst         as SP_NP_BASE_PRICE_MST         } from '../../../../../db/cds/sp/np/SP_NP_BASE_PRICE_MST-model';
using { sp.Np_Net_Price_Mst          as SP_NP_NET_PRICE_MST          } from '../../../../../db/cds/sp/np/SP_NP_NET_PRICE_MST-model';
 
/* 공급사 마스터 */
using { sp.Sm_Supplier_Mst           as SP_SM_SUPPLIER_MST           } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';

/* vendor pool 마스터 */
using { pg.Vp_Vendor_Pool_Mst        as PG_VP_VENDOR_POOL_MST        } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MST-model';





namespace sp;

@path : '/sp.netpriceApprovalDetailService'
service NpApprovalDetailService {

    /*---------------------------------------------------------------------------------------------------------------------*/
    /* 단가품의 마스터조회 */
    view MasterView as
        SELECT
                key pam.tenant_id
             ,  key pam.company_code
             ,  key pam.org_type_code
             ,  key pam.org_code	                            /* operating org */
             ,  key pam.approval_number                         /* Approval No. */

             ,  (SELECT org.org_name
                   FROM CM_PUR_OPERATION_ORG  org
                  WHERE org.tenant_id     = pam.tenant_id
                    AND org.company_code  = pam.company_code
                    AND org.org_type_code = pam.org_type_code
                    AND org.org_code      = pam.org_code
			    ) AS org_name : String                          /* org */


            ,   cam.requestor_empno                             /* requestor */
			,   CASE WHEN ssi.LANGUAGE_CODE = 'EN' THEN che.user_english_name
			         WHEN ssi.LANGUAGE_CODE = 'KO' THEN che.user_local_name
					 ELSE che.user_english_name
			    END AS requestor_empnm : String

            ,   cam.request_date                                /* request date */
            ,   cam.approve_status_code                         /* status !!! */

            ,   (SELECT cd.code_name
                   FROM CM_CODE_LNG AS cd
                  WHERE cd.tenant_id   = cam.tenant_id
                    AND cd.group_code  = 'SP_NET_PRICE_APPR_STATUS'
                    AND cd.language_cd = ssi.LANGUAGE_CODE
               	    AND cd.code        = cam.approve_status_code
			    )  AS approve_status_name : String

            ,   cam.approval_title                              /* title !!! */

            ,   pam.net_price_document_type_code                /* 단가문서유형코드 */
            ,   (SELECT cd.code_name
                   FROM CM_CODE_LNG AS cd
                  WHERE cd.tenant_id   = cam.tenant_id
                    AND cd.group_code  = 'SP_DOCUMENT_TYPE'
                    AND cd.language_cd = ssi.LANGUAGE_CODE
               	    AND cd.code        = pam.net_price_document_type_code
			    )  AS net_price_document_type_name : String

            ,   pam.net_price_source_code           
            ,   (SELECT cd.code_name
                   FROM CM_CODE_LNG AS cd
                  WHERE cd.tenant_id   = cam.tenant_id
                    AND cd.group_code  = 'NET_PRICE_SOURCE_CODE'
                    AND cd.language_cd = ssi.LANGUAGE_CODE
               	    AND cd.code        = pam.net_price_source_code
			    )  AS net_price_source_name : String


			,   CASE WHEN ssi.LANGUAGE_CODE = 'EN' THEN chd.department_english_name
			         WHEN ssi.LANGUAGE_CODE = 'KO' THEN chd.department_local_name
					 ELSE chd.department_english_name
			    END AS requestor_teamnm : String         /* requestor team */

            ,   pam.local_create_dtm AS creation_date    /* creation date */

            ,   cam.approval_contents

            ,   MAP(pam.tentprc_flag,false,'N',true,'T') as net_price_type_code
            ,   (SELECT cd.code_name
                   FROM CM_CODE_LNG AS cd
                  WHERE cd.tenant_id   = cam.tenant_id
                    AND cd.group_code  = 'SP_NET_PRICE_TYPE'
                    AND cd.language_cd = ssi.LANGUAGE_CODE
               	    AND cd.code        = MAP(pam.tentprc_flag,false,'N',true,'T')
			    )  AS net_price_type_name 

        FROM SP_NP_NET_PRICE_APPROVAL_MST   pam
        
        INNER JOIN CM_SPP_USER_SESSION_VIEW  ssi
            ON ssi.TENANT_ID         = pam.tenant_id
           AND ssi.COMPANY_CODE      = pam.company_code

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
    /* 단가품의 상세 General 조회 View */
    view GeneralView as
        SELECT
                key pad.tenant_id		                /*	테넌트ID	*/
            ,	key pad.company_code		            /*	회사코드	*/
            ,	key pad.org_type_code		            /*	구매운영조직유형	*/
            ,	key pad.org_code		                /*	Operation Org   구매운영조직코드	*/
            ,	key pad.approval_number		            /*	품의번호	*/
            ,	key pad.item_sequence		            /*	품목순번	*/

            ,   (SELECT org.org_name
                   FROM CM_PUR_OPERATION_ORG  org
                  WHERE org.tenant_id     = pad.tenant_id
                    AND org.company_code  = pad.company_code
                    AND org.org_type_code = pad.org_type_code
                    AND org.org_code      = pad.org_code
			    ) AS org_name : String                  /*	구매운영조직코드 명	*/

            ,   pad.material_code	                    /*	Material Code	자재코드*/
            ,   pad.material_desc	                    /*	Description	    자재내역*/

            ,   pad.supplier_code	                    /*	Supplier Code	공급업체코드 */
            ,   sm.supplier_local_name	                /*	Supplier Name	*/
            ,   sm.supplier_english_name	            /*	Supplier Name(Eng)	*/

            ,   null as sd_mapping_no : String          //pad.sd_mapping_no	                /*	SD Mapping	*/
            ,   null as sd_file_group_no : String       //pad.sd_file_group_no	            /*	SD File	*/

            ,	pad.vendor_pool_code		            /*	Vendor Pool code    협력사풀코드 */
            ,   vpm.vendor_pool_local_name              /*  Vendor Pool         협력사풀 명 */
            ,   vpm.vendor_pool_english_name

            ,   pad.net_price_approval_reason_code	    /*	Reason code	*/
            ,   (SELECT code_name 
                   FROM CM_CODE_LNG 
                  WHERE tenant_id = pad.tenant_id
                    AND group_code = 'SP_NET_PRICE_REASON_CODE'
                    AND language_cd = ssi.LANGUAGE_CODE
                    AND code = pad.net_price_approval_reason_code
                ) as net_price_approval_reason_name : String               /*	Reason	*/

            ,   pad.market_code	                        /*	Market code 납선코드*/
            ,   (SELECT code_name 
                   FROM CM_CODE_LNG 
                  WHERE tenant_id = pad.tenant_id
                    AND group_code = 'DP_VI_MARKET_CODE'
                    AND language_cd = ssi.LANGUAGE_CODE
                    AND code = pad.market_code
                ) as market_name : String               /*	Market	*/
                 
            ,	pad.effective_start_date	            /*	유효시작일자	*/
            ,	pad.effective_end_date		            /*	유효종료일자	*/

            ,   pad.line_type_code	                    /*	Line Type Code	*/
            ,   (SELECT code_name 
                   FROM CM_CODE_LNG 
                  WHERE tenant_id = pad.tenant_id
                    AND group_code = 'LINE_TYPE'
                    AND language_cd = ssi.LANGUAGE_CODE
                    AND code = pad.line_type_code
                ) as line_type_name : String            /*	Line Type	*/

            ,   pad.uom_code	                        /*	UOM	*/

            ,   npm.currency_code as curr_currency_code : String    /*	(현재)Currency	*/
            ,   npm.net_price as curr_net_price : Decimal(34,10)          /*	(현재)Price	*/

            ,   pad.currency_code	                    /*	(New)Currency	*/
            ,   pad.net_price                           /*	(New)Price	*/

            //,   TO_VARCHAR((ROUND(((npm.net_price)/pad.net_price),2,ROUND_HALF_UP))*100)
            ,   null as change_rate	                    : String   /*	변동비율(%) 이전단가 대비 변동비 net_price 	*/

            ,   null as royalty	                        : String //pad.royalty	                    /*	로열티	*/
            ,   null as pcst	                        : String //pad.pcst	                        /*	임가공비	*/
            ,   null as depreciation	                : String //pad.depreciation	                /*	감상비	*/
            ,   null as etc_cost	                    : String //pad.etc_cost	                    /*	기타	*/
            ,   null as lowest_part_flag	            : String //pad.lowest_part_flag	            /*	최저가Part여부	*/
            ,   null as import_po_type	                : String //pad.import_po_type	            /*	Import PO 유형	*/

            ,   pad.surrogate_type_code	                /*	Surrogate code	*/
            ,   (SELECT code_name 
                   FROM CM_CODE_LNG 
                  WHERE tenant_id = pad.tenant_id
                    AND group_code = 'SURROGATE'
                    AND language_cd = ssi.LANGUAGE_CODE
                    AND code = pad.surrogate_type_code
                ) as surrogate_type_name : String       /*	Surrogate	*/

            ,   pad.maker_code	                    /*	Maker code	*/
            ,   null as maker_name	                    : String //pad.maker_name	                    /*	Maker	*/

            ,   pad.payterms_code	                /*	Payment Term Code	*/
            ,   (SELECT code_name 
                   FROM CM_CODE_LNG 
                  WHERE tenant_id = pad.tenant_id
                    AND group_code = 'PAYMENT_TERMS'
                    AND language_cd = ssi.LANGUAGE_CODE
                    AND code = pad.payterms_code
                ) as payterms_name : String         /*	Payment Term	*/

            ,   pad.net_price_agreement_sign_flag	/*	(단가합의) 여부	*/
            ,   pad.net_price_agreement_status_code	/*	(Supplier Agreement) Status code	*/

            ,   null as net_price_agreement_status_name	: String //pad.net_price_agreement_status_name	/*	(Supplier Agreement) Status	*/

            ,   pad.incoterms	                    /*	Incoterms Code	*/
            ,   (SELECT code_name 
                   FROM CM_CODE_LNG 
                  WHERE tenant_id = pad.tenant_id
                    AND group_code = 'OP_INCOTERMS'
                    AND language_cd = ssi.LANGUAGE_CODE
                    AND code = pad.incoterms
                ) as incoterms_name : String         /*	Incoterms	*/

            ,   pad.quality_certi_flag	            /*	부품인정여부	*/

        FROM SP_NP_NET_PRICE_APPROVAL_DTL pad

        INNER JOIN CM_SPP_USER_SESSION_VIEW  ssi
            ON pad.tenant_id        = ssi.TENANT_ID
           AND pad.company_code     = ssi.COMPANY_CODE

        LEFT JOIN SP_NP_NET_PRICE_MST npm             /*  기준단가 마스터 */
                ON pad.tenant_id        = npm.tenant_id
               AND pad.company_code     = npm.company_code
               AND pad.org_type_code    = npm.org_type_code
               AND pad.org_code         = npm.org_code

               AND pad.supplier_code    = npm.supplier_code
               AND pad.material_code    = npm.material_code
               AND pad.market_code      = npm.market_code
               AND npm.effective_start_date <= TO_VARCHAR (NOW(), 'YYYYMMDD')
               AND npm.effective_end_date >= TO_VARCHAR (NOW(), 'YYYYMMDD')

        LEFT JOIN SP_SM_SUPPLIER_MST sm    /*  공급업체명 확인필요 */
                ON pad.tenant_id        = sm.tenant_id
               AND pad.supplier_code    = sm.supplier_code

        LEFT JOIN PG_VP_VENDOR_POOL_MST vpm
                ON pad.tenant_id        = vpm.tenant_id
               AND pad.company_code     = vpm.company_code
               AND pad.org_type_code    = vpm.org_type_code
               AND pad.org_code         = vpm.org_code
               AND pad.vendor_pool_code = vpm.vendor_pool_code
    ;


    /*---------------------------------------------------------------------------------------------------------------------*/
    /* @(title : '단가품의 상세 BasePriceInfo 조회 View') */
    view BasePriceInfoView as
        SELECT
                key pad.tenant_id		                        /*	테넌트ID	*/
            ,	key pad.company_code		                    /*	회사코드	*/
            ,	key pad.org_type_code		                    /*	구매운영조직유형	*/
            ,	key pad.org_code		                        /*	구매운영조직코드	*/
            ,	key pad.approval_number		                    /*	품의번호	*/
            ,	key pad.item_sequence		                    /*	품목순번	*/

            ,   (SELECT org.org_name
                   FROM CM_PUR_OPERATION_ORG  org
                  WHERE org.tenant_id     = pad.tenant_id
                    AND org.company_code  = pad.company_code
                    AND org.org_type_code = pad.org_type_code
                    AND org.org_code      = pad.org_code
			    ) AS org_name : String                  /*	구매운영조직코드 명	*/     

            ,   pad.material_code	                    /*	Material Code	자재코드*/
            ,   pad.supplier_code	                    /*	Supplier Code	공급업체코드 */
            ,   sm.supplier_local_name	                /*	Supplier Name	*/
            ,   sm.supplier_english_name	            /*	Supplier Name(Eng)	*/

            ,   pad.currency_code
            ,   pad.net_price

            ,   pad.base_price_type_code                /*  기준단가유형코드    */
            ,   pad.pyear_dec_base_currency_code        /*  전년12월기준통화코드    */	
            ,   pad.pyear_dec_base_price                /*  전년12월기준단가    */	
            ,   pad.pyear_dec_ci_rate                   /*  전년12월CI비율    */	
            ,   pad.quarter_base_currency_code          /*  분기기준통화코드    */	
            ,   pad.quarter_base_price                  /*  분기기준단가    */	
            ,   pad.quarter_ci_rate                     /*  분기CI비율    */	
   
        FROM SP_NP_NET_PRICE_APPROVAL_DTL   pad

        LEFT JOIN SP_SM_SUPPLIER_MST sm    /*  공급업체명 확인필요 */
                ON pad.tenant_id        = sm.tenant_id
               AND pad.supplier_code    = sm.supplier_code

    ;



    /*---------------------------------------------------------------------------------------------------------------------*/
    /* @(title : '단가품의 상세 Nego History Info 조회 View') */
    view NegoHistoryInfoView  as
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

            ,	pad.vendor_pool_code		    /*	협력사풀코드	*/
            ,   vpm.vendor_pool_local_name 
            ,   vpm.vendor_pool_english_name    /*  협력사풀 명 확인필요 */
            
            ,	pad.net_price_approval_reason_code		/*	단가품의사유코드	*/
            
        FROM SP_NP_NET_PRICE_APPROVAL_DTL   pad

        LEFT JOIN SP_SM_SUPPLIER_MST sm    /*  공급업체명 확인필요 */
                ON sm.tenant_id     = pad.tenant_id
               AND sm.supplier_code  = pad.supplier_code

        LEFT JOIN PG_VP_VENDOR_POOL_MST vpm
                ON vpm.tenant_id        = pad.tenant_id
               AND vpm.company_code     = pad.company_code
               AND vpm.org_type_code    = pad.org_type_code
               AND vpm.org_code         = pad.org_code
               AND vpm.vendor_pool_code = pad.vendor_pool_code
    ;




/*---------------------------------------------------------------------------------------------------------------------*/
    /* 파라미터 테스트  */
    view NegoHistoryInfoTestView (Language_code: String) as
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

            ,	pad.vendor_pool_code		    /*	협력사풀코드	*/
            ,   vpm.vendor_pool_local_name 
            ,   vpm.vendor_pool_english_name    /*  협력사풀 명 확인필요 */
            
            ,	pad.net_price_approval_reason_code		/*	단가품의사유코드	*/
            
        FROM SP_NP_NET_PRICE_APPROVAL_DTL   pad

        LEFT JOIN SP_SM_SUPPLIER_MST sm    /*  공급업체명 확인필요 */
                ON sm.tenant_id     = pad.tenant_id
               AND sm.supplier_code  = pad.supplier_code

        LEFT JOIN PG_VP_VENDOR_POOL_MST vpm
                ON vpm.tenant_id        = pad.tenant_id
               AND vpm.company_code     = pad.company_code
               AND vpm.org_type_code    = pad.org_type_code
               AND vpm.org_code         = pad.org_code
               AND vpm.vendor_pool_code = pad.vendor_pool_code
    ;


}