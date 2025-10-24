// src/visual.tsx
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import powerbi from "powerbi-visuals-api";
import ReactCircleCard from "./component";
import "../style/visual.less";

export class Visual implements powerbi.extensibility.visual.IVisual {
  private root: Root;

  constructor(options: powerbi.extensibility.visual.VisualConstructorOptions) {
    this.root = createRoot(options.element);
    this.root.render(<ReactCircleCard />);
  }

  public update(options: powerbi.extensibility.visual.VisualUpdateOptions) {
    const dv = options.dataViews?.[0];
    let categoryPreview: string | undefined;
    let valuesPreview: string | undefined;

    const cat = dv?.categorical?.categories?.[0];
    if (cat && cat.values && cat.values.length > 0) {
      const v = cat.values[0];
      categoryPreview = v !== null && v !== undefined ? String(v) : undefined;
    }

    const val = dv?.categorical?.values?.[0];
    if (val && Array.isArray(val.values)) {
      const take = (val.values as any[]).slice(0, 10);
      const nums = take.map(x => (typeof x === "number" ? x : Number(x))).filter(n => !isNaN(n));
      const sum = nums.reduce((a, b) => a + b, 0);
      valuesPreview = nums.length > 0 ? `sum(10)=${sum}` : undefined;
    }

    this.root.render(<ReactCircleCard categoryPreview={categoryPreview} valuesPreview={valuesPreview} />);
  }
}