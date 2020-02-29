<template>
  <v-card data-parser-id="pm-card"></v-card>
</template>

<script>
import {wrapNodeOfTypeWithTypeCommand} from './helpers'

export default {
  name: "pm-card",
  props: {
  },
  spec: {
    commands: {
      insertCard: args => (state, dispatch, editorView) => {
        return         wrapNodeOfTypeWithTypeCommand(
          state.schema.nodes.paragraph,
          state.schema.nodes.card,
          args
        )(state, dispatch, editorView);
      }
    }
  },
  nodes: {
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