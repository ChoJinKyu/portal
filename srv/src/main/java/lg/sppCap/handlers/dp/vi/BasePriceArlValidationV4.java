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
    public void validationBasePriceArlMaster(EventContext context, Collection<BasePriceArlMstType> basePriceArlMasters) {
        log.info("## validationBasePriceArlMaster Method Started....");

        if (!basePriceArlMasters.isEmpty() && basePriceArlMasters.size() > 0){
            for (BasePriceArlMstType basePriceArlMst : basePriceArlMasters) {
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
                System.out.println("# ----------------------------------");

                // validMandatory(basePriceArlMst.getApprovalNumber(),          context, this.getMessage("APPROVAL_NUMBER", context));

                // 상세가 없으면 종료
                if (basePriceArlMst.getDetails() == null) {
                    return;
                } else {
                    this.validationBasePriceArlDetail(context, basePriceArlMst.getDetails());
                }
            }
        }
    }

    /**
     * basePriceArlDetail 입력값 체크
     * @param context
     * @param basePriceArlDetails
     */
    public void validationBasePriceArlDetail(EventContext context, Collection<BasePriceArlDtlType> basePriceArlDetails) {
        log.info("## validationBasePriceArlDetail Method Started....");
        
        if (!basePriceArlDetails.isEmpty() && basePriceArlDetails.size() > 0){
            for (BasePriceArlDtlType basePriceArlDetail : basePriceArlDetails) {
                // System.out.println("# tenant_id : "              + basePriceArlDetail.getTenantId());
                // System.out.println("# approval_number : "        + basePriceArlDetail.getApprovalNumber());
                // System.out.println("# item_sequence : "          + basePriceArlDetail.getItemSequence());
                // System.out.println("# company_code : "           + basePriceArlDetail.getCompanyCode());
                // System.out.println("# org_type_code : "          + basePriceArlDetail.getOrgTypeCode());
                // System.out.println("# org_code : "               + basePriceArlDetail.getOrgCode());
                // System.out.println("# au_code : "                + basePriceArlDetail.getAuCode());
                // System.out.println("# material_code : "          + basePriceArlDetail.getMaterialCode());
                // System.out.println("# supplier_code : "          + basePriceArlDetail.getSupplierCode());
                // System.out.println("# base_date : "              + basePriceArlDetail.getBaseDate());
                // System.out.println("# base_price_ground_code : " + basePriceArlDetail.getBasePriceGroundCode());
                // System.out.println("# ----------------------------------");

                // validMandatory(basePriceArlDetail.getItemSequence(),        context, this.getMessage("ITEM_SEQUENCE", context));
                // validMandatory(basePriceArlDetail.getCompanyCode(),         context, this.getMessage("COMPANY_CODE", context));
                // validMandatory(basePriceArlDetail.getOrgTypeCode(),         context, this.getMessage("ORG_TYPE_CODE", context));
                // validMandatory(basePriceArlDetail.getOrgCode(),             context, this.getMessage("ORG_CODE", context));
                // validMandatory(basePriceArlDetail.getAuCode(),              context, this.getMessage("AU_CODE", context));
                // validMandatory(basePriceArlDetail.getMaterialCode(),        context, this.getMessage("MATERIAL_CODE", context));
                // validMandatory(basePriceArlDetail.getBasePriceGroundCode(), context, this.getMessage("BASE_PRICE_GROUND_CODE", context));

                // 가격이 없으면 종료
                if (basePriceArlDetail.getPrices() == null) {
                    return;
                } else {
                    this.validationBasePriceArlPrice(context, basePriceArlDetail.getPrices());
                }
            }
        }
    }

    /**
     * basePriceArlPrice 입력값 체크
     * @param context
     * @param basePriceArlPrices
     */
    public void validationBasePriceArlPrice(EventContext context, Collection<BasePriceArlPriceType> basePriceArlPrices) {
        log.info("## validationBasePriceArlPrice Method Started....");
 
        if (!basePriceArlPrices.isEmpty() && basePriceArlPrices.size() > 0){
            for (BasePriceArlPriceType basePriceArlPrice : basePriceArlPrices) {
                // System.out.println("# tenant_id : "                          + basePriceArlPrice.getTenantId());
                // System.out.println("# approval_number : "                    + basePriceArlPrice.getApprovalNumber());
                // System.out.println("# item_sequence : "                      + basePriceArlPrice.getItemSequence());
                // System.out.println("# market_code : "                        + basePriceArlPrice.getMarketCode());
                // System.out.println("# new_base_price : "                     + basePriceArlPrice.getNewBasePrice());
                // System.out.println("# new_base_price_currency_code : "       + basePriceArlPrice.getNewBasePriceCurrencyCode());
                // System.out.println("# current_base_price : "                 + basePriceArlPrice.getCurrentBasePrice());
                // System.out.println("# current_base_price_currency_code : "   + basePriceArlPrice.getCurrentBasePriceCurrencyCode());
                // System.out.println("# first_purchasing_net_price : "         + basePriceArlPrice.getFirstPurchasingNetPrice());
                // System.out.println("# first_pur_netprice_curr_cd : "         + basePriceArlPrice.getFirstPurNetpriceCurrCd());
                // System.out.println("# first_pur_netprice_str_dt : "          + basePriceArlPrice.getFirstPurNetpriceStrDt());
                // System.out.println("# ----------------------------------");

                //     validMandatory(basePriceArlPrice.getMarketCode(), context, this.getMessage("MARKET_CODE", context));
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