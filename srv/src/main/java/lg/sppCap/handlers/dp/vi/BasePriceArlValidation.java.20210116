package lg.sppCap.handlers.dp.vi;

import lg.sppCap.frame.i18n.Multilingual;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Locale;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.ErrorStatuses;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cds.gen.dp.basepricearlservice.BasePriceArlMaster;
import cds.gen.dp.basepricearlservice.BasePriceArlDetail;
import cds.gen.dp.basepricearlservice.BasePriceArlPrice;

@Component
public class BasePriceArlValidation {

    private static final Logger log = LoggerFactory.getLogger(BasePriceArlValidation.class);

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
    public void validationBasePriceArlMaster(EventContext context, List<BasePriceArlMaster> basePriceArlMasters) {
        log.info("## validationBasePriceArlMaster Method Started....");

        for (BasePriceArlMaster basePriceArlMaster : basePriceArlMasters) {
            // System.out.println("# tenant_id : "                 + basePriceArlMaster.getTenantId());
            // System.out.println("# approval_number : "           + basePriceArlMaster.getApprovalNumber());
            // System.out.println("# approval_title : "            + basePriceArlMaster.getApprovalTitle());
            // System.out.println("# approval_type_code : "        + basePriceArlMaster.getApprovalTypeCode());
            // System.out.println("# approval_status_code : "      + basePriceArlMaster.getApprovalStatusCode());
            // System.out.println("# approval_requestor_empno : "  + basePriceArlMaster.getApprovalRequestorEmpno());

            // System.out.println("# local_create_dtm : " + basePriceArlMaster.getLocalCreateDtm());
            // System.out.println("# local_update_dtm : " + basePriceArlMaster.getLocalUpdateDtm());
            // System.out.println("# create_user_id : " + basePriceArlMaster.getCreateUserId());
            // System.out.println("# update_user_id : " + basePriceArlMaster.getUpdateUserId());
            // System.out.println("# system_create_dtm : " + basePriceArlMaster.getSystemCreateDtm());
            // System.out.println("# system_update_dtm : " + basePriceArlMaster.getSystemUpdateDtm());

            validMandatory(basePriceArlMaster.getApprovalNumber(),          context, this.getMessage("APPROVAL_NUMBER", context));
            validMandatory(basePriceArlMaster.getApprovalTitle(),           context, this.getMessage("APPROVAL_TITLE", context));
            validMandatory(basePriceArlMaster.getApprovalTypeCode(),        context, this.getMessage("APPROVAL_TYPE_CODE", context));
            validMandatory(basePriceArlMaster.getApprovalStatusCode(),      context, this.getMessage("APPROVAL_STATUS_CODE", context));
            validMandatory(basePriceArlMaster.getApprovalRequestorEmpno(),  context, this.getMessage("APPROVAL_REQUESTOR_EMPNO", context));

            // 상세가 없으면 종료
            if (basePriceArlMaster.getDetails() == null) {
                return;
            } else {
                this.validationBasePriceArlDetail(context, basePriceArlMaster.getDetails());
            }
        }
    }

    /**
     * basePriceArlDetail 입력값 체크
     * @param context
     * @param basePriceArlDetails
     */
    public void validationBasePriceArlDetail(EventContext context, List<BasePriceArlDetail> basePriceArlDetails) {
        log.info("## validationBasePriceArlDetail Method Started....");
        
        for (BasePriceArlDetail basePriceArlDetail : basePriceArlDetails) {
            // System.out.println("\t# item_sequence : " + basePriceArlDetail.getItemSequence());
            // System.out.println("\t# company_code : " + basePriceArlDetail.getCompanyCode());
            // System.out.println("\t# org_type_code : " + basePriceArlDetail.getOrgTypeCode());
            // System.out.println("\t# org_code : " + basePriceArlDetail.getOrgCode());
            // System.out.println("\t# au_code : " + basePriceArlDetail.getAuCode());
            // System.out.println("\t# material_code : " + basePriceArlDetail.getMaterialCode());
            // System.out.println("\t# base_price_ground_code : " + basePriceArlDetail.getBasePriceGroundCode());

            validMandatory(basePriceArlDetail.getItemSequence(),        context, this.getMessage("ITEM_SEQUENCE", context));
            validMandatory(basePriceArlDetail.getCompanyCode(),         context, this.getMessage("COMPANY_CODE", context));
            validMandatory(basePriceArlDetail.getOrgTypeCode(),         context, this.getMessage("ORG_TYPE_CODE", context));
            validMandatory(basePriceArlDetail.getOrgCode(),             context, this.getMessage("ORG_CODE", context));
            validMandatory(basePriceArlDetail.getAuCode(),              context, this.getMessage("AU_CODE", context));
            validMandatory(basePriceArlDetail.getMaterialCode(),        context, this.getMessage("MATERIAL_CODE", context));
            validMandatory(basePriceArlDetail.getBasePriceGroundCode(), context, this.getMessage("BASE_PRICE_GROUND_CODE", context));

            // 상세가 없으면 종료
            if (basePriceArlDetail.getPrices() == null) {
                return;
            } else {
                this.validationBasePriceArlPrice(context, basePriceArlDetail.getPrices());
            }
        }
    }

    /**
     * basePriceArlPrice 입력값 체크
     * @param context
     * @param basePriceArlPrices
     */
    public void validationBasePriceArlPrice(EventContext context, List<BasePriceArlPrice> basePriceArlPrices) {
        log.info("## validationBasePriceArlPrice Method Started....");
        
        for (BasePriceArlPrice basePriceArlPrice : basePriceArlPrices) {
            // System.out.println("\t\t# market_code : " + basePriceArlPrice.getMarketCode());

            validMandatory(basePriceArlPrice.getMarketCode(), context, this.getMessage("MARKET_CODE", context));
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