<template>
  <v-card-title data-parser-id="pm-card-title"></v-card-title>
</template>

<script>
import {wrapNodeOfTypeWithTypeCommand} from './helpers'

export default {
  name: "pm-card-title",
  spec: {
    commands: {
      insertCardTitle: args => (state, dispatch, editorView) => {
        return         wrapNodeOfTypeWithTypeCommand(
          state.schema.nodes.paragraph,
          state.schema.nodes.cardTitle,
          args
        )(state, dispatch, editorView);
      }
    },
  },
  nodes: {
    cardTitle: {
      content: "block+",
      group: "block",
      parseDOM: [
        {
          tag: 'div[data-parser-id="pm-card-title"]',
        }
      ],
      toDOM() {
        return ["pm-card-title", 0];
      },
    }
  }
};
</script>