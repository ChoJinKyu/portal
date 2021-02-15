namespace sp;

//cds-service sourcing-service.cds
using {sp.Sc_Nego_Headers} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Headers_View} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Workbench_View} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Workbench_View2} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Item_Prices,sp.Sc_Nego_Item_Prices_View} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_ITEM_PRICES-model';
using {sp.Sc_Nego_Suppliers} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_SUPPLIERS-model';
using {sp.Sc_Nego_Suppliers_View} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_SUPPLIERS-model';
using {sp.Sc_Nego_Item_Non_Price} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_ITEM_NON_PRICE-model';
using {sp.Sc_Nego_Item_Non_Price_Dtl} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_ITEM_NON_PRICE_DTL-model';
using {sp.Sc_Nego_Headers_New_Record_View} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS_NEW_RECORD_VIEW-model';
/* using {
    sp.Sc_Outcome_Code as scOutcomeCode,
    sp.Sc_Nego_Type_Code as scNegoTypeCode,
    sp.Sc_Nego_Parent_Type_Code as scNegoParentTypeCode,
    sp.Sc_Award_Type_Code_View as scAwardTypeCodeView,
    sp.Sc_Nego_Prog_Status_Code_View as scNegoProgStatusCodeView,
} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_MASTERS-model'; */


// using {cm.Dummy}         from '../../../../../db/cds/cm/CM_DUMMY-model';
using {sp.Sc_Session_Local_Func} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_USER_DEFINED_FUNCTION-model.cds';


@path : '/sp.sourcingService'
service SourcingService {

    ///////////////////////////////////////////// Nego Header /////////////////////////////////////////////
    /* 협상에 대한 헤더 정보(네고종류, 네고산출물, Award유형, 개설일자, 마감일자, 오리엔테이션정보 등)를 관리한다. */
    entity NegoHeaders @(title : '협상헤더정보')                    as projection on Sc_Nego_Headers{ *,
        Items : redirected to NegoItemPrices
    };
    /* 협상에 대한 헤더 정보의 신규 레코드 초기 값 레코드를 생성한다. */
    entity NegoHeadersNewRecordView @(title : '협상헤더정보-신규레코드') as projection on Sc_Nego_Headers_New_Record_View;
    /* 협상에 대한 헤더 정보(네고종류, 네고산출물, Award유형, 개설일자, 마감일자, 오리엔테이션정보 등)를 관리한다.(+계산항목) */
    entity NegoHeadersView @(title : '협상헤더정보(+계산항목)')          as projection on Sc_Nego_Headers_View { *,
        Items : redirected to NegoItemPrices
    }
    //  actions {
    //     action deepInsertNegoHeader(  negoheader     : array of tyNegoHeader
    //                                 , negoitemprices : array of tyNegoItemPrice
    //                                 , negosuppliers  : array of tyNegoSupplier  ) returns array of OutputData;
    // }
    ;

    ///////////////////////////////////////////// Nego Item Prices + Suppliers////////////////////////////////
    /* 협상을 요청하기 위한 아이템의 가격정보를 관리한다. */
    entity NegoItemPrices @(title : '협상아이템정보')                as projection on Sc_Nego_Item_Prices_View{ *,
        Header : redirected to NegoHeadersView
    };
    // @(title : 'Negotiation(견적&입찰) Workbench 정형뷰') 
    entity NegoWorkbenchView @(title : '협상워크벤치목록')    as projection on Sc_Nego_Workbench_View;

    /* 협상을 요청하기 위한 아이템별 협력업체정보를 관리한다. */
    entity NegoSuppliers @(title : '협상아이템업체정보')               as projection on Sc_Nego_Suppliers_View{ *,
        Item : redirected to NegoItemPrices
    };
    
    ///////////////////////////////////////////// Nego Non-Price /////////////////////////////////////////////
    entity NegoItemNonPrice    @(title : '협상비가격정보')     as projection on Sc_Nego_Item_Non_Price{ *,
        Header : redirected to NegoHeadersView
    };
    entity NegoItemNonPriceDtl @(title : '협상비가격정보상세') as projection on Sc_Nego_Item_Non_Price_Dtl;
    



    
    //////////////////////////////////////////////////////////////////////////////
    // Test Begin
    entity NegoWorkbenchView2 as projection on Sc_Nego_Workbench_View2{ *,
        Items : redirected to NegoItemPrices
    };
    view NegoWorkbenchViewMy as select *,
        // SP_SC_MY_SESSION( ).tenant_id as my_tenant_id :String(5)
        // SP_SC_SESSION_LOCAL_FUNC(TENANT_ID: wv.tenant_id).locale_lg as locale_lg :String(2)
        
        OP_PU_PR_TEMPLATE_NUMBERS_FUNC( wv.tenant_id, 'TCT1001' ) as  pr_template_numbers1: String(1000)
        from Sc_Nego_Workbench_View as wv
    ;
    
    // #V2 Header =+ Items 미작동 | Items =+ Header 작동 
    // view NegoItemPricesStatusView as select from Sc_Nego_Item_Prices distinct {
        /* 
    view NegoItemPricesStatusView as select from Sc_Nego_Item_Prices {
        key tenant_id,
        key nego_header_id,
        key nego_item_number,
		    pr_approve_number,
		    Header.nego_document_number,
		    Header.nego_document_round,
		    Header.nego_progress_status_code,
		    Header.award_progress_status_code,
		    Header.reply_times,
		    Header.nego_progress_status.nego_progress_status_name,
		    Header.award_progress_status.award_progress_status_name
    };
 */
    entity NegoItemPricesStatusView as projection on Sc_Nego_Item_Prices {
        key tenant_id,
        key nego_header_id,
        key nego_item_number,
		    pr_approve_number,
		    Header.nego_document_number,
		    Header.nego_document_round,
		    Header.nego_progress_status_code,
		    Header.award_progress_status_code,
		    Header.reply_times,
		    Header.nego_progress_status.nego_progress_status_name,
		    Header.award_progress_status.award_progress_status_name
    };
        
    // where tenant_id = SP_SC_MY_SESSION( ).tenant_id
/* 
    entity NegoSessionUDF    as select from Dummy {
        Sc_My_Session().locale_lg, 
        Sc_My_Session().locale, 
        Sc_My_Session().locale_sap, 
        Sc_My_Session().tenant_id
    };
     */

    // Test End
    //////////////////////////////////////////////////////////////////////////////
}