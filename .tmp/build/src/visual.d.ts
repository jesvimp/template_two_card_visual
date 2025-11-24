import "core-js/stable";
import "regenerator-runtime/runtime";
import "../style/visual.less";
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import "core-js/stable";
import "regenerator-runtime/runtime";
import "../style/visual.less";
/**
 * visual.tsx
 * What this file does:
 * - Implements the Power BI visual lifecycle (constructor, update, destroy).
 * - Creates a React root and re-renders on each update.
 * - Turns the DataView into a simple ViewModel (via transform), then renders cards.
 * - Implements enumerateObjectInstances so your Format pane works.
 */
export declare class Visual implements IVisual {
    private host;
    private selectionManager;
    private container;
    private root;
    private viewModel;
    /**
     * constructor
     * Called once when the visual is created.
     * We create a container <div>, attach it to Power BI’s provided element,
     * create a React root, and perform an initial render.
     */
    constructor(options: VisualConstructorOptions);
    /**
     * update
     * Called whenever Power BI has new data, the visual is resized,
     * or the user changes something (like settings).
     * We rebuild the ViewModel and trigger a render.
     */
    update(options: VisualUpdateOptions): void;
    /**
     * keyForSelectionId
     * Converts a selection ID (Power BI internal object) to a stable string key.
     * We use this to track which rows are selected when re-rendering.
     */
    private keyForSelectionId;
    /**
     * render
     * React render. We:
     * - compute which items are currently selected,
     * - render one TwoFieldCard per row,
     * - wire clicks to the selection manager (supports Ctrl/Cmd for multi-select).
     */
    private render;
    /**
     * enumerateObjectInstances
     * This is how the Format pane reads your settings.
     * For each "object" defined in capabilities.json, return an array with a single
     * instance describing current values. Power BI will render controls accordingly.
     */
    enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    /**
     * destroy
     * Called when the visual is removed. We unmount React to free resources.
     */
    destroy(): void;
}
export default Visual;
