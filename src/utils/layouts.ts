import React from "react";
import type { LayoutType } from "src/types/index";

export const layouts: LayoutType[] = [
  {
    id: "2-cols",
    name: "2 colonnes",
    preview: React.createElement(
      "div",
      { className: "flex gap-1 w-16 h-8" },
      React.createElement("div", { className: "flex-1 bg-gray-300 rounded" }),
      React.createElement("div", { className: "flex-1 bg-gray-300 rounded" })
    ),
    template: `\n::: flex\n::: flex-item\nContenu colonne 1\n:::\n::: flex-item\nContenu colonne 2\n:::\n:::\n`,
  },
  {
    id: "3-cols",
    name: "3 colonnes",
    preview: React.createElement(
      "div",
      { className: "flex gap-1 w-16 h-8" },
      React.createElement("div", { className: "flex-1 bg-gray-300 rounded" }),
      React.createElement("div", { className: "flex-1 bg-gray-300 rounded" }),
      React.createElement("div", { className: "flex-1 bg-gray-300 rounded" })
    ),
    template: `\n::: flex\n::: flex-item\nContenu colonne 1\n:::\n::: flex-item\nContenu colonne 2\n:::\n::: flex-item\nContenu colonne 3\n:::\n:::\n`,
  },
  {
    id: "2-cols-70-30",
    name: "2 colonnes (70/30)",
    preview: React.createElement(
      "div",
      { className: "flex gap-1 w-16 h-8" },
      React.createElement("div", {
        className: "bg-gray-300 rounded",
        style: { flex: 2.3 },
      }),
      React.createElement("div", {
        className: "bg-gray-300 rounded",
        style: { flex: 1 },
      })
    ),
    template: `\n::: flex\n::: flex-item\nContenu principal (70%)\n:::\n::: flex-item\nContenu secondaire (30%)\n:::\n:::\n`,
  },
  {
    id: "2-cols-30-70",
    name: "2 colonnes (30/70)",
    preview: React.createElement(
      "div",
      { className: "flex gap-1 w-16 h-8" },
      React.createElement("div", {
        className: "bg-gray-300 rounded",
        style: { flex: 1 },
      }),
      React.createElement("div", {
        className: "bg-gray-300 rounded",
        style: { flex: 2.3 },
      })
    ),
    template: `\n::: flex\n::: flex-item\nContenu secondaire (30%)\n:::\n::: flex-item\nContenu principal (70%)\n:::\n:::\n`,
  },
  {
    id: "float-left",
    name: "Image flottante gauche",
    preview: React.createElement(
      "div",
      { className: "flex gap-1 w-16 h-8" },
      React.createElement("div", {
        className: "bg-blue-300 rounded",
        style: { flex: "0 0 30%" },
      }),
      React.createElement(
        "div",
        { className: "flex-1 flex flex-col gap-0.5" },
        React.createElement("div", { className: "flex-1 bg-gray-300 rounded" }),
        React.createElement("div", { className: "flex-1 bg-gray-300 rounded" })
      )
    ),
    template: `\n::: float-left\n![image](url)\n:::\n\nTexte qui enveloppe l'image flottante à gauche.\n`,
  },
  {
    id: "float-right",
    name: "Image flottante droite",
    preview: React.createElement(
      "div",
      { className: "flex gap-1 w-16 h-8" },
      React.createElement(
        "div",
        { className: "flex-1 flex flex-col gap-0.5" },
        React.createElement("div", { className: "flex-1 bg-gray-300 rounded" }),
        React.createElement("div", { className: "flex-1 bg-gray-300 rounded" })
      ),
      React.createElement("div", {
        className: "bg-blue-300 rounded",
        style: { flex: "0 0 30%" },
      })
    ),
    template: `\n::: float-right\n![image](url)\n:::\n\nTexte qui enveloppe l'image flottante à droite.\n`,
  },
];
