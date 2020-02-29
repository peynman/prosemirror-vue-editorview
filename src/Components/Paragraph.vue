<template>
  <p :class="pClass" :style="pStyles" data-parser-id="pm-paragraph">
  </p>
</template>

<script>
import {
  getAttrValueOfNodeOfType,
  getAttrsInNodeOfType,
  isAttrEqInNodeOfType,
  updateAttrOfNodeOfTypeCommand,
  ParagraphDomSampler
} from "./helpers";

export default {
  name: "pm-paragraph",
  props: {
    align: String,
    fontSize: String,
    textColor: Object|String,
    backColor: Object|String,
  },
  methods: {
    isValidLength: (val) => ['px', 'em'].some((suff) => (val.endsWith(suff))),
    isValidAlignment: (val) => ['left', 'right', 'center', 'end', 'start'].indexOf(val) >= 0,
  },
  computed: {
    pStyles: function() {
      const stylesList = [];
      if (this.fontSize) {
        if (this.isValidLength(this.fontSize)) {
          stylesList.push(`font-size: ${this.fontSize}`);
        }
      }
      if (this.lineSpacing) {
        if (this.isValidLength(this.lineSpacing)) {
          stylesList.push(`line-spacing: ${this.lineSpacing}`);
        }
      }
      if (this.textColor) {
        if (typeof this.textColor === 'string') {
          stylesList.push(`color: ${this.textColor}`);
        } else if (this.textColor.hexa) {
          stylesList.push(`color: ${this.textColor.hexa}`);
        }
      }
      if (this.backColor) {
        if (typeof this.backColor === 'string') {
          stylesList.push(`background-color: ${this.backColor}`);
        } else if (this.backColor.hexa) {
          stylesList.push(`background-color: ${this.backColor.hexa}`);
        }
      }
      return stylesList.join(";");
    },
    pClass: function() {
      const classesList = [];
      if (this.align) {
        if (this.isValidAlignment(this.align)) {
          classesList.push(`text-${this.align}`);
        }
      }
      return classesList.join(" ");
    },
  },
  spec: {
    commands: {
      alignRight: (state, dispatch, editorView) => updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, { align: "right" })(state, dispatch, editorView),
      alignLeft: (state, dispatch, editorView) => updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, { align: "left" })(state, dispatch, editorView),
      alignCenter: (state, dispatch, editorView) => updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, { align: "center" })(state, dispatch, editorView),
      fontSize: size => (state, dispatch, editorView) => updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, {fontSize: size})(state, dispatch, editorView),
      textColor: color => (state, dispatch, editorView) => updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, {textColor: color})(state, dispatch, editorView),
      backColor: color => (state, dispatch, editorView) => updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, {backColor: color})(state, dispatch, editorView),
    },
    isActive: {
      alignRight: (state) => isAttrEqInNodeOfType(state.schema.nodes.paragraph, {align: "right"})(state),
      alignLeft: (state) => isAttrEqInNodeOfType(state.schema.nodes.paragraph, {align: "left"})(state),
      alignCenter: (state) => isAttrEqInNodeOfType(state.schema.nodes.paragraph, {align: "center"})(state),
    },
    getValues: {
      fontSize: (state) => getAttrValueOfNodeOfType(state.schema.nodes.paragraph, 'fontSize')(state),
      textColor: (state) => getAttrValueOfNodeOfType(state.schema.nodes.paragraph, 'textColor')(state),
      backColor: (state) => getAttrValueOfNodeOfType(state.schema.nodes.paragraph, 'backColor')(state),
      lineSpacing: (state) => getAttrValueOfNodeOfType(state.schema.nodes.paragraph, 'lineSpacing')(state),
    }
  },
  nodes: {
    paragraph: {
      attrs: {
        align: {
          default: null
        },
        fontSize: {
          default: null,
        },
        lineSpacing: {
          default: null,
        },
        textColor: {
          default: null
        },
        backColor: {
          default: null
        },
      },
      content: "inline*",
      group: "block",
      parseDOM: [
        {
          tag: 'p[data-parser-id="pm-paragraph"]',
          attrs: dom => {
            const attrs = {};
            return attrs;
          }
        }
      ],
      toDOM(node) {
        return [
          "pm-paragraph",
          {
            props: node.attrs,
          },
          0
        ];
      }
    }
  }
};
</script>
