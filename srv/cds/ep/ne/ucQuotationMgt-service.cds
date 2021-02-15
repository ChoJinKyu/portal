using {ep as quotationMst} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_MST-model';
using {ep as quotationDtl} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_DTL-model';
using {ep as quotationCost} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_COST-model';
using {ep as quotationExtra} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_EXTRA-model';
using {ep as costItem} from '../../../../db/cds/ep/ne/EP_UC_COST_ITEM-model';

using { ep as ucQuotationListView} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_LIST_VIEW-model';
using { ep as ucQuotationDtlView} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_DTL_VIEW-model';
using { ep as getUcApprovalDtlView} from '../../../../db/cds/ep/ne/EP_GET_UC_APPROVAL_DTL_VIEW-model';
using { ep as getItemClassView} from '../../../../db/cds/ep/ne/EP_UC_ITEM_CLASS-model';
using { ep as ucApprovalExtraRateView} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_EXTRA_RATE_VIEW-model';
using { ep as ucQuotationExtraRateView} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_EXTRA_RATE_VIEW-model';
using { ep as ucQuotationExtraRateDetailView} from '../../../../db/cds/ep/ne/EP_UC_QUOTATION_EXTRA_RATE_DETAIL_VIEW-model';

using { ep as ucApprovalMst} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_MST-model';
using { ep as ucApprovalDtl} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_DTL-model';
using { ep as ucApprovalSupplier} from '../../../../db/cds/ep/ne/EP_UC_APPROVAL_SUPPLIER-model';

namespace ep;

@path : 'ep.UcQuotationMgtService'
service UcQuotationMgtService {
    entity UcQuotationMst   as projection on quotationMst.Uc_Quotation_Mst;
    entity UcQuotationDtl   as projection on quotationDtl.Uc_Quotation_Dtl;
    entity UcQuotationCost  as projection on quotationCost.Uc_Quotation_Cost;
    entity UcQuotationExtra as projection on quotationExtra.Uc_Quotation_Extra;
    entity UcCostItem       as projection on costItem.Uc_Cost_Item;

    entity UcQuotationListView as projection on ucQuotationListView.Uc_Quotation_List_View;
    entity UcQuotationDtlView as projection on ucQuotationDtlView.Uc_Quotation_Dtl_View;
    entity GetUcApprovalDtlView as projection on getUcApprovalDtlView.Get_Uc_Approval_Dtl_View;
    entity UcApprovalExtraRateView as projection on ucApprovalExtraRateView.Uc_Approval_Extra_Rate_View;
    entity GetUcItemClassView as projection on getItemClassView.Uc_Item_Class;
    entity UcQuotationExtraRateView as projection on ucQuotationExtraRateView.Uc_Quotation_Extra_Rate_View;
    entity UcQuotationExtraRateDetailView as projection on ucQuotationExtraRateDetailView.Uc_Quotation_Extra_Rate_Detail_View;



    // 대분류(공종) View
     view ItemClassView @(title : '대분류(공종) View') as 
         select
         key tenant_id,                         //테넌트ID
         key company_code,                      //회사코드
         key ep_item_class_code as code,        //설비공사용품목분류코드
             ep_item_class_name as name         //설비공사용품목분류명
         from GetUcItemClassView
         where
             level_number = 1;

    view UcContractDtlView (tenant_id : String, company_code : String, org_code : String, supplier_code : String, large_item_class_code : String, const_start_date : Date) as
    select 
        ep_item_code : String(50)
        , item_desc : String(200)  
        , spec_desc : String(1000)  
        , unit : String(3) 
        , material_net_price : Decimal  
        , labor_net_price : Decimal   
        , net_price_contract_title : String(100) 
        , net_price_contract_start_date : Date 
        , net_price_contract_end_date : Date
        , net_price_contract_period : String(100) 
        , currency_code : String(50) 
        , currency_name : String(50) 
        , material_apply_flag : Boolean
        , labor_apply_flag : Boolean
        , net_price_change_allow_flag : Boolean
        , remark : String(3000) 
        , expiration_flag : Boolean
        , tenant_id : String(5) 
        , company_code : String(10) 
        , key net_price_contract_document_no : String(50) 
        , key net_price_contract_degree : Integer64
        , key net_price_contract_item_number : String(50) 
        , item_sequence : Decimal
        , supplier_code : String(10) 
    from (
        select
            dtl.ep_item_code	                                           
            ,dtl.item_desc                                                  
            ,dtl.spec_desc	                                             
            ,dtl.unit	                                                
            ,dtl.material_net_price	                                       
            ,dtl.labor_net_price 	                                      
            ,mst.net_price_contract_title	                               
            ,coalesce(mst.effective_start_date,mst.net_price_contract_start_date) as net_price_contract_start_date	                           
            ,coalesce(mst.effective_end_date,mst.net_price_contract_end_date) as net_price_contract_end_date	                         
            ,mst.net_price_contract_start_date ||' ~ '|| mst.net_price_contract_end_date as net_price_contract_period 
            ,coalesce(dtl.currency_code, '') as currency_code               
            ,dtl.currency_code as currency_name                           
            ,dtl.material_apply_flag                                     
            ,dtl.labor_apply_flag                                          
            ,dtl.net_price_change_allow_flag                               
            ,dtl.remark   
            ,(case when days_between(:const_start_date, coalesce(mst.effective_start_date,mst.net_price_contract_start_date)) > 0 then true 
                    else (case when days_between(:const_start_date, coalesce(mst.effective_end_date,mst.net_price_contract_end_date)) < 0 then true 
                            else false end) end) as expiration_flag                                                               
            ,dtl.tenant_id
            ,dtl.company_code
            ,dtl.net_price_contract_document_no            
            ,dtl.net_price_contract_degree           
            ,dtl.net_price_contract_item_number   
            ,dtl.local_create_dtm
            ,dtl.local_update_dtm
            ,dtl.create_user_id
            ,dtl.update_user_id
            ,dtl.system_create_dtm
            ,dtl.system_update_dtm
            ,dtl.item_sequence
            ,sup.supplier_code
        from ucApprovalMst.Uc_Approval_Mst as mst
        inner join ucApprovalDtl.Uc_Approval_Dtl as dtl
        on mst.tenant_id = dtl.tenant_id
        and mst.company_code = dtl.company_code
        and mst.net_price_contract_document_no = dtl.net_price_contract_document_no
        and mst.net_price_contract_degree = dtl.net_price_contract_degree
        and mst.use_flag = true 
        and dtl.use_flag = true
        and ifnull(mst.net_price_contract_chg_type_cd,'C') != 'D' /* 종료계약 제외 */
        and ifnull(dtl.net_price_contract_chg_type_cd,'C') != 'D' /* 종료계약 제외 */
        /* 유효기간으로 체크하므로 현재 계약 사용하면 안됨 */
        and mst.net_price_contract_start_date <= CURRENT_DATE /* 대기상태 계약 제외 */
        and mst.net_price_contract_status_code = '711040' /* 계약 결재완료 건*/
        and mst.tenant_id = :tenant_id
        and mst.company_code = :company_code        
        and mst.org_code = :org_code        
        inner join ucApprovalSupplier.Uc_Approval_Supplier as sup
        on mst.tenant_id = sup.tenant_id
        and mst.company_code = sup.company_code
        and mst.net_price_contract_document_no = sup.net_price_contract_document_no
        and mst.net_price_contract_degree = sup.net_price_contract_degree
        and sup.supplier_code = :supplier_code
        and substring(dtl.ep_item_code,1,1) = :large_item_class_code

    ) as A
    ;



}
