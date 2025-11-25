import "core-js/stable";
import "regenerator-runtime/runtime";
import "../style/visual.less"
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;

import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ISelectionManager = powerbi.extensibility.ISelectionManager;

import "core-js/stable";
import "regenerator-runtime/runtime";
import "../style/visual.less";

import * as React from "react";
import { createRoot, Root } from "react-dom/client";

import { transform, ViewModel, parseSettings } from "./model";
import { TwoFieldCard } from "./components/TwoFieldCard";




/**
 * visual.tsx
 * What this file does:
 * - Implements the Power BI visual lifecycle (constructor, update, destroy).
 * - Creates a React root and re-renders on each update.
 * - Turns the DataView into a simple ViewModel (via transform), then renders cards.
 * - Implements enumerateObjectInstances so your Format pane works.
 */

/*
We are gonna use the word render quite a lot. this is the exercise of turning the components into 
what what you see in the UI  - turn it to pixels. When we re-render, only changes are reflected on the components - we do not
completely changed th inital components, but adjust it for any changes
*/


export class Visual implements IVisual {
  /* Power BI services we use:
     - host: gives us selection manager, locale, etc.
     - selectionManager: enables cross-filter selection when the user clicks. */
  private host: IVisualHost;
  private selectionManager: ISelectionManager;

  /* DOM + React root for rendering */
  private container: HTMLElement;
  private root: Root;

  /* Latest view model (data + settings) we render and use for the Format pane */
  private viewModel: ViewModel = {
    items: [],
    settings: parseSettings() // defaults when no DataView yet
  };

  /**
   * constructor
   * Called once when the visual is created.
   * We create a container <div>, attach it to Power BI’s provided element,
   * create a React root, and perform an initial render.
   */
  constructor(options: VisualConstructorOptions) {
    this.host = options.host;
    this.selectionManager = this.host.createSelectionManager();

    // Create and attach a container for React to render into
    this.container = document.createElement("div");
    this.container.className = "visual-root";
    options.element.appendChild(this.container);

    // React 18 root
    this.root = createRoot(this.container);

    // Initial render (empty items + default settings)
    this.render();
  }

  /**
   * update
   * Called whenever Power BI has new data, the visual is resized,
   * or the user changes something (like settings).
   * We rebuild the ViewModel and trigger a render.
   */
  public update(options: VisualUpdateOptions) {
    // options.dataViews is an array; we use the first one
    this.viewModel = transform(this.host, options.dataViews?.[0]);
    this.render();
  }

  /**
   * keyForSelectionId
   * Converts a selection ID (Power BI internal object) to a stable string key.
   * We use this to track which rows are selected when re-rendering.
   */
  private keyForSelectionId(id: powerbi.extensibility.ISelectionId | undefined): string | undefined {
    if (!id) return undefined;
    const anyId = id as any;
    try {
      if (typeof anyId.getKey === "function") return anyId.getKey();
      if (typeof anyId.getSelector === "function") return JSON.stringify(anyId.getSelector());
    } catch {
      // If anything goes wrong, fall through to String(id)
    }
    return String(id);
  }

  /**
   * render
   * React render. We:
   * - compute which items are currently selected,
   * - render one TwoFieldCard per row,
   * - wire clicks to the selection manager (supports Ctrl/Cmd for multi-select).
   */
  private render() {
    const { items, settings } = this.viewModel;

    // Build a Set of selected keys so each card can know if it's selected
    const selectedKeys = new Set(
      (this.selectionManager.getSelectionIds() || [])
        .map(id => this.keyForSelectionId(id))
        .filter((k): k is string => !!k)
    );

    // Cards list
    const cards = (
      <div className="cards">
        {items.map((item, i) => {
          const key = this.keyForSelectionId(item.identity) ?? `row-${i}`;
          const selected = key ? selectedKeys.has(key) : false;

          return (
            <TwoFieldCard
              key={key}
              item={item}
              settings={settings}
              selected={selected}
              onClick={(e) => {
                // Hold Ctrl/Cmd to multi-select
                const multi = e.ctrlKey || e.metaKey;
                if (item.identity) {
                  this.selectionManager
                    .select(item.identity, multi)
                    .then(() => this.render()); // re-render to reflect selection state
                }
              }}
            />
          );
        })}
      </div>
    );

    // Push the virtual DOM to the actual DOM
    this.root.render(cards);
  }

  /**
   * enumerateObjectInstances
   * This is how the Format pane reads your settings.
   * For each "object" defined in capabilities.json, return an array with a single
   * instance describing current values. Power BI will render controls accordingly.
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstanceEnumeration {
    const s = this.viewModel.settings;

    switch (options.objectName) {
      case "card":
        return [{
          objectName: "card",
          properties: {
            backgroundColor: { solid: { color: s.cardBackground } },
            padding: s.padding,
            cornerRadius: s.cornerRadius,
            shadow: s.shadow
          },
          selector: null // null means "visual-level" settings, not data-point scoped
        }];

      case "field1Style":
        return [{
          objectName: "field1Style",
          properties: {
            color:           { solid: { color: s.field1.color } },
            backgroundColor: { solid: { color: s.field1.backgroundColor } },
            fontSize:        s.field1.fontSize
          },
          selector: null
        }];

      case "field2Style":
        return [{
          objectName: "field2Style",
          properties: {
            color:           { solid: { color: s.field2.color } },
            backgroundColor: { solid: { color: s.field2.backgroundColor } },
            fontSize:        s.field2.fontSize
          },
          selector: null
        }];

      default:
        // If Desktop asks about unsupported objects, return an empty list
        return [];
    }
  }

  /**
   * destroy
   * Called when the visual is removed. We unmount React to free resources.
   */
  public destroy(): void {
    this.root.unmount();
  }
}

export default Visual;