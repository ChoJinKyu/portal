sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	// Very simple page-context personalization
	// persistence service, not for productive use!
	var DemoPersoService = {

		oData : {
			_persoSchemaVersion: "1.0",
			aColumns : [
				{
					id: "demoApp-moldMstTable-familyFlagCol",
					order: 7,
					text: "Family Y/N",
					visible: true
				},
				{
					id: "demoApp-moldMstTable-productionTypeCol",
					order: 8,
					text: "Production Type",
					visible: true
				},
				{
					id: "demoApp-moldMstTable-itemTypeCol",
					order: 9,
					text: "Item Type",
					visible: true
				},
				{
					id: "demoApp-moldMstTable-moldTypeCol",
					order: 10,
					text: "Mold Type",
					visible: true
				},
				{
					id: "demoApp-moldMstTable-eDTypeCol",
					order: 11,
					text: "Export/Domestic Type",
					visible: true
				}
			]
		},

		getPersData : function () {
			var oDeferred = new jQuery.Deferred();
			if (!this._oBundle) {
				this._oBundle = this.oData;
			}
			var oBundle = this._oBundle;
			oDeferred.resolve(oBundle);
			return oDeferred.promise();
		},

		setPersData : function (oBundle) {
			var oDeferred = new jQuery.Deferred();
			this._oBundle = oBundle;
			oDeferred.resolve();
			return oDeferred.promise();
		},

		resetPersData : function () {
			var oDeferred = new jQuery.Deferred();
			var oInitialData = {
					_persoSchemaVersion: "1.0",
					aColumns : [
					{
								id: "demoApp-moldMstTable-familyFlagCol",
									order: 0,
									text: "Family Y/N",
									visible: true
								},
								{
									id: "demoApp-moldMstTable-productionTypeCol",
									order: 1,
									text: "Production Type",
									visible: false
								},
								{
									id: "demoApp-moldMstTable-itemTypeCol",
									order: 2,
									text: "Item Type",
									visible: false
								},
								{
									id: "demoApp-moldMstTable-moldTypeCol",
									order: 3,
									text: "Mold Type",
									visible: true
								},
								{
									id: "demoApp-moldMstTable-eDTypeCol",
									order: 4,
									text: "Export/Domestic Type",
									visible: true
								}
							]
			};

			//set personalization
			this._oBundle = oInitialData;

			//reset personalization, i.e. display table as defined
	//		this._oBundle = null;

			oDeferred.resolve();
			return oDeferred.promise();
		},

		//this caption callback will modify the TablePersoDialog' entry for the 'Weight' column
		//to 'Weight (Important!)', but will leave all other column names as they are.
		getCaption : function (oColumn) {
			if (oColumn.getHeader() && oColumn.getHeader().getText) {
				if (oColumn.getHeader().getText() === "Weight") {
					return "Weight (Important!)";
				}
			}
			return null;
		},

		getGroup : function(oColumn) {
			if ( oColumn.getId().indexOf('familyFlag') != -1 ||
					oColumn.getId().indexOf('productionType') != -1) {
				return "Primary Group";
			}
			return "Secondary Group";
		}
	};

	return DemoPersoService;

});
