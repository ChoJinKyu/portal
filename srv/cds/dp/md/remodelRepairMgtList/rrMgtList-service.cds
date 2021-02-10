using { dp as asset } from '../../../../../db/cds/dp/md/DP_MD_ASSET-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model'; 
using { dp as item } from '../../../../../db/cds/dp/md/DP_MD_REPAIR_ITEM-model'; 
using { cm as codeLng } from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using { cm as sppUserSession} from '../../../../../db/cds/cm/util/CM_SPP_USER_SESSION_VIEW-model';
using { cm as purOrg } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using { cm as purMapping } from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using { sp as supplier} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';

namespace dp;
@path : '/dp.RrMgtListService' 
service RrMgtListService {

    /**
     * @description : Remodel/Repair Management List 
     * @author      : jinseon.lee 
     * @date        : 2021.02.09 
     */
    view remodelRepairList as 
     select key mst.tenant_id 
	    , key item.repair_request_number 
	    , mst.mold_id 
	    , '['|| mst.org_code || '] '|| f.org_name as org_name  : String(240)
	     , mst.model 
	     , mst.mold_number 
	     , mst.mold_sequence  
	    , ass.class_desc  
	    , item.create_user_id 
	    , item.repair_request_date 
	    , item.repair_reason 
	    , case when item.repair_progress_status_code = 'RB' 
               then item.repair_request_date
	    	   else item.repair_complete_date 
          end as request_receipt_date : String(240)
	    , item.repair_desc  /* Subject */
	    , item.repair_progress_status_code 
	    , lng.code_name as repair_progress_status_code_nm 
	    , item.mold_moving_plan_date  
	    , item.mold_moving_result_date  
	    , item.mold_complete_plan_date  
	    , item.mold_complete_result_date  

	    , mst.mold_production_type_code 
	    , mst.mold_mfger_code 
	    , mst.supplier_code 
	    , mst.production_supplier_code  

	from item.Md_Repair_Item item 
	join moldMst.Md_Mst mst  on mst.mold_id = item.mold_id and mst.tenant_id = item.tenant_id
	join  asset.Md_Asset ass on mst.mold_id = ass.mold_id and mst.tenant_id = ass.tenant_id 
	left join purOrg.Pur_Operation_Org f on f.org_code = mst.org_code and f.company_code=mst.company_code
    inner join purMapping.Pur_Org_Type_Mapping j on f.tenant_id = j.tenant_id and f.org_type_code = j.org_type_code and j.process_type_code='DP05' 
    join codeLng.Code_Lng lng on lng.code = item.repair_progress_status_code and lng.tenant_id = item.tenant_id and lng.group_code = 'DP_MD_REPAIR_PROGRESS_STATUS' and lng.language_cd = 'KO'
    left join supplier.Sm_Supplier_Mst sup on sup.tenant_id = mst.tenant_id and sup.supplier_code = mst.mold_mfger_code
    left join supplier.Sm_Supplier_Mst sup2 on sup2.tenant_id = mst.tenant_id and sup2.supplier_code = mst.supplier_code
    left join supplier.Sm_Supplier_Mst sup3 on sup3.tenant_id = mst.tenant_id and sup3.supplier_code = mst.production_supplier_code
    ;





    /**
    * @description : Remodel/Repair Management List 상세 
    * @author      : jinseon.lee 
    * @date    : 2021.02.09 
    */
    view remodelRepairDetail as
        select
            key mst.tenant_id,
            key mst.mold_id,
            key item.repair_request_number,
                item.create_user_id,
                item.repair_request_date,
                item.repair_desc,
                item.repair_reason,
                mst.model,
                mst.mold_number,
                mst.mold_sequence,
                ass.class_desc,
                mst.mold_production_type_code,
                (
                    select l.code_name from codeLng.Code_Lng l
                    join sppUserSession.Spp_User_Session_View ses
                        on (
                            l.tenant_id = ses.TENANT_ID
                            and l.language_cd = ses.LANGUAGE_CODE
                        )
                    where
                        l.group_code = 'DP_MD_PROD_TYPE'
                        and l.code = mst.mold_production_type_code
                        and l.tenant_id = mst.tenant_id
                )  as mold_production_type_code_nm : String(240), 
                   mst.mold_item_type_code,
                (
                    select l.code_name from codeLng.Code_Lng l 
                     join sppUserSession.Spp_User_Session_View ses
                        on (
                            l.tenant_id = ses.TENANT_ID
                            and l.language_cd = ses.LANGUAGE_CODE
                        )
                    where
                            l.group_code  = 'DP_MD_ITEM_TYPE'
                        and l.code        = mst.mold_item_type_code
                        and l.tenant_id   = mst.tenant_id
                ) as mold_item_type_code_nm       : String(240),
                mst.mold_mfger_code ,
                sup.supplier_local_name as mold_mfger_code_nm : String(240) ,
                mst.supplier_code ,
                sup2.supplier_local_name as supplier_code_nm : String(240) ,
                mst.production_supplier_code, 
                sup3.supplier_local_name as production_supplier_code_nm : String(240),
                item.mold_moving_plan_date,
                item.mold_moving_result_date,
                item.mold_complete_plan_date,
                item.mold_complete_result_date
        from item.Md_Repair_Item item
        join moldMst.Md_Mst mst on mst.mold_id = item.mold_id and mst.tenant_id = item.tenant_id
        join asset.Md_Asset ass on mst.mold_id = ass.mold_id and mst.tenant_id = ass.tenant_id
        left join supplier.Sm_Supplier_Mst sup on sup.tenant_id = mst.tenant_id and sup.supplier_code = mst.mold_mfger_code
        left join supplier.Sm_Supplier_Mst sup2 on sup2.tenant_id = mst.tenant_id and sup2.supplier_code = mst.supplier_code
        left join supplier.Sm_Supplier_Mst sup3 on sup3.tenant_id = mst.tenant_id and sup3.supplier_code = mst.production_supplier_code
         ;

    /**
    * @description : Remodel/Repair Management List New 
    * @author      : jinseon.lee 
    * @date    : 2021.02.09 
    */
    view remodelRepairNew as
        select
            key mst.tenant_id,
            key mst.mold_id,
                '' as repair_request_number        : String(240),
                '' as create_user_id               : String(240),
                '' as repair_request_date          : String(240),
                '' as repair_desc                  : String(240),
                '' as repair_reason                : String(240),
                mst.model,
                mst.mold_number,
                mst.mold_sequence,
                ass.class_desc,
                mst.mold_production_type_code,
                (
                    select l.code_name from codeLng.Code_Lng l
                    join sppUserSession.Spp_User_Session_View ses
                        on (
                            l.tenant_id = ses.TENANT_ID
                            and l.language_cd = ses.LANGUAGE_CODE
                        )
                    where
                        l.group_code = 'DP_MD_PROD_TYPE'
                        and l.code = mst.mold_production_type_code
                        and l.tenant_id = mst.tenant_id
                )  as mold_production_type_code_nm : String(240),
                mst.mold_item_type_code,
                (
                    select l.code_name from codeLng.Code_Lng l 
                     join sppUserSession.Spp_User_Session_View ses
                        on (
                            l.tenant_id = ses.TENANT_ID
                            and l.language_cd = ses.LANGUAGE_CODE
                        )
                    where
                            l.group_code  = 'DP_MD_ITEM_TYPE'
                        and l.code        = mst.mold_item_type_code
                        and l.tenant_id   = mst.tenant_id
                ) as mold_item_type_code_nm       : String(240),
                mst.mold_mfger_code,
                sup.supplier_local_name as mold_mfger_code_nm : String(240), 
                mst.supplier_code,
                sup2.supplier_local_name as supplier_code_nm : String(240),
                mst.production_supplier_code,
                sup3.supplier_local_name as production_supplier_code_nm : String(240),
                null as mold_moving_plan_date        : String(240),
                null as mold_moving_result_date      : String(240),
                null as mold_complete_plan_date      : String(240),
                null as mold_complete_result_date    : String(240)
        from moldMst.Md_Mst mst
        join asset.Md_Asset ass  on mst.mold_id = ass.mold_id and mst.tenant_id = ass.tenant_id
        left join supplier.Sm_Supplier_Mst sup on sup.tenant_id = mst.tenant_id and sup.supplier_code = mst.mold_mfger_code
        left join supplier.Sm_Supplier_Mst sup2 on sup2.tenant_id = mst.tenant_id and sup2.supplier_code = mst.supplier_code
        left join supplier.Sm_Supplier_Mst sup3 on sup3.tenant_id = mst.tenant_id and sup3.supplier_code = mst.production_supplier_code
        ;










} 