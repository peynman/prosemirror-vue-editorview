<template>
  <v-card data-parser-id="pm-card"></v-card>
</template>

<script>
import { wrapNodeOfTypeWithTypeCommand, ComponentUpdateNode } from "./helpers";
import CardTitle from './CardTitle.vue'

const commands = {
  insertCard: args => (state, dispatch, editorView) => {
    return wrapNodeOfTypeWithTypeCommand(
      state.schema.nodes.paragraph,
      state.schema.nodes.card,
      args
    )(state, dispatch, editorView);
  }
};

export default {
  name: "pm-card",
  props: {},
  spec: {
    commands,
    menuItems: {
      insertCard: {
        type: "btn",
        title: "Insert Card",
        icon: "mdi-card",
        command: commands.insertCard({}),
        update: ComponentUpdateNode,
        dropdown: [
          CardTitle.spec.menuItems.insertCardTitle,
        ],
        isActive: false,
        isVisible: false
      }
    }
  },
  nodes: {
    ...CardTitle.nodes,
    card: {
      content: "cardTitle* block+",
      group: "block",
      parseDOM: [
        {
          tag: "div",
          attrs: {
            "parser-id": "pm-card"
          }
        }
      ],
      toDOM() {
        return ["pm-card", 0];
      }
    }
  }
};
</script>