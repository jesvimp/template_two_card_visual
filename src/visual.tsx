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


export class Visual implements IVisual {
  private host: IVisualHost;
  private selectionManager: ISelectionManager;

  private container: HTMLElement;
  private root: Root;

  // we keep the latest view model to render and to enumerate settings
  private viewModel: ViewModel = {
    items: [],
    settings: parseSettings()
  };

  constructor(options: VisualConstructorOptions) {
    this.host = options.host;
    this.selectionManager = this.host.createSelectionManager();

    this.container = document.createElement("div");
    this.container.className = "visual-root";
    options.element.appendChild(this.container);

    this.root = createRoot(this.container);
    this.render();
  }

  public update(options: VisualUpdateOptions) {
    this.viewModel = transform(this.host, options.dataViews && options.dataViews[0]);
    this.render();
  }

  private keyForSelectionId(id: powerbi.extensibility.ISelectionId | undefined): string | undefined {
    if (!id) return undefined;
    const anyId = id as any;
    try {
      if (typeof anyId.getKey === "function") return anyId.getKey();
      if (typeof anyId.getSelector === "function") return JSON.stringify(anyId.getSelector());
    } catch {}
    return String(id);
  }

  private render() {
    const { items, settings } = this.viewModel;
    const selectedKeys = new Set(
      (this.selectionManager.getSelectionIds() || [])
        .map(id => this.keyForSelectionId(id))
        .filter((k): k is string => !!k)
    );

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
                const multi = e.ctrlKey || e.metaKey;
                if (item.identity) {
                  this.selectionManager.select(item.identity, multi).then(() => this.render());
                }
              }}
            />
          );
        })}
      </div>
    );

    this.root.render(cards);
  }

  public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
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
          selector: null
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
        return [];
    }
  }

  public destroy(): void {
    this.root.unmount();
  }
}

export default Visual;