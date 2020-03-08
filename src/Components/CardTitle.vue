<template>
  <v-card-title data-parser-id="pm-card-title"></v-card-title>
</template>

<script>
import { wrapNodeOfTypeWithTypeCommand, ComponentUpdateNode } from "./helpers";

const commands = {
  insertCardTitle: args => (state, dispatch, editorView) => {
    return wrapNodeOfTypeWithTypeCommand(
      state.schema.nodes.paragraph,
      state.schema.nodes.cardTitle,
      args
    )(state, dispatch, editorView);
  }
};

export default {
  name: "pm-card-title",
  spec: {
    commands,
    menuItems: {
      insertCardTitle: {
        type: "btn",
        title: "Insert Card title",
        icon: "mdi-view-compact",
        command: commands.insertCardTitle(
          {}
        ),
        update: ComponentUpdateNode,
        isActive: false,
        isVisible: false
      }
    }
  },
  nodes: {
    cardTitle: {
      content: "block+",
      group: "block",
      parseDOM: [
        {
          tag: 'div[data-parser-id="pm-card-title"]'
        }
      ],
      toDOM() {
        return ["pm-card-title", 0];
      }
    }
  }
};
</script>