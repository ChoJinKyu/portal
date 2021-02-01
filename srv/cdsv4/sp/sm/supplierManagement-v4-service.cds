using {sp as ckTxFunc} from '../../../../db/cds/sp/sm/SP_SM_CHECK_TAXID_FUNC-model';

namespace sp;

@path : '/sp.supplierManagementV4Service'
service supplierManagementV4Service {

    //Check Tad ID Function
    entity CheckTaxIDFunction(tenant_id : String(5), tax_id : String(30)) as
        select from ckTxFunc.Sm_Check_Taxid_Func (
            tenant_id: :tenant_id, tax_id: :tax_id
        );

}
