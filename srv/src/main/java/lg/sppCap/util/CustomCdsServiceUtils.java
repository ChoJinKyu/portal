/**************************************************************************
 * (C) 2019-2020 SAP SE or an SAP affiliate company. All rights reserved. *
 **************************************************************************/
package lg.sppCap.util;

import java.util.List;
import java.util.Map;

import com.sap.cds.Result;
import com.sap.cds.SessionContext;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CdsUpsertEventContext;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.utils.CdsErrorStatuses;
import com.sap.cds.services.utils.ErrorStatusException;
import com.sap.cds.services.utils.SessionContextUtils;
import com.sap.cds.util.PathExpressionResolver;

/**
 * Utility class for CDS Services
 * This sources from "com.sap.cds.services.impl.utils.CdsServiceUtils"
 */
public class CustomCdsServiceUtils {

	/**
	 * Returns the default persistence service.
	 * @param context the current context
	 * @return the default persistence service
	 */
	public static PersistenceService getDefaultPersistenceService(EventContext context) {
		return context.getServiceCatalog().getService(PersistenceService.class, PersistenceService.DEFAULT_NAME);
	}

	/**
	 * Returns the list of entity maps present in the {@link EventContext}.
	 * This method only works for {@link CdsService#EVENT_CREATE}, {@link CdsService#EVENT_UPDATE} and {@link CdsService#EVENT_UPSERT}.
	 * It inspects the CQN of these events and returns the entity data from it.
	 *
	 * @param context the {@link EventContext}
	 * @return the list of entity maps available in the CQN of the {@link EventContext}
	 */
	public static List<Map<String, Object>> getEntities(EventContext context) {
		switch(context.getEvent()) {
		case CdsService.EVENT_CREATE:
			return context.as(CdsCreateEventContext.class).getCqn().entries();
		case CdsService.EVENT_UPDATE:
			return context.as(CdsUpdateEventContext.class).getCqn().entries();
		case CdsService.EVENT_UPSERT:
			return context.as(CdsUpsertEventContext.class).getCqn().entries();
		default:
			throw new ErrorStatusException(CdsErrorStatuses.UNEXPECTED_EVENT, context.getEvent());
		}
	}

	/**
	 * Returns the list of entity maps present in the {@link EventContext}.
	 * This method only works for {@link CdsService#EVENT_CREATE}, {@link CdsService#EVENT_UPDATE} and {@link CdsService#EVENT_UPSERT}.
	 * It inspects the CQN of these events and returns the entity data from it.
	 * In contrast to {link {@link #getEntities(EventContext)} the data also contains
	 * the resolved foreign keys from parent entities in path expressions.
	 *
	 * @param context the {@link EventContext}
	 * @return the list of entity maps available in the CQN of the {@link EventContext}
	 */
	public static List<Map<String, Object>> getEntitiesResolved(EventContext context) {
		SessionContext sessionContext = SessionContextUtils.toSessionContext(context);
		switch(context.getEvent()) {
		case CdsService.EVENT_CREATE:
			return PathExpressionResolver.resolvePath(context.getModel(),
					sessionContext,
					context.as(CdsCreateEventContext.class).getCqn()).entries();
		case CdsService.EVENT_UPDATE:
			return PathExpressionResolver.resolvePath(context.getModel(),
					sessionContext,
					context.as(CdsUpdateEventContext.class).getCqn()).entries();
		case CdsService.EVENT_UPSERT:
			return PathExpressionResolver.resolvePath(context.getModel(),
					sessionContext,
					context.as(CdsUpsertEventContext.class).getCqn()).entries();
		default:
			throw new ErrorStatusException(CdsErrorStatuses.UNEXPECTED_EVENT, context.getEvent());
		}
	}

	/**
	 * Returns the {@link Result} present in the {@link EventContext}.
	 * This method only works for the default CRUD events.
	 *
	 * @param context the {@link EventContext}
	 * @return the {@link Result} present in the {@link EventContext}
	 */
	public static Result getResult(EventContext context) {
		switch(context.getEvent()) {
		case CdsService.EVENT_READ:
			return context.as(CdsReadEventContext.class).getResult();
		case CdsService.EVENT_CREATE:
			return context.as(CdsCreateEventContext.class).getResult();
		case CdsService.EVENT_UPDATE:
			return context.as(CdsUpdateEventContext.class).getResult();
		case CdsService.EVENT_UPSERT:
			return context.as(CdsUpsertEventContext.class).getResult();
		case CdsService.EVENT_DELETE:
			return context.as(CdsDeleteEventContext.class).getResult();
		default:
			throw new ErrorStatusException(CdsErrorStatuses.UNEXPECTED_EVENT, context.getEvent());
		}
	}

}
