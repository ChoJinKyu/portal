namespace dp;

using util from '../../cm/util/util-model';
// using {cm.Approval_Mst as arlMstSuper} from '../../cm/CM_APPROVAL_MST-model';
// using {dp.VI_Base_Price_Arl_Dtl as arlDetail} from './DP_VI_BASE_PRICE_ARL_DTL-model';

entity VI_Base_Price_Arl_Mst {
    key tenant_id                   : String(5) not null;
    key approval_number             : String(30) not null;

        // details                     : Composition of many arlDetail
        //                                   on  details.tenant_id       = tenant_id
        //                                   and details.approval_number = approval_number;

        // approval_number_fk        : Association to arlMstSuper
        //                                 on  approval_number_fk.tenant_id       = tenant_id
        //                                 and approval_number_fk.approval_number = approval_number;
};
extend VI_Base_Price_Arl_Mst with util.Managed;

annotate VI_Base_Price_Arl_Mst with @title : '개발단가 품의 마스터'  @description : '개발단가 품의 마스터';
annotate VI_Base_Price_Arl_Mst with {
    tenant_id                @title : '테넌트ID'  @description    : '테넌트ID(CM_ORG_TENANT, TENANT_ID)';
    approval_number          @title : '품의번호'  @description     : '품의번호';
};