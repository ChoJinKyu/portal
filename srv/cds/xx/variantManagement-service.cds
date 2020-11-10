namespace xx;

using {xx as VarMngt} from '../../../db/cds/xx/testTable/XX_VARIANT_MANAGEMENT-model';

@path : '/xx.VariantManagement'
service VariantManagement {
    entity VariantManagementMain as projection on VarMngt.Variant_Management_Main;
    entity VariantManagementSub  as projection on VarMngt.Variant_Management_Sub;
}
