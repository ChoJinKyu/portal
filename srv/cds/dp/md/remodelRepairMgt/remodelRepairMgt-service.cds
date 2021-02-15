using { dp as repairMstAssetView } from '../../../../../db/cds/dp/md/DP_MD_REPAIR_MST_ASSET_VIEW-model';
using { dp as repairItem } from '../../../../../db/cds/dp/md/DP_MD_REPAIR_ITEM-model';
using { dp as moldMstAssetSpecView } from '../../../../../db/cds/dp/md/DP_MD_MST_ASSET_SPEC_VIEW-model';
using { dp as moldMst } from '../../../../../db/cds/dp/md/DP_MD_MST-model';
using { dp as moldMstSpecView } from '../../../../../db/cds/dp/md/DP_MD_MST_SPEC_VIEW-model';

using { cm as orgMapping} from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using { cm as Org} from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';
using { cm as sppUserSession} from '../../../../../db/cds/cm/util/CM_SPP_USER_SESSION_VIEW-model';
using { sp as supplier} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';
using { dp as asset } from '../../../../../db/cds/dp/md/DP_MD_ASSET-model';
using { cm as user}  from '../../../../../db/cds/cm/CM_USER-model';


namespace dp;
@path : '/dp.RemodelRepairMgtService'
service RemodelRepairMgtService {

    entity RepairMstAssetView as projection on repairMstAssetView.Md_Repair_Mst_Asset_View;
    entity RepairItem as projection on repairItem.Md_Repair_Item;
    entity MoldMstAssetSpecView as projection on moldMstAssetSpecView.Md_Mst_Asset_Spec_View;
    entity MoldMasterSpec as projection on moldMstSpecView.Md_Mst_Spec_View;

    view Divisions as
    select key a.tenant_id       
            ,key a.company_code  
            ,key a.org_type_code 
            ,key a.org_code         
                ,a.org_name          
                ,a.purchase_org_code 
                ,a.plant_code        
                ,a.affiliate_code    
                ,a.bizdivision_code  
                ,a.bizunit_code      
                ,a.au_code           
                ,a.hq_au_code        
                ,a.use_flag  
    from Org.Pur_Operation_Org a  
    left join orgMapping.Pur_Org_Type_Mapping b
    on a.tenant_id=b.tenant_id
    and a.org_type_code=b.org_type_code
    where b.process_type_code='DP05';

    view Models as
    select distinct key a.tenant_id, key a.model
    from moldMst.Md_Mst a
    where a.model is not null;

    view PartNumbers as
    select distinct key a.tenant_id, key a.mold_number, a.spec_name, a.mold_item_type_name
    from moldMstSpecView.Md_Mst_Spec_View a
    where a.mold_number is not null;

    /** 협력사용 Remodel Repair Supplier */  
    /**
     * @description : Remodel/Repair Management List 
     * @author      : jinseon.lee 
     * @date        : 2021.02.09 
     */
    view remodelRepairList as 
     select key mst.tenant_id 
	    , key item.repair_request_number 
	    , mst.mold_id 
        , mst.org_code
        , mst.company_code 
	    , '['|| mst.org_code || '] '|| f.org_name as org_name  : String(240)
	    , mst.model 
	    , mst.mold_number 
	    , mst.mold_sequence     
	    , mst.spec_name   
	    , item.create_user_id 
	    , item.repair_request_date  
	    , case when item.repair_progress_status_code = 'RB' 
               then item.repair_request_date
	    	   else item.repair_complete_date 
          end as request_receipt_date : String(240)
	    , item.repair_desc  /* Subject */
	    , item.repair_progress_status_code 
        , CM_GET_CODE_NAME_FUNC(item.tenant_id , 'DP_MD_REPAIR_PROGRESS_STATUS', item.repair_progress_status_code, ses.LANGUAGE_CODE) as repair_progress_status_code_nm : String(240)
	    , cast(item.mold_moving_plan_date as Date ) as mold_moving_plan_date : Date  
	    , cast(item.mold_moving_result_date  as Date ) as mold_moving_result_date : Date 
	    , cast(item.mold_complete_plan_date  as Date ) as mold_complete_plan_date : Date 
	    , cast(item.mold_complete_result_date  as Date ) as mold_complete_result_date : Date 
	    , mst.mold_production_type_code 
	    , mst.mold_mfger_code  /* Mold Supplier */ 
        , sup.supplier_local_name as mold_mfger_code_nm : String(240) 
	    , mst.supplier_code     /* Order Supplier */
        , sup2.supplier_local_name as supplier_code_nm : String(240)
	    , mst.production_supplier_code  /* Prod Supplier */
        , sup3.supplier_local_name as production_supplier_code_nm : String(240) 
        , ass.asset_status_code         /* Asset Status */
        , CM_GET_CODE_NAME_FUNC(item.tenant_id, 'DP_MD_ASSET_STATUS', ass.asset_status_code , ses.LANGUAGE_CODE) as asset_status_code_nm : String(240)
        , ass.asset_type_code        /* Asset Type */
        , CM_GET_CODE_NAME_FUNC(item.tenant_id, 'DP_MD_ASSET_TYPE' , ass.asset_type_code , ses.LANGUAGE_CODE) as asset_type_code_nm : String(240) 
        , ass.asset_number         /* Asset no */
        , ifnull(mst.family_part_number_1,'')  
                || case  when mst.family_part_number_2 is null or mst.family_part_number_2 = '' then '' else ',' end || ifnull(mst.family_part_number_2,'') 
                || case  when mst.family_part_number_3 is null or mst.family_part_number_3 = '' then '' else ',' end || ifnull(mst.family_part_number_3,'')
                || case  when mst.family_part_number_4 is null or mst.family_part_number_4 = '' then '' else ',' end || ifnull(mst.family_part_number_4,'')
                || case  when mst.family_part_number_5 is null or mst.family_part_number_5 = '' then '' else ',' end || ifnull(mst.family_part_number_5,'') 
                        as family_part_number : String(300)        /* Family Part No */
        , item.repair_quotation_amount          /* Estimate Amount */
        , item.repair_amount                    /* Order Amount */
        , case when item.repair_progress_status_code = 'RA'     
               then item.reject_reason 
               when (item.repair_progress_status_code = 'RS' or item.repair_progress_status_code = 'RA') 
               then '' 
               else item.remark 
          end as lge_remark : String(3000)   /* LGE Remark  Request Status가 'RA' 이면
                                                DP_MD_REPAIR_ITEM.REJECT_REASON
                                                'RS', 'RA' 이면 공백
                                                else면 DP_MD_REPAIR_ITEM.REMARK */
        , item.repair_reason    /* Remark */
	from repairItem.Md_Repair_Item item 
    join sppUserSession.Spp_User_Session_View ses on item.tenant_id = ses.TENANT_ID 
	join moldMst.Md_Mst mst  on mst.mold_id = item.mold_id and mst.tenant_id = item.tenant_id
 	join  asset.Md_Asset ass on mst.mold_id = ass.mold_id and mst.tenant_id = ass.tenant_id   
	left join Org.Pur_Operation_Org f on f.org_code = mst.org_code and f.company_code=mst.company_code
    inner join orgMapping.Pur_Org_Type_Mapping j on f.tenant_id = j.tenant_id and f.org_type_code = j.org_type_code and j.process_type_code='DP05' 
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
                u.employee_name as user_local_name : String(240),
                u.english_employee_name as user_english_name : String(240),
                item.repair_request_date,
                item.repair_desc,
                item.repair_reason,
                mst.model,
                mst.org_code ,
                mst.company_code , 
                mst.mold_number,
                mst.mold_sequence,
                mst.spec_name,
                mst.mold_production_type_code, 
                CM_GET_CODE_NAME_FUNC(item.tenant_id, 'DP_MD_PROD_TYPE', mst.mold_production_type_code, ses.LANGUAGE_CODE) as mold_production_type_code_nm : String(240) ,
                item.repair_progress_status_code ,
                CM_GET_CODE_NAME_FUNC(item.tenant_id , 'DP_MD_REPAIR_PROGRESS_STATUS', item.repair_progress_status_code, ses.LANGUAGE_CODE) as repair_progress_status_code_nm : String(240) ,
                mst.mold_item_type_code,
                CM_GET_CODE_NAME_FUNC(item.tenant_id, 'DP_MD_ITEM_TYPE', mst.mold_item_type_code, ses.LANGUAGE_CODE) as mold_item_type_code_nm : String(240) ,   
                mst.mold_mfger_code ,
                sup.supplier_local_name as mold_mfger_code_nm : String(240) ,
                mst.supplier_code ,
                sup2.supplier_local_name as supplier_code_nm : String(240) ,
                mst.production_supplier_code, 
                sup3.supplier_local_name as production_supplier_code_nm : String(240),
                cast(item.mold_moving_plan_date as Date ) as mold_moving_plan_date : Date  ,
                cast(item.mold_moving_result_date  as Date ) as mold_moving_result_date : Date , 
                cast(item.mold_complete_plan_date  as Date ) as mold_complete_plan_date : Date ,
                cast(item.mold_complete_result_date  as Date ) as mold_complete_result_date : Date 
        from repairItem.Md_Repair_Item item 
        join sppUserSession.Spp_User_Session_View ses on item.tenant_id = ses.TENANT_ID 
        join moldMst.Md_Mst mst on mst.mold_id = item.mold_id and mst.tenant_id = item.tenant_id
      /*  join asset.Md_Asset ass on mst.mold_id = ass.mold_id and mst.tenant_id = ass.tenant_id */ 
        join user.User u on u.user_id = item.create_user_id and u.tenant_id = item.tenant_id
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
                mst.org_code ,
                mst.company_code , 
                mst.spec_name,
                mst.mold_production_type_code, 
                CM_GET_CODE_NAME_FUNC(mst.tenant_id ,'DP_MD_PROD_TYPE', mst.mold_production_type_code, ses.LANGUAGE_CODE) as mold_production_type_code_nm : String(240) ,
                mst.mold_item_type_code, 
                CM_GET_CODE_NAME_FUNC(mst.tenant_id, 'DP_MD_PROD_TYPE', mst.mold_item_type_code , ses.LANGUAGE_CODE) as mold_item_type_code_nm : String(240) ,
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
        join sppUserSession.Spp_User_Session_View ses on mst.tenant_id = ses.TENANT_ID 
       /* join asset.Md_Asset ass  on mst.mold_id = ass.mold_id and mst.tenant_id = ass.tenant_id */ 
        left join supplier.Sm_Supplier_Mst sup on sup.tenant_id = mst.tenant_id and sup.supplier_code = mst.mold_mfger_code
        left join supplier.Sm_Supplier_Mst sup2 on sup2.tenant_id = mst.tenant_id and sup2.supplier_code = mst.supplier_code
        left join supplier.Sm_Supplier_Mst sup3 on sup3.tenant_id = mst.tenant_id and sup3.supplier_code = mst.production_supplier_code
        ;


    
}
