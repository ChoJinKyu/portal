//cds-service sourcing-service.cds
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

@path : '/sp.sourcingService'
service SourcingService {

    /* 협상에 대한 헤더 정보(네고종류, 네고산출물, Award유형, 개설일자, 마감일자, 오리엔테이션정보 등)를 관리한다. */
    entity NegoHeadersView @(title : '협상헤더정보뷰') as projection on Sc_Nego_Headers_View { *,
        Items : redirected to NegoItemPrices
    };
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
        nego_document_number             @description:'UI:Negotiation No'         ;
        nego_document_round              @description:'UI:Revision'               ;
        nego_progress_status_code        @description:'UI:Negotiation Status'     ;
        award_progress_status_code       @description:'UI:Award Status'           ;
        reply_times                      @description:'UI:회신횟수'                   ;
        supplier_count                   @description:'UI:협력사수'                   ;
        supplier_participation_flag      @description:'UI:Participation'          ;
        remaining_hours                  @description:'UI:잔여시간'                   ;
        nego_document_title              @description:'UI:Title'                  ;
        items_count                      @description:'UI:품목수'                    ;
        nego_type_code                   @description:'UI:Negotiation Type'       ;
        negotiation_style_code           @description:'UI:Quote Style'            ;
        bidding_result_open_status_code  @description:'UI:Bid Open Status'        ;
        negotiation_output_class_code    @description:'UI:Outcome'                ;
        pr_approve_number                @description:'UI:Req Submission No'      ;
        req_submission_status            @description:'UI:Req Submission Status'  ;
        req_reapproval                   @description:'UI:Req Reapproval'         ;
        material_code                    @description:'UI:Part No'                ;
        material_desc                    @description:'UI:Description'            ;
        requestor_empno                  @description:'UI:요청자'                    ;
        request_department_code          @description:'UI:요청 부서'                  ;
        award_type_code                  @description:'UI:Award Type'             ;
        buyer_empno                      @description:'UI:Buyer'                  ;
        buyer_department_code            @description:'UI:Department'             ;
        open_date                        @description:'UI:Open Date'              ;
        closing_date                     @description:'UI:Close Date'             ;
        close_date_ext_enabled_hours     @description:'UI:Extention Period'       ;
        close_date_ext_enabled_count     @description:'UI:Extention Times'        ;
        actual_extension_count           @description:'UI:Actual Extension Times' ;
        requisition_flag                 @description:'UI:Requisition Flag'       ;
        price_submission_no              @description:'UI:Price Submission No'    ;
        price_submisstion_status         @description:'UI:Price Submission Status';
        local_create_dtm                 @description:'UI:Create Date'            ;
        interface_source                 @description:'UI:Interface Source'       ;
    };

}
