//cds-service sourcing-v4-service.cds
using {sp.Sc_Nego_Headers} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Headers_View} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS-model';
using {sp.Sc_Nego_Item_Prices} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_ITEM_PRICES-model';
using {sp.Sc_Nego_Suppliers} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_SUPPLIERS-model';
using {sp.Sc_Nego_Headers_New_Record_View} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_HEADERS_NEW_RECORD_VIEW-model';
/* using {
    sp.Sc_Outcome_Code as scOutcomeCode,
    sp.Sc_Nego_Type_Code as scNegoTypeCode,
    sp.Sc_Nego_Parent_Type_Code as scNegoParentTypeCode,
    sp.Sc_Award_Type_Code_View as scAwardTypeCodeView,
    sp.Sc_Nego_Prog_Status_Code_View as scNegoProgStatusCodeView,
} from '../../../../../db/cds/sp/sc/SP_SC_NEGO_MASTERS-model'; */

namespace sp;

@path : '/sp.sourcingV4Service'
service SourcingV4Service {

    /* 협상에 대한 헤더 정보(네고종류, 네고산출물, Award유형, 개설일자, 마감일자, 오리엔테이션정보 등)를 관리한다. */
    entity NegoHeaders @(title : '협상헤더정보')                    as projection on Sc_Nego_Headers{ *,
        Items : redirected to NegoItemPrices
    };
    /* 협상을 요청하기 위한 아이템의 가격정보를 관리한다. */
    entity NegoItemPrices @(title : '협상아이템정보')                as projection on Sc_Nego_Item_Prices{ *,
        Header : redirected to NegoHeadersView
    };
    /* 협상을 요청하기 위한 아이템별 협력업체정보를 관리한다. */
    entity NegoSuppliers @(title : '협상아이템업체정보')               as projection on Sc_Nego_Suppliers{ *,
        Item : redirected to NegoItemPrices
    };
    /* 협상에 대한 헤더 정보의 신규 레코드 초기 값 레코드를 생성한다. */
    entity NegoHeadersNewRecordView @(title : '협상헤더정보-신규레코드') as projection on Sc_Nego_Headers_New_Record_View;


    view NegoWorkbenchView as select from Sc_Nego_Headers as Header {
        Header.nego_document_number             ,
        Header.nego_document_round              ,
        Header.nego_progress_status_code        ,
        Header.award_progress_status_code       ,
        Header.reply_times                      ,
        Header.supplier_count                   ,
        Header.supplier_participation_flag      ,
        Header.remaining_hours                  ,
        Header.nego_document_title              ,
        Header.items_count                      ,
        Header.nego_type_code                   ,
        Header.negotiation_style_code           ,
        Header.bidding_result_open_status_code  ,
        Header.negotiation_output_class_code    ,
        Items.pr_approve_number                 ,
        Items.req_submission_status             ,
        Items.req_reapproval                    ,
        Items.material_code                     ,
        Items.material_desc                     ,
        Items.requestor_empno                   ,
        Items.request_department_code           ,
        Header.award_type_code                  ,
        Header.buyer_empno                      ,
        Header.buyer_department_code            ,
        Header.open_date                        ,
        Header.closing_date                     ,
        Header.close_date_ext_enabled_hours     ,
        Header.close_date_ext_enabled_count     ,
        Header.actual_extension_count           ,
        Items.requisition_flag                  ,
        Items.price_submission_no               ,
        Items.price_submisstion_status          ,
        Header.local_create_dtm                 ,
        Items.interface_source                   
    };
        
    annotate NegoWorkbenchView with @( 
            title:'잔여시간추가',description:'잔여시간()=마감시간-현재시간)추가',readonly
    ) {
        nego_document_number             @title:'UI:Negotiation No'         ;
        nego_document_round              @title:'UI:Revision'               ;
        nego_progress_status_code        @title:'UI:Negotiation Status'     ;
        award_progress_status_code       @title:'UI:Award Status'           ;
        reply_times                      @title:'UI:회신횟수'                   ;
        supplier_count                   @title:'UI:협력사수'                   ;
        supplier_participation_flag      @title:'UI:Participation'          ;
        remaining_hours                  @title:'UI:잔여시간'                   ;
        nego_document_title              @title:'UI:Title'                  ;
        items_count                      @title:'UI:품목수'                    ;
        nego_type_code                   @title:'UI:Negotiation Type'       ;
        negotiation_style_code           @title:'UI:Quote Style'            ;
        bidding_result_open_status_code  @title:'UI:Bid Open Status'        ;
        negotiation_output_class_code    @title:'UI:Outcome'                ;
        pr_approve_number                @title:'UI:Req Submission No'      ;
        req_submission_status            @title:'UI:Req Submission Status'  ;
        req_reapproval                   @title:'UI:Req Reapproval'         ;
        material_code                    @title:'UI:Part No'                ;
        material_desc                    @title:'UI:Description'            ;
        requestor_empno                  @title:'UI:요청자'                    ;
        request_department_code          @title:'UI:요청 부서'                  ;
        award_type_code                  @title:'UI:Award Type'             ;
        buyer_empno                      @title:'UI:Buyer'                  ;
        buyer_department_code            @title:'UI:Department'             ;
        open_date                        @title:'UI:Open Date'              ;
        closing_date                     @title:'UI:Close Date'             ;
        close_date_ext_enabled_hours     @title:'UI:Extention Period'       ;
        close_date_ext_enabled_count     @title:'UI:Extention Times'        ;
        actual_extension_count           @title:'UI:Actual Extension Times' ;
        requisition_flag                 @title:'UI:Requisition Flag'       ;
        price_submission_no              @title:'UI:Price Submission No'    ;
        price_submisstion_status         @title:'UI:Price Submission Status';
        local_create_dtm                 @title:'UI:Create Date'            ;
        interface_source                 @title:'UI:Interface Source'       ;
    };


    view NegoItemPricesStatusView as select from Sc_Nego_Item_Prices {
		pr_approve_number,
		Header.nego_document_number,
		Header.nego_document_round,
		Header.nego_progress_status_code,
		Header.award_progress_status_code,
		Header.reply_times,
		Header.nego_progress_status.nego_progress_status_name,
		Header.award_progress_status.award_progress_status_name
    };


    // view NegoHeadersView as select from Sc_Nego_Headers_View;

    type tyNegoHeaderKey {
        tenant_id                       : type of Sc_Nego_Headers : tenant_id;
        nego_header_id                  : type of Sc_Nego_Headers : nego_header_id;
    };

    type tyNegoItemPriceKey {
        tenant_id                    : type of Sc_Nego_Item_Prices : tenant_id;
        nego_header_id               : type of Sc_Nego_Item_Prices : nego_header_id;
        nego_item_number             : type of Sc_Nego_Item_Prices : nego_item_number;
    };

    type tyNegoSupplierKey {
        tenant_id                        : type of Sc_Nego_Suppliers : tenant_id;
        nego_header_id                   : type of Sc_Nego_Suppliers : nego_header_id;
        nego_item_number                 : type of Sc_Nego_Suppliers : nego_item_number;
        item_supplier_sequence           : type of Sc_Nego_Suppliers : item_supplier_sequence;
    };

    type tyNegoHeader {
        tenant_id                       : type of Sc_Nego_Headers : tenant_id;
        nego_header_id                  : type of Sc_Nego_Headers : nego_header_id;
        reference_nego_header_id        : type of Sc_Nego_Headers : reference_nego_header_id;
        previous_nego_header_id         : type of Sc_Nego_Headers : previous_nego_header_id;
        operation_org_code              : type of Sc_Nego_Headers : operation_org_code;
        operation_unit_code             : type of Sc_Nego_Headers : operation_unit_code;
        reference_nego_document_number  : type of Sc_Nego_Headers : reference_nego_document_number;
        nego_document_round             : type of Sc_Nego_Headers : nego_document_round;
        nego_document_number            : type of Sc_Nego_Headers : nego_document_number;
        nego_document_title             : type of Sc_Nego_Headers : nego_document_title;
        nego_document_desc              : type of Sc_Nego_Headers : nego_document_desc;
        nego_progress_status_code       : type of Sc_Nego_Headers : nego_progress_status_code;
        award_progress_status_code      : type of Sc_Nego_Headers : award_progress_status_code;
        reply_times                     : type of Sc_Nego_Headers : reply_times;
        supplier_count                  : type of Sc_Nego_Headers : supplier_count;
        nego_type_code                  : type of Sc_Nego_Headers : nego_type_code;
        outcome_code                    : type of Sc_Nego_Headers : outcome_code;
        negotiation_output_class_code   : type of Sc_Nego_Headers : negotiation_output_class_code;
        buyer_empno                     : type of Sc_Nego_Headers : buyer_empno;
        buyer_department_code           : type of Sc_Nego_Headers : buyer_department_code;
        immediate_apply_flag            : type of Sc_Nego_Headers : immediate_apply_flag;
        open_date                       : type of Sc_Nego_Headers : open_date;
        closing_date                    : type of Sc_Nego_Headers : closing_date;
        auto_rfq                        : type of Sc_Nego_Headers : auto_rfq;
        items_count                     : type of Sc_Nego_Headers : items_count;
        negotiation_style_code          : type of Sc_Nego_Headers : negotiation_style_code;
        close_date_ext_enabled_hours    : type of Sc_Nego_Headers : close_date_ext_enabled_hours;
        close_date_ext_enabled_count    : type of Sc_Nego_Headers : close_date_ext_enabled_count;
        actual_extension_count          : type of Sc_Nego_Headers : actual_extension_count;
        remaining_hours                 : type of Sc_Nego_Headers : remaining_hours;
        note_content                    : type of Sc_Nego_Headers : note_content;
        award_type_code                 : type of Sc_Nego_Headers : award_type_code;
        award_method_code               : type of Sc_Nego_Headers : award_method_code;
        target_amount_config_flag       : type of Sc_Nego_Headers : target_amount_config_flag;
        target_currency                 : type of Sc_Nego_Headers : target_currency;
        target_amount                   : type of Sc_Nego_Headers : target_amount;
        supplier_participation_flag     : type of Sc_Nego_Headers : supplier_participation_flag;
        partial_allow_flag              : type of Sc_Nego_Headers : partial_allow_flag;
        bidding_result_open_status_code : type of Sc_Nego_Headers : bidding_result_open_status_code;
    };

    type tyNegoItemPrice {
        tenant_id                    : type of Sc_Nego_Item_Prices : tenant_id;
        nego_header_id               : type of Sc_Nego_Item_Prices : nego_header_id;
        nego_item_number             : type of Sc_Nego_Item_Prices : nego_item_number;
        operation_org_code           : type of Sc_Nego_Item_Prices : operation_org_code;
        operation_unit_code          : type of Sc_Nego_Item_Prices : operation_unit_code;
        award_progress_status_code   : type of Sc_Nego_Item_Prices : award_progress_status_code;
        line_type_code               : type of Sc_Nego_Item_Prices : line_type_code;
        material_code                : type of Sc_Nego_Item_Prices : material_code;
        material_desc                : type of Sc_Nego_Item_Prices : material_desc;
        specification                : type of Sc_Nego_Item_Prices : specification;
        bpa_price                    : type of Sc_Nego_Item_Prices : bpa_price;
        detail_net_price             : type of Sc_Nego_Item_Prices : detail_net_price;
        recommend_info               : type of Sc_Nego_Item_Prices : recommend_info;
        group_id                     : type of Sc_Nego_Item_Prices : group_id;
        // sparts_supply_type           : type of Sc_Nego_Item_Prices : sparts_supply_type;
        location                     : type of Sc_Nego_Item_Prices : location;
        purpose                      : type of Sc_Nego_Item_Prices : purpose;
        reason                       : type of Sc_Nego_Item_Prices : reason;
        request_date                 : type of Sc_Nego_Item_Prices : request_date;
        attch_code                   : type of Sc_Nego_Item_Prices : attch_code;
        supplier_provide_info        : type of Sc_Nego_Item_Prices : supplier_provide_info;
        incoterms_code               : type of Sc_Nego_Item_Prices : incoterms_code;
        excl_flag                    : type of Sc_Nego_Item_Prices : excl_flag;
        specific_supplier_count      : type of Sc_Nego_Item_Prices : specific_supplier_count;
        vendor_pool_code             : type of Sc_Nego_Item_Prices : vendor_pool_code;
        request_quantity             : type of Sc_Nego_Item_Prices : request_quantity;
        uom_code                     : type of Sc_Nego_Item_Prices : uom_code;
        maturity_date                : type of Sc_Nego_Item_Prices : maturity_date;
        currency_code                : type of Sc_Nego_Item_Prices : currency_code;
        response_currency_code       : type of Sc_Nego_Item_Prices : response_currency_code;
        exrate_type_code             : type of Sc_Nego_Item_Prices : exrate_type_code;
        exrate_date                  : type of Sc_Nego_Item_Prices : exrate_date;
        bidding_start_net_price      : type of Sc_Nego_Item_Prices : bidding_start_net_price;
        bidding_start_net_price_flag : type of Sc_Nego_Item_Prices : bidding_start_net_price_flag;
        bidding_target_net_price     : type of Sc_Nego_Item_Prices : bidding_target_net_price;
        current_price                : type of Sc_Nego_Item_Prices : current_price;
        note_content                 : type of Sc_Nego_Item_Prices : note_content;
        pr_number                    : type of Sc_Nego_Item_Prices : pr_number;
        pr_approve_number            : type of Sc_Nego_Item_Prices : pr_approve_number;
        req_submission_status        : type of Sc_Nego_Item_Prices : req_submission_status;
        req_reapproval               : type of Sc_Nego_Item_Prices : req_reapproval;
        requisition_flag             : type of Sc_Nego_Item_Prices : requisition_flag;
        price_submission_no          : type of Sc_Nego_Item_Prices : price_submission_no;
        price_submisstion_status     : type of Sc_Nego_Item_Prices : price_submisstion_status;
        interface_source             : type of Sc_Nego_Item_Prices : interface_source;
        requestor_empno              : type of Sc_Nego_Item_Prices : requestor_empno;
        budget_department_code       : type of Sc_Nego_Item_Prices : budget_department_code;
        request_department_code      : type of Sc_Nego_Item_Prices : request_department_code;
    };

    type tyNegoSupplier {
        tenant_id                        : type of Sc_Nego_Suppliers : tenant_id;
        nego_header_id                   : type of Sc_Nego_Suppliers : nego_header_id;
        nego_item_number                 : type of Sc_Nego_Suppliers : nego_item_number;
        item_supplier_sequence           : type of Sc_Nego_Suppliers : item_supplier_sequence;
        operation_org_code               : type of Sc_Nego_Suppliers : operation_org_code;
        operation_unit_code              : type of Sc_Nego_Suppliers : operation_unit_code;
        nego_supplier_register_type_code : type of Sc_Nego_Suppliers : nego_supplier_register_type_code;
        evaluation_type_code             : type of Sc_Nego_Suppliers : evaluation_type_code;
        nego_supeval_type_code           : type of Sc_Nego_Suppliers : nego_supeval_type_code;
        supplier_code                    : type of Sc_Nego_Suppliers : supplier_code;
        supplier_name                    : type of Sc_Nego_Suppliers : supplier_name;
        supplier_type_code               : type of Sc_Nego_Suppliers : supplier_type_code;
        excl_flag                        : type of Sc_Nego_Suppliers : excl_flag;
        excl_reason_desc                 : type of Sc_Nego_Suppliers : excl_reason_desc;
        include_flag                     : type of Sc_Nego_Suppliers : include_flag;
        nego_target_include_reason_desc  : type of Sc_Nego_Suppliers : nego_target_include_reason_desc;
        only_maker_flat                  : type of Sc_Nego_Suppliers : only_maker_flat;
        contact                          : type of Sc_Nego_Suppliers : contact;
        note_content                     : type of Sc_Nego_Suppliers : note_content;
    };

    type ReturnMsg : {
        code     : Integer;
        // CODE_STRING     : String(256);
        message  : String(2000);
    };

    type tyDeepInsertNegoheader {
        negoheaders: array of tyNegoHeader;
        negoitemprices : array of tyNegoItemPrice;
        negosuppliers  : array of tyNegoSupplier;
    };

    type tyDeepDeleteNegoheader {
        negoheaders: array of tyNegoHeaderKey;
        negoitemprices : array of tyNegoItemPriceKey;
        negosuppliers  : array of tyNegoSupplierKey;
    };

    entity NegoHeadersView as projection on Sc_Nego_Headers_View { *,
        Items : redirected to NegoItemPrices
    }
    //  actions {
    //     action deepInsertNegoHeader(  negoheader     : array of tyNegoHeader
    //                                 , negoitemprices : array of tyNegoItemPrice
    //                                 , negosuppliers  : array of tyNegoSupplier  ) returns array of OutputData;
    // }
    ;

    // action deepInsertNegoHeader(  negoheader     : tyNegoHeader
    //                             , negoitemprices : array of tyNegoItemPrice
    //                             , negosuppliers  : array of tyNegoSupplier  ) returns array of OutputData;

    action deepInsertNegoHeader(  deepinsertnegoheader : tyDeepInsertNegoheader  ) returns array of ReturnMsg;
    action deepDeleteNegoHeader(  deepdeletenegoheader : tyDeepDeleteNegoheader  ) returns array of ReturnMsg;
    // @odata.draft.enabled

    /* 마스터 @cds.autoexpose entity //> master association 생략 가능
    entity ScOutcomeCode @(title : 'OutcomCode')              as projection on scOutcomeCode;
    entity ScNegoTypeCode @(title : '협상유형코드')                 as projection on scNegoTypeCode;
    entity ScNegoParentTypeCode @(title : '협상유형코드')           as projection on scNegoParentTypeCode;
    entity ScAwardTypeCodeView @(title : 'AwardTypeCode')     as projection on scAwardTypeCodeView;
    entity ScNegoProgStatusCodeView @(title : '협상상태코드')       as projection on scNegoProgStatusCodeView;
    */ 


// type tyNegoHeaders : NegoHeaders;
// type tyNegoItemPrices : NegoItemPrices;
// type tyNegoSuppliers : NegoSuppliers;

// type negoDeepUpsertIn : {
//     negoHeaders    : array of tyNegoHeaders;
//     negoItemPrices : array of tyNegoItemPrices;
//     negoSuppliers  : array of tyNegoSuppliers;
// };

// type negoDeepUpsertOut : {
//     returncode    : String(2);
//     returnmessage : String(500);
// };

// action upsertSourcingNegoProc(InputData : negoDeepUpsertIn) returns array of negoDeepUpsertOut;

}
