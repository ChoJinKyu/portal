package lg.sppCap.handlers.dp.vi;

import lg.sppCap.frame.i18n.Multilingual;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;
import java.util.Locale;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.ErrorStatuses;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cds.gen.dp.basepricearlv4service.*;

@Component
public class BasePriceArlValidationV4 {

    private static final Logger log = LoggerFactory.getLogger(BasePriceArlValidationV4.class);

    @Autowired
    protected Multilingual i18n;

    private String getTenantId(){
        return "L2100";
    }

    private String getLanguageCode(EventContext context){
        Locale locale = context.getParameterInfo().getLocale();
        if(locale == null) locale = new Locale("KO", "KR");
        return locale.getLanguage().toUpperCase();
    }

    protected String getMessage(String messageCode, EventContext context, Object... replacement){
        String tenantId = this.getTenantId();
        String languageCode = this.getLanguageCode(context);
        return this.getMessage(tenantId, messageCode, languageCode, replacement);
    }

    protected String getMessage(String tenantId, String messageCode, String languageCode, Object... replacement){
        return this.i18n.getMessageContent(tenantId, messageCode, languageCode, replacement);
    }

    // private BaseEventHandler valid;

    /**
     * validationBasePriceArlMaster 입력값 체크
     * @param context
     * @param basePriceArlMasters
     */
    public void validationBasePriceArlMaster(DpViBasePriceArlProcContext context, Collection<BasePriceArlMstType> basePriceArlMasters, boolean isDebug) {
        log.info("## validationBasePriceArlMaster Method Started....");

        String cmdString = context.getInputData().getCmd().toLowerCase();

        if (!basePriceArlMasters.isEmpty() && basePriceArlMasters.size() > 0){
            for (BasePriceArlMstType basePriceArlMst : basePriceArlMasters) {
                if (isDebug) {
                    System.out.println("# tenant_id : "             + basePriceArlMst.getTenantId());
                    System.out.println("# approval_number : "       + basePriceArlMst.getApprovalNumber());
                    System.out.println("# chain_code : "            + basePriceArlMst.getChainCode());
                    System.out.println("# approval_type_code : "    + basePriceArlMst.getApprovalTypeCode());
                    System.out.println("# approval_title : "        + basePriceArlMst.getApprovalTitle());
                    System.out.println("# approval_contents : "     + basePriceArlMst.getApprovalContents());
                    System.out.println("# approve_status_code : "   + basePriceArlMst.getApproveStatusCode());
                    System.out.println("# requestor_empno : "       + basePriceArlMst.getRequestorEmpno());
                    System.out.println("# request_date : "          + basePriceArlMst.getRequestDate());
                    System.out.println("# attch_group_number : "    + basePriceArlMst.getAttchGroupNumber());

                    System.out.println("# local_create_dtm : "      + basePriceArlMst.getLocalCreateDtm());
                    System.out.println("# local_update_dtm : "      + basePriceArlMst.getLocalUpdateDtm());
                    System.out.println("# create_user_id : "        + basePriceArlMst.getCreateUserId());
                    System.out.println("# update_user_id : "        + basePriceArlMst.getUpdateUserId());
                    System.out.println("# --------------------------------------------------------------------------------------------");
                }

                validMandatory(basePriceArlMst.getTenantId(), context, this.getMessage("TENANT_ID", context));

                if (cmdString.equals("upsert") || cmdString.equals("delete"))
                    validMandatory(basePriceArlMst.getApprovalNumber(), context, this.getMessage("APPROVAL_NUMBER", context));

                if (cmdString.equals("insert")) {
                    validMandatory(basePriceArlMst.getChainCode(), context, this.getMessage("CHAIN_CODE", context));
                    validMandatory(basePriceArlMst.getApprovalTypeCode(), context, this.getMessage("APPROVAL_TYPE_CODE", context));
                    validMandatory(basePriceArlMst.getRequestorEmpno(), context, this.getMessage("REQUESTOR_EMPNO", context));
                }

                if (cmdString.equals("insert") || cmdString.equals("upsert")) {
                    validMandatory(basePriceArlMst.getApprovalTitle(), context, this.getMessage("APPROVAL_TITLE", context));
                    validMandatory(basePriceArlMst.getApproveStatusCode(), context, this.getMessage("APPROVE_STATUS_CODE", context));
                }

                // 결재라인이 있으면
                if (basePriceArlMst.getApprovers() == null) {
                    return;
                } else {
                    this.validationBasePriceArlApprover(context, basePriceArlMst.getApprovers(), isDebug);
                }

                // 결재라인이 있으면
                if (basePriceArlMst.getReferers() != null) this.validationBasePriceArlReferer(context, basePriceArlMst.getReferers(), isDebug);

                // 상세가 있으면
                if (basePriceArlMst.getDetails() == null) {
                    return;
                } else {
                    this.validationBasePriceArlDetail(context, basePriceArlMst.getDetails(), isDebug);
                }
            }
        }
    }

    /**
     * basePriceArlApprover 입력값 체크
     * @param context
     * @param basePriceArlApprovers
     */
    public void validationBasePriceArlApprover(DpViBasePriceArlProcContext context, Collection<BasePriceArlApproverType> basePriceArlApprovers, boolean isDebug) {
        log.info("## validationBasePriceArlApprover Method Started....");

        String cmdString = context.getInputData().getCmd().toLowerCase();
        
        if (!basePriceArlApprovers.isEmpty() && basePriceArlApprovers.size() > 0){
            for (BasePriceArlApproverType basePriceArlApprover : basePriceArlApprovers) {
                if (isDebug) {
                    System.out.println("\t# tenant_id : "              + basePriceArlApprover.getTenantId());
                    System.out.println("\t# approval_number : "        + basePriceArlApprover.getApprovalNumber());
                    System.out.println("\t# approve_sequence : "       + basePriceArlApprover.getApproveSequence());
                    System.out.println("\t# approver_empno : "         + basePriceArlApprover.getApproverEmpno());
                    System.out.println("\t# approver_type_code : "     + basePriceArlApprover.getApproverTypeCode());
                    System.out.println("\t# approve_status_code : "    + basePriceArlApprover.getApproveStatusCode());

                    System.out.println("\t# local_create_dtm : "       + basePriceArlApprover.getLocalCreateDtm());
                    System.out.println("\t# local_update_dtm : "       + basePriceArlApprover.getLocalUpdateDtm());
                    System.out.println("\t# create_user_id : "         + basePriceArlApprover.getCreateUserId());
                    System.out.println("\t# update_user_id : "         + basePriceArlApprover.getUpdateUserId());
                    System.out.println("\t# --------------------------------------------------------------------------------------------");
                }

                // validMandatory(basePriceArlDetail.getItemSequence(),        context, this.getMessage("ITEM_SEQUENCE", context));
                // validMandatory(basePriceArlDetail.getCompanyCode(),         context, this.getMessage("COMPANY_CODE", context));
                // validMandatory(basePriceArlDetail.getOrgTypeCode(),         context, this.getMessage("ORG_TYPE_CODE", context));
                // validMandatory(basePriceArlDetail.getOrgCode(),             context, this.getMessage("ORG_CODE", context));
                // validMandatory(basePriceArlDetail.getAuCode(),              context, this.getMessage("AU_CODE", context));
                // validMandatory(basePriceArlDetail.getMaterialCode(),        context, this.getMessage("MATERIAL_CODE", context));
                // validMandatory(basePriceArlDetail.getBasePriceGroundCode(), context, this.getMessage("BASE_PRICE_GROUND_CODE", context));
            }
        }
    }

    /**
     * basePriceArlReferer 입력값 체크
     * @param context
     * @param basePriceArlReferers
     */
    public void validationBasePriceArlReferer(DpViBasePriceArlProcContext context, Collection<BasePriceArlRefererType> basePriceArlReferers, boolean isDebug) {
        log.info("## validationBasePriceArlReferer Method Started....");
        
        String cmdString = context.getInputData().getCmd().toLowerCase();

        if (!basePriceArlReferers.isEmpty() && basePriceArlReferers.size() > 0){
            for (BasePriceArlRefererType basePriceArlReferer : basePriceArlReferers) {
                if (isDebug) {
                    System.out.println("\t# tenant_id : "              + basePriceArlReferer.getTenantId());
                    System.out.println("\t# approval_number : "        + basePriceArlReferer.getApprovalNumber());
                    System.out.println("\t# referer_empno : "       + basePriceArlReferer.getRefererEmpno());

                    System.out.println("\t# local_create_dtm : "       + basePriceArlReferer.getLocalCreateDtm());
                    System.out.println("\t# local_update_dtm : "       + basePriceArlReferer.getLocalUpdateDtm());
                    System.out.println("\t# create_user_id : "         + basePriceArlReferer.getCreateUserId());
                    System.out.println("\t# update_user_id : "         + basePriceArlReferer.getUpdateUserId());
                    System.out.println("\t# --------------------------------------------------------------------------------------------");
                }

                // validMandatory(basePriceArlDetail.getItemSequence(),        context, this.getMessage("ITEM_SEQUENCE", context));
                // validMandatory(basePriceArlDetail.getCompanyCode(),         context, this.getMessage("COMPANY_CODE", context));
                // validMandatory(basePriceArlDetail.getOrgTypeCode(),         context, this.getMessage("ORG_TYPE_CODE", context));
                // validMandatory(basePriceArlDetail.getOrgCode(),             context, this.getMessage("ORG_CODE", context));
                // validMandatory(basePriceArlDetail.getAuCode(),              context, this.getMessage("AU_CODE", context));
                // validMandatory(basePriceArlDetail.getMaterialCode(),        context, this.getMessage("MATERIAL_CODE", context));
                // validMandatory(basePriceArlDetail.getBasePriceGroundCode(), context, this.getMessage("BASE_PRICE_GROUND_CODE", context));
            }
        }
    }

    /**
     * basePriceArlDetail 입력값 체크
     * @param context
     * @param basePriceArlDetails
     */
    public void validationBasePriceArlDetail(DpViBasePriceArlProcContext context, Collection<BasePriceArlDtlType> basePriceArlDetails, boolean isDebug) {
        log.info("## validationBasePriceArlDetail Method Started....");

        String cmdString = context.getInputData().getCmd().toLowerCase();
        
        if (!basePriceArlDetails.isEmpty() && basePriceArlDetails.size() > 0){
            for (BasePriceArlDtlType basePriceArlDetail : basePriceArlDetails) {
                if (isDebug) {
                    System.out.println("\t# tenant_id : "                    + basePriceArlDetail.getTenantId());
                    System.out.println("\t# approval_number : "             + basePriceArlDetail.getApprovalNumber());
                    System.out.println("\t# item_sequence : "               + basePriceArlDetail.getItemSequence());
                    System.out.println("\t# company_code : "                + basePriceArlDetail.getCompanyCode());
                    System.out.println("\t# org_type_code : "               + basePriceArlDetail.getOrgTypeCode());
                    System.out.println("\t# org_code : "                    + basePriceArlDetail.getOrgCode());
                    System.out.println("\t# material_code : "               + basePriceArlDetail.getMaterialCode());
                    System.out.println("\t# base_uom_code : "               + basePriceArlDetail.getBaseUomCode());
                    System.out.println("\t# supplier_code : "               + basePriceArlDetail.getSupplierCode());
                    System.out.println("\t# base_date : "                   + basePriceArlDetail.getBaseDate());
                    System.out.println("\t# base_price_ground_code : "      + basePriceArlDetail.getBasePriceGroundCode());
                    System.out.println("\t# change_reason_code : "          + basePriceArlDetail.getChangeReasonCode());
                    System.out.println("\t# repr_material_code : "          + basePriceArlDetail.getReprMaterialCode());
                    System.out.println("\t# repr_material_supplier_code : " + basePriceArlDetail.getReprMaterialSupplierCode());
                    System.out.println("\t# repr_material_org_code : "      + basePriceArlDetail.getReprMaterialOrgCode());

                    System.out.println("\t# local_create_dtm : "            + basePriceArlDetail.getLocalCreateDtm());
                    System.out.println("\t# local_update_dtm : "            + basePriceArlDetail.getLocalUpdateDtm());
                    System.out.println("\t# create_user_id : "              + basePriceArlDetail.getCreateUserId());
                    System.out.println("\t# update_user_id : "              + basePriceArlDetail.getUpdateUserId());
                    System.out.println("\t# --------------------------------------------------------------------------------------------");
                }

                // validMandatory(basePriceArlDetail.getItemSequence(),        context, this.getMessage("ITEM_SEQUENCE", context));
                // validMandatory(basePriceArlDetail.getCompanyCode(),         context, this.getMessage("COMPANY_CODE", context));
                // validMandatory(basePriceArlDetail.getOrgTypeCode(),         context, this.getMessage("ORG_TYPE_CODE", context));
                // validMandatory(basePriceArlDetail.getOrgCode(),             context, this.getMessage("ORG_CODE", context));
                // validMandatory(basePriceArlDetail.getMaterialCode(),        context, this.getMessage("MATERIAL_CODE", context));
                // validMandatory(basePriceArlDetail.getBasePriceGroundCode(), context, this.getMessage("BASE_PRICE_GROUND_CODE", context));

                // 가격이 없으면 종료
                if (basePriceArlDetail.getPrices() != null) this.validationBasePriceArlPrice(context, basePriceArlDetail.getPrices(), isDebug);
            }
        }
    }

