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
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    private keyForSelectionId;
    private render;
    enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    destroy(): void;
}
export default Visual;
