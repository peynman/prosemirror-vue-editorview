<template>
  <component data-parser-id="pm-grid" :is="rootComponent" v-bind="rootComponentProps"></component>
</template>

<script>
import { wrapNodeOfTypeWithTypeCommand, ComponentUpdateNode } from "./helpers";

const commands = {
  insertGrid: args => (state, dispatch, editorView) =>
    wrapNodeOfTypeWithTypeCommand(
      state.schema.nodes.paragraph,
      state.schema.nodes.grid,
      args
    )(state, dispatch, editorView)
};

const isActive = {
  insertGrid: state => false
};

export default {
  name: "pm-grid",
  props: {
    mode: String,
    col: Object
  },
  computed: {
    rootComponent: function() {
      switch (this.mode) {
        case "row":
          return "v-row";
        case "column":
          return "v-col";
      }
    },
    rootComponentProps: function() {
      switch (this.mode) {
        case "row":
          return {};
        case "column":
          return {
            ...this.col
          };
      }
    }
  },
  spec: {
    menuItems: {
      insertRow: {
        type: "btn",
        title: "Insert Row",
        icon: "mdi-view-agenda",
        command: commands.insertGrid({
          mode: "row"
        }),
        update: ComponentUpdateNode,
        isActive: false,
        isVisible: false
      },
      insertColumn: {
        type: "btn",
        title: "Insert Column",
        icon: "mdi-view-column",
        command: commands.insertGrid({
          mode: "column",
          col: { sm: 12 }
        }),
        update: ComponentUpdateNode,
        isActive: false,
        isVisible: false
      }
    }
  },
  nodes: {
    grid: {
      attrs: {
        mode: { default: "row" },
        col: { default: null }
      },
      content: "block+",
      group: "block",
      defining: true,
      parseDOM: [
        {
          tag: 'div[class="row"][data-parser-id="pm-grid"]',
          getAttrs: dom => {
            return {
              mode: "row"
            };
          }
        },
        {
          tag: 'div[class^="col-"][data-parser-id="pm-grid"]',
          getAttrs: dom => {
            return {
              mode: "column"
            };
          }
        }
      ],
      toDOM: node => [
        "pm-grid",
        {
          ...node.attrs
        },
        0
      ]
    }
  }
};
</script>