    /**
     * basePriceArlPrice 입력값 체크
     * @param context
     * @param basePriceArlPrices
     */
    public void validationBasePriceArlPrice(DpViBasePriceArlProcContext context, Collection<BasePriceArlPriceType> basePriceArlPrices, boolean isDebug) {
        log.info("## validationBasePriceArlPrice Method Started....");

        String cmdString = context.getInputData().getCmd().toLowerCase();
 
        if (!basePriceArlPrices.isEmpty() && basePriceArlPrices.size() > 0){
            for (BasePriceArlPriceType basePriceArlPrice : basePriceArlPrices) {
                if (isDebug) {
                    System.out.println("\t\t# tenant_id : "                          + basePriceArlPrice.getTenantId());
                    System.out.println("\t\t# approval_number : "                    + basePriceArlPrice.getApprovalNumber());
                    System.out.println("\t\t# item_sequence : "                      + basePriceArlPrice.getItemSequence());
                    System.out.println("\t\t# market_code : "                        + basePriceArlPrice.getMarketCode());
                    System.out.println("\t\t# new_base_price : "                     + basePriceArlPrice.getNewBasePrice());
                    System.out.println("\t\t# new_base_price_currency_code : "       + basePriceArlPrice.getNewBasePriceCurrencyCode());
                    System.out.println("\t\t# current_base_price : "                 + basePriceArlPrice.getCurrentBasePrice());
                    System.out.println("\t\t# current_base_price_currency_code : "   + basePriceArlPrice.getCurrentBasePriceCurrencyCode());
                    System.out.println("\t\t# first_purchasing_net_price : "         + basePriceArlPrice.getFirstPurchasingNetPrice());
                    System.out.println("\t\t# first_pur_netprice_curr_cd : "         + basePriceArlPrice.getFirstPurNetpriceCurrCd());
                    System.out.println("\t\t# first_pur_netprice_str_dt : "          + basePriceArlPrice.getFirstPurNetpriceStrDt());

                    System.out.println("\t\t# local_create_dtm : "                   + basePriceArlPrice.getLocalCreateDtm());
                    System.out.println("\t\t# local_update_dtm : "                   + basePriceArlPrice.getLocalUpdateDtm());
                    System.out.println("\t\t# create_user_id : "                     + basePriceArlPrice.getCreateUserId());
                    System.out.println("\t\t# update_user_id : "                     + basePriceArlPrice.getUpdateUserId());
                    System.out.println("\t\t# --------------------------------------------------------------------------------------------");
                }

                //     validMandatory(basePriceArlPrice.getMarketCode(), context, this.getMessage("MARKET_CODE", context));
            }
        }
    }

    /**
     * validationBasePriceArlChangeRequestor 입력값 체크
     * @param context
     * @param basePriceArlMasters
     */
    public void validationBasePriceArlChangeRequestor(DpViBasePriceChangeRequestorProcContext context, Collection<BasePriceArlChangeRequestorType> basePriceArlChangeRequestors, boolean isDebug) {
        log.info("## validationBasePriceArlChangeRequestor Method Started....");

        String cmdString = context.getInputData().getCmd().toLowerCase();

        if (!basePriceArlChangeRequestors.isEmpty() && basePriceArlChangeRequestors.size() > 0){
            for (BasePriceArlChangeRequestorType basePriceArlChangeRequestor : basePriceArlChangeRequestors) {
                if (isDebug) {
                    System.out.println("# tenant_id : "             + basePriceArlChangeRequestor.getTenantId());
                    System.out.println("# approval_number : "       + basePriceArlChangeRequestor.getApprovalNumber());
                    System.out.println("# changer_empno : "         + basePriceArlChangeRequestor.getChangerEmpno());
                    System.out.println("# creator_empno : "         + basePriceArlChangeRequestor.getCreatorEmpno());

                    System.out.println("# local_create_dtm : "      + basePriceArlChangeRequestor.getLocalCreateDtm());
                    System.out.println("# local_update_dtm : "      + basePriceArlChangeRequestor.getLocalUpdateDtm());
                    System.out.println("# create_user_id : "        + basePriceArlChangeRequestor.getCreateUserId());
                    System.out.println("# update_user_id : "        + basePriceArlChangeRequestor.getUpdateUserId());
                    System.out.println("# --------------------------------------------------------------------------------------------");
                }

                validMandatory(basePriceArlChangeRequestor.getTenantId(), context, this.getMessage("TENANT_ID", context));
                validMandatory(basePriceArlChangeRequestor.getApprovalNumber(), context, this.getMessage("APPROVAL_NUMBER", context));
                validMandatory(basePriceArlChangeRequestor.getChangerEmpno(), context, this.getMessage("CHANGER_EMPNO", context));
                validMandatory(basePriceArlChangeRequestor.getCreatorEmpno(), context, this.getMessage("CREATOR_EMPNO", context));
            }
        }
    }

    /**
     * 필수 입력값 체크
     * @param validSource
     * @param context
     * @param replacement
     */
    public void validMandatory(Object validSource, EventContext context, Object... replacement) {
        String messageCode = "EDP30001";
        String msg = "";

        if (validSource == null || (validSource instanceof String) && (((String)validSource).trim().length() == 0)) {
            msg = this.getMessage(messageCode, context, replacement);
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, msg);
        }
    }

}