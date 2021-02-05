package lg.sppCap.util;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnElementRef;
import com.sap.cds.ql.cqn.CqnStatement;
import com.sap.cds.ql.cqn.CqnStructuredTypeRef;
import com.sap.cds.reflect.CdsAction;
import com.sap.cds.reflect.CdsAssociationType;
import com.sap.cds.reflect.CdsElement;
import com.sap.cds.reflect.CdsEntity;
import com.sap.cds.reflect.CdsFunction;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.reflect.CdsService;
import com.sap.cds.reflect.impl.CdsModelReader;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.utils.CdsErrorStatuses;
import com.sap.cds.services.utils.ErrorStatusException;
import com.sap.cds.services.utils.StringUtils;
import com.sap.cds.services.utils.model.CdsAnnotations;
import com.sap.cds.services.utils.model.Privilege;

/**
 * copied from com.sap.cds.services.utils.model.CdsModelUtils
 */
public class CustomCdsModelUtils {

    private static final Logger log = LoggerFactory.getLogger(CustomCdsModelUtils.class);

    private CustomCdsModelUtils() {
        // hidden
    }

    /**
     * Loads the CDS model from current classloader's resource at the given
     * location.
     *
     * @param resourcePathToCSN The resource path of the CDS model file within the
     *                          current classloader
     *
     * @return The loaded model
     */
    public static CdsModel loadCdsModel(String resourcePathToCSN) { // NOSONAR
        if (StringUtils.isEmpty(resourcePathToCSN)) {
            return CdsModelReader.read(new ByteArrayInputStream("{}".getBytes(StandardCharsets.UTF_8)), true);
        }

        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        try (InputStream is = classloader.getResourceAsStream(resourcePathToCSN)) {
            CdsModel csnModel = CdsModelReader.read(new BufferedInputStream(is), true);

            log.info("Loaded CDS model from CSN resource path '{}'", resourcePathToCSN);
            return csnModel;

        } catch (Exception e) { // NOSONAR
            throw new ErrorStatusException(CdsErrorStatuses.INVALID_CSN, resourcePathToCSN, e);
        }
    }

    /**
     * Returns the qualified name of the entity or an empty string, if no entity is
     * provided
     * 
     * @param entity the entity
     * @return the qualified name of the entity or an empty string
     */
    public static String getNameOrEmpty(CdsEntity entity) {
        if (entity == null) {
            return "";
        }

        return entity.getQualifiedName();
    }

    /**
     * Tries to resolve the CDS entity with the given full-qualified name in the
     * given CDS model.
     *
     * @param entityName The name of the CDS entity to be resolved
     * @param model      The model to search
     * @return The {@link CdsEntity} object representing the entity in the CDS model
     *
     * @throws ServiceException In case the name can't be resolved (error code 404)
     */
    public static CdsEntity getEntityOrThrow(CdsModel model, String entityName) {
        return model.findEntity(entityName)
                .orElseThrow(() -> new ErrorStatusException(CdsErrorStatuses.ENTITY_NOT_FOUND, entityName));
    }

    /**
     * Tries to resolve the service with the given full-qualified name in the given
     * CDS model.
     *
     * @param serviceName The name of the service to be resolved
     * @param model       The model to search
     * @return The {@link CdsService} object representing the service in the CDS
     *         model
     *
     * @throws ServiceException In case the name can't be resolved (error code 404)
     */
    public static CdsService getServiceOrThrow(CdsModel model, String serviceName) {
        return model.findService(serviceName)
                .orElseThrow(() -> new ErrorStatusException(CdsErrorStatuses.SERVICE_NOT_FOUND, serviceName));
    }

    /**
     * Tries to resolve the CDS action with the given full-qualified name in the
     * given CDS model.
     *
     * @param actionName The name of the CDS action to be resolved
     * @param model      The model to search
     * @param entityName The entity name
     * @return The {@link CdsAction} object representing the entity in the CDS model
     *
     * @throws ServiceException In case the name can't be resolved (error code 404)
     */
    public static Optional<CdsAction> getAction(CdsModel model, String entityName, String actionName) {

        if (entityName == null) {
            // unbound action has full qualified name
            return model.findAction(actionName);
        } else {
            // bound action has only a name
            return model.findEntity(entityName)
                    .orElseThrow(() -> new ErrorStatusException(CdsErrorStatuses.ENTITY_NOT_FOUND, entityName))
                    .findAction(actionName);
        }
    }

    /**
     * Tries to resolve the CDS function with the given full-qualified name in the
     * given CDS model.
     *
     * @param functionName The name of the CDS function to be resolved
     * @param model        The model to search
     * @param entityName   The entity name
     * @return The {@link CdsFunction} object representing the function in the CDS
     *         model
     *
     * @throws ServiceException In case the name can't be resolved (error code 404)
     */
    public static Optional<CdsFunction> getFunction(CdsModel model, String entityName, String functionName) {

        if (entityName == null) {
            // unbound action has full qualified name
            return model.findFunction(functionName);
        } else {
            // bound action has only a name
            return model.findEntity(entityName)
                    .orElseThrow(() -> new ErrorStatusException(CdsErrorStatuses.ENTITY_NOT_FOUND, entityName))
                    .findFunction(functionName);
        }
    }

    /**
     * Reduces the elements of the entity, to map elements associations with their
     * corresponding key element. For example, for an element "parent : Association
     * to Parent" another element "parent_ID" is added to the entity, when doing an
     * OData transformation. The stream of elements returned by this method would
     * return the parent_ID element (key) paired with the parent element (value)
     * 
     * @param entity the entity to reduce the association elements for
     * @return a map with the paired association elements, still contains all
     *         non-association and non-paired elements with a value of
     *         <code>null</code>
     */
    public static Map<CdsElement, CdsElement> reduceAssociationElements(CdsEntity entity) {
        Map<CdsElement, CdsElement> pairs = new HashMap<>();
        entity.elements().forEach(element -> {
            String structuredElementName = CdsAnnotations.ODATA_FOREIGN_KEY_FOR.getOrDefault(element);
            if (structuredElementName != null) {
                CdsElement structuredElement = entity.getElement(structuredElementName);
                // add element with it's structured element pair
                pairs.put(element, structuredElement);
                // remove potentially added pair element
                pairs.remove(structuredElement);
            } else if (!pairs.containsValue(element)) {
                // only add the element if it is not added as part of a pair value already
                pairs.put(element, null);
            }
        });
        return pairs;
    }

    /**
     * Returns the elements of the association target, that represent the keys of
     * this association. This can be either the keys of the association target (in
     * case of managed associations). In cases of unmanaged associations these are
     * the elements of the association target, mentioned in the ON condition of the
     * association. The elements returned by this method can be assumed to be
     * auto-filled in by CDS4J as they can be inferred from the association parent.
     *
     * @param element the association element to analyze
     * @return the keys of the association, or an empty list of the element is
     *         <code>null</code> or not an association
     */
    public static List<CdsElement> getAssociationKeys(CdsElement element) {
        List<CdsElement> keyElements = new ArrayList<>();

        if (element != null && element.getType().isAssociation()) {
            CdsAssociationType association = element.getType().as(CdsAssociationType.class);
            if (association.onCondition().isPresent()) {
                association.onCondition().get().tokens().forEach(token -> {
                    if (token instanceof CqnElementRef) {
                        CqnElementRef ref = (CqnElementRef) token;
                        // reference starts with the association name
                        // therefore the second segment is the name of the element in the assocation
                        // target
                        if (element.getName().equals(ref.firstSegment()) && ref.segments().size() >= 2) {
                            Optional<CdsElement> condElement = association.getTarget()
                                    .findElement(ref.segments().get(1).id());
                            if (condElement.isPresent()) {
                                keyElements.add(condElement.get());
                            }
                        }
                    }
                });
            } else {
                association.keys().forEach(key -> keyElements.add(key));
            }
        }

        return keyElements;
    }

    /**
     * Checks if the field is a composition or an association to a parent entity
     * 
     * @param field  the field name
     * @param entity the entity
     * @return {@code true} if the field is a composition or an association to a
     *         parent entity
     */
    public static boolean isAssociationToParentOrChild(String field, CdsEntity entity) {
        return isAssociationToParent(field, entity) || isComposition(field, entity);
    }

    private static CdsAssociationType getAssociationType(String field, CdsEntity entity) {
        Optional<CdsElement> optionalAssociation = entity.findAssociation(field);
        if (optionalAssociation.isPresent()) {
            return optionalAssociation.get().getType().as(CdsAssociationType.class);
        }
        return null;
    }

    public static boolean isAssociationToParent(String field, CdsEntity entity) {
        CdsAssociationType type = getAssociationType(field, entity);
        if (type != null) {
            if (type.getTarget().compositions()
                    .anyMatch(c -> c.getType().as(CdsAssociationType.class).getTarget().equals(entity))) {
                return true;
            }
        }
        return false;
    }

    public static boolean isComposition(String field, CdsEntity entity) {
        CdsAssociationType type = getAssociationType(field, entity);
        if (type != null) {
            return type.isComposition();
        }
        return false;
    }

    /**
     * Returns the target of an association.
     * 
     * @param field  the field name
     * @param entity the entity
     * @return the target of the association or {@code null} if the {@code field} is
     *         no association or does not exist
     */
    public static CdsEntity getAssociationTarget(String field, CdsEntity entity) {
        if (entity.findAssociation(field).isPresent()) {
            return entity.getTargetOf(field);
        }
        return null;
    }

    /**
     * Traverses the given entity data together with the entity metadata. The
     * {@link EntityDataVisitor} is called for the given data and entity and then
     * for each association with the respective entity data of the association. This
     * happens recursively until either no further associations can be found, or no
     * more nested data is available
     *
     * @param entity  the root entity
     * @param data    the list of entity data sets for the root entity
     * @param visitor the visitor to use to visit the data together with the entity
     *                metadata
     */
    public static void visitDeep(CdsEntity entity, List<? extends Map<String, Object>> data,
            EntityDataVisitor visitor) {
        visitDeep(entity, data, null, visitor);
    }

    /**
     * Traverses the given entity data together with the entity metadata. The
     * {@link EntityDataVisitor} is called for the given data and entity and then
     * for each association with the respective entity data of the association. This
     * happens recursively until either no further associations can be found, or no
     * more nested data is available
     *
     * @param entity  the entity
     * @param data    the list of entity data sets for the entity
     * @param parent  the element from which the parent entity referred to this
     *                entity. For root entities this is <code>null</code>
     * @param visitor the visitor to use to visit the data together with the entity
     *                metadata
     */
    @SuppressWarnings("unchecked")
    private static void visitDeep(CdsEntity entity, List<? extends Map<String, Object>> data, CdsElement parent,
            EntityDataVisitor visitor) {
        if (data == null || data.isEmpty()) {
            return;
        }

        // visit the entity with its data
        visitor.visit(entity, data, parent);

        entity.associations().forEach(association -> {
            CdsAssociationType type = association.getType().as(CdsAssociationType.class);

            // gather all available data along this association in all available entities
            List<Map<String, Object>> associationData = new ArrayList<>();
            data.forEach(map -> {
                Object d = map.get(association.getName());
                if (d != null) {
                    // association to one
                    if (d instanceof Map<?, ?>) {
                        associationData.add((Map<String, Object>) d);
                        // association to many
                    } else if (d instanceof List<?>) {
                        associationData.addAll((List<Map<String, Object>>) d);
                    }
                }
            });

            visitDeep(type.getTarget(), associationData, association, visitor);
        });
    }

    /**
     * Traverses the given entity data together with the entity metadata. The
     * {@link EntitySingleDataVisitor} is called for the given data and entity and
     * then for each association with the respective entity data of the association.
     * For "to many" associations, the {@code visitor} is called for each element.
     * This happens recursively until either no further associations can be found,
     * or no more nested data is available
     *
     * @param entity  the root entity
     * @param data    the of the root entity
     * @param visitor the visitor to use to visit the data together with the entity
     *                metadata
     */
    public static void visitDeep(CdsEntity entity, Map<String, Object> data, EntitySingleDataVisitor visitor) {
        visitDeep(entity, data, null, null, visitor);
    }

    /**
     * Traverses the given entity data together with the entity metadata. The
     * {@link EntitySingleDataVisitor} is called for the given data and entity and
     * then for each association with the respective entity data of the association.
     * For "to many" associations, the {@code visitor} is called for each element.
     * This happens recursively until either no further associations can be found,
     * or no more nested data is available
     *
     * @param entity     the root entity
     * @param data       the of the root entity
     * @param parent     the element from which the parent entity referred to this
     *                   entity. For root entities this is <code>null</code>
     * @param parentData the data of the parent entity. For root entities this is
     *                   <code>null</code>
     * @param visitor    the visitor to use to visit the data together with the
     *                   entity metadata
     */
    @SuppressWarnings("unchecked")
    private static void visitDeep(CdsEntity entity, Map<String, Object> data, CdsElement parent,
            Map<String, Object> parentData, EntitySingleDataVisitor visitor) {
        if (data == null) {
            return;
        }

        visitor.visit(entity, data, parent, parentData);
        entity.associations().forEach(association -> {
            CdsAssociationType type = association.getType().as(CdsAssociationType.class);
            Object d = data.get(association.getName());
            if (d != null) {
                if (d instanceof Map) {
                    visitDeep(type.getTarget(), (Map<String, Object>) d, association, data, visitor);
                } else if (d instanceof List) {
                    ((List<Map<String, Object>>) d)
                            .forEach(e -> visitDeep(type.getTarget(), e, association, data, visitor));
                }
            }
        });
    }

    /**
     * Functional interface for entity data visitors. The visitor can be used to
     * traverse a data set deeply with it's entity metadata available
     */
    @FunctionalInterface
    public static interface EntityDataVisitor {

        /**
         * Visits the entity data together with it's metadata from the CDS model
         * 
         * @param entity the entity meta definition
         * @param data   the list of available entity data
         * @param parent the element from which the parent entity referred to this
         *               entity. For root entities this is <code>null</code>
         */
        void visit(CdsEntity entity, List<? extends Map<String, Object>> data, CdsElement parent);

    }

    /**
     * Functional interface for entity data visitors. The visitor can be used to
     * traverse a data set deeply with it's entity metadata available
     */
    @FunctionalInterface
    public static interface EntitySingleDataVisitor {

        /**
         * Visits the entity data together with it's metadata from the CDS model
         * 
         * @param entity     the entity meta definition
         * @param data       the entity data
         * @param parent     the element from which the parent entity referred to this
         *                   entity. For root entities this is <code>null</code>
         * @param parentData the data of the parent entity
         */
        void visit(CdsEntity entity, Map<String, Object> data, CdsElement parent, Map<String, Object> parentData);
    }

    public static AnalysisResult getEntityPath(CqnStatement statement, CdsModel model) {
        if (statement.isSelect() && statement.asSelect().from().isSelect()) {
            return getEntityPath(statement.asSelect().from().asSelect(), model);
        }
        return getEntityPath(statement.ref(), model);
    }

    public static CdsEntity getTargetEntity(CqnStatement statement, CdsModel model) {
        return getEntityPath(statement, model).targetEntity();
    }

    public static AnalysisResult getEntityPath(CqnStructuredTypeRef ref, CdsModel model) {
        return com.sap.cds.services.utils.model.CdsModelUtils.getEntityPath(ref, model);
    }

    public static boolean isStandardCdsEvent(String event) {
        return event.equals(com.sap.cds.services.cds.CdsService.EVENT_READ)
                || event.equals(com.sap.cds.services.cds.CdsService.EVENT_CREATE)
                || event.equals(com.sap.cds.services.cds.CdsService.EVENT_UPDATE)
                || event.equals(com.sap.cds.services.cds.CdsService.EVENT_DELETE)
                || event.equals(com.sap.cds.services.cds.CdsService.EVENT_UPSERT)
                || event.equals(DraftService.EVENT_DRAFT_NEW) || // none-actions!
                event.equals(DraftService.EVENT_DRAFT_PATCH) || event.equals(DraftService.EVENT_DRAFT_CANCEL)
                || event.equals(DraftService.EVENT_DRAFT_CREATE);
    }

    public static boolean isWriteEvent(String event) {
        return event.equals(com.sap.cds.services.cds.CdsService.EVENT_CREATE)
                || event.equals(com.sap.cds.services.cds.CdsService.EVENT_DELETE)
                || event.equals(com.sap.cds.services.cds.CdsService.EVENT_UPDATE)
                || event.equals(com.sap.cds.services.cds.CdsService.EVENT_UPSERT)
                || event.equals(DraftService.EVENT_DRAFT_SAVE) || event.equals(DraftService.EVENT_DRAFT_EDIT)
                || event.equals(DraftService.EVENT_DRAFT_NEW) || event.equals(DraftService.EVENT_DRAFT_PATCH)
                || event.equals(DraftService.EVENT_DRAFT_PREPARE) || event.equals(DraftService.EVENT_DRAFT_CANCEL)
                || event.equals(DraftService.EVENT_DRAFT_CREATE);
    }

    public static boolean eventIsGranted(String event, String grant) {

        return (Privilege.is(event, DraftService.EVENT_DRAFT_NEW)
                && Privilege.is(grant, com.sap.cds.services.cds.CdsService.EVENT_CREATE)) ||

                (Privilege.is(event, DraftService.EVENT_DRAFT_EDIT)
                        && Privilege.is(grant, com.sap.cds.services.cds.CdsService.EVENT_UPDATE))
                ||

                (Privilege.is(event, DraftService.EVENT_DRAFT_CANCEL)
                        && (Privilege.is(grant, com.sap.cds.services.cds.CdsService.EVENT_CREATE)
                                || Privilege.is(grant, com.sap.cds.services.cds.CdsService.EVENT_UPDATE)
                                || Privilege.is(grant, com.sap.cds.services.cds.CdsService.EVENT_DELETE)))
                ||

                ((Privilege.is(event, DraftService.EVENT_DRAFT_PATCH)
                        || Privilege.is(event, DraftService.EVENT_DRAFT_SAVE)
                        || Privilege.is(event, DraftService.EVENT_DRAFT_PREPARE)
                        || Privilege.is(event, DraftService.EVENT_DRAFT_CREATE))
                        && (Privilege.is(grant, com.sap.cds.services.cds.CdsService.EVENT_CREATE)
                                || Privilege.is(grant, com.sap.cds.services.cds.CdsService.EVENT_UPDATE)));

    }

}
