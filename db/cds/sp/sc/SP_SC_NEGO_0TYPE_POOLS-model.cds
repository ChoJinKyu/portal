namespace sp;

/*********************************** Local Type ************************************/
type CurrencyT   : String(5)      @title: '{i18n>currency}';
type AmountT     : Decimal(28,2);
type PriceAmountT: Decimal(28,5);
type UnitT       : String(3)      @title: '{i18n>quantityUnit}';
type QuantityT   : Decimal(28,3)  @(title: '{i18n>quantity}');
// type QuantityT   : Decimal(28,3)  @(title: '{i18n>quantity}', Measures.Unit: Units.Quantity );
/***********************************************************************************/
