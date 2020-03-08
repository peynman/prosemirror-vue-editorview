<template>
  <p :class="pClass" :style="pStyles" data-parser-id="pm-paragraph"></p>
</template>

<script>
import {
  getAttrValueOfNodeOfType,
  getAttrsInNodeOfType,
  isAttrEqInNodeOfType,
  updateAttrOfNodeOfTypeCommand,
  ComponentUpdateNode
} from "./helpers";

const getValues = {
  fontSize: state =>
    getAttrValueOfNodeOfType(state.schema.nodes.paragraph, "fontSize")(state),
  textColor: state =>
    getAttrValueOfNodeOfType(state.schema.nodes.paragraph, "textColor")(state),
  backColor: state =>
    getAttrValueOfNodeOfType(state.schema.nodes.paragraph, "backColor")(state),
  lineSpacing: state =>
    getAttrValueOfNodeOfType(
      state.schema.nodes.paragraph,
      "lineSpacing"
    )(state),
  spacing: state =>
    getAttrValueOfNodeOfType(state.schema.nodes.paragraph, "spacing")(state)
};
const isActive = {
  alignRight: state =>
    isAttrEqInNodeOfType(state.schema.nodes.paragraph, { align: "right" })(
      state
    ),
  alignLeft: state =>
    isAttrEqInNodeOfType(state.schema.nodes.paragraph, { align: "left" })(
      state
    ),
  alignCenter: state =>
    isAttrEqInNodeOfType(state.schema.nodes.paragraph, { align: "center" })(
      state
    )
};
const commands = {
  alignRight: (state, dispatch, editorView) =>
    updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, {
      align: "right"
    })(state, dispatch, editorView),
  alignLeft: (state, dispatch, editorView) =>
    updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, {
      align: "left"
    })(state, dispatch, editorView),
  alignCenter: (state, dispatch, editorView) =>
    updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, {
      align: "center"
    })(state, dispatch, editorView),
  fontSize: size => (state, dispatch, editorView) =>
    updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, {
      fontSize: size
    })(state, dispatch, editorView),
  textColor: color => (state, dispatch, editorView) =>
    updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, {
      textColor: color
    })(state, dispatch, editorView),
  backColor: color => (state, dispatch, editorView) =>
    updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, {
      backColor: color
    })(state, dispatch, editorView),
  spacing: spacing => (state, dispatch, editorView) =>
    updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, {
      spacing: spacing
    })(state, dispatch, editorView),
  border: border => (state, dispatch, editorView) =>
    updateAttrOfNodeOfTypeCommand(state.schema.nodes.paragraph, {
      border: border
    })(state, dispatch, editorView),
};

export default {
  name: "pm-paragraph",
  props: {
    align: String,
    fontSize: String,
    textColor: Object | String,
    backColor: Object | String,
    spacing: Object,
    border: Object
  },
  methods: {
    isValidLength: val => ["px", "em"].some(suff => val.endsWith(suff)),
    isValidAlignment: val =>
      ["left", "right", "center", "end", "start"].indexOf(val) >= 0
  },
  computed: {
    pStyles: function() {
      const stylesList = [];
      if (this.fontSize && this.isValidLength(this.fontSize)) {
        stylesList.push(`font-size: ${this.fontSize}`);
      }
      if (this.lineSpacing && this.isValidLength(this.lineSpacing)) {
        stylesList.push(`line-spacing: ${this.lineSpacing}`);
      }
      if (this.textColor) {
        if (typeof this.textColor === "string") {
          stylesList.push(`color: ${this.textColor}`);
        } else if (this.textColor.hexa) {
          stylesList.push(`color: ${this.textColor.hexa}`);
        }
      }
      if (this.backColor) {
        if (typeof this.backColor === "string") {
          stylesList.push(`background-color: ${this.backColor}`);
        }
      }
      if (this.spacing) {
        if (this.spacing.margin) {
          if (
            typeof this.spacing.margin === "string" &&
            this.isValidLength(this.spacing.margin)
          ) {
            stylesList.push(`margin: ${this.spacing.margin}`);
          } else {
            if (this.spacing.margin.left)
              stylesList.push(`margin-left: ${this.spacing.margin.left}`);
            if (this.spacing.margin.right)
              stylesList.push(`margin-right: ${this.spacing.margin.right}`);
            if (this.spacing.margin.top)
              stylesList.push(`margin-top: ${this.spacing.margin.top}`);
            if (this.spacing.margin.bottom)
              stylesList.push(`margin-bottom: ${this.spacing.margin.bottom}`);
          }
        }
        if (this.spacing.padding) {
          if (
            typeof this.spacing.padding === "string" &&
            this.isValidLength(this.spacing.padding)
          ) {
            stylesList.push(`padding: ${this.spacing.padding}`);
          } else {
            if (this.spacing.padding.left)
              stylesList.push(`padding-left: ${this.spacing.padding.left}`);
            if (this.spacing.padding.right)
              stylesList.push(`padding-right: ${this.spacing.padding.right}`);
            if (this.spacing.padding.top)
              stylesList.push(`padding-top: ${this.spacing.padding.top}`);
            if (this.spacing.padding.bottom)
              stylesList.push(`padding-bottom: ${this.spacing.padding.bottom}`);
          }
        }
      }
      if (this.border) {
        if (typeof this.border === "string") {
          stylesList.push(`border: ${this.border}`);
        } else {
          if (this.border.left)
            stylesList.push(`border-left: ${this.border.left}`);
          if (this.border.right)
            stylesList.push(`border-right: ${this.border.right}`);
          if (this.border.top)
            stylesList.push(`border-top: ${this.border.top}`);
          if (this.border.bottom)
            stylesList.push(`border-bottom: ${this.border.bottom}`);
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
    }
  },
  spec: {
    commands: commands,
    isActive: isActive,
    getValues: getValues,
    menuItems: {
      alignLeft: {
        type: "btn",
        title: "Alight Left",
        icon: "mdi-format-align-left",
        command: commands.alignLeft,
        isActiveCallback: isActive.alignLeft,
        update: ComponentUpdateNode,
        isActive: false,
        isVisible: false
      },
      alignCenter: {
        type: "btn",
        title: "Alight Center",
        icon: "mdi-format-align-center",
        command: commands.alignCenter,
        isActiveCallback: isActive.alignCenter,
        update: ComponentUpdateNode,
        isActive: false,
        isVisible: false
      },
      alignRight: {
        type: "btn",
        title: "Alight Right",
        icon: "mdi-format-align-right",
        command: commands.alignRight,
        isActiveCallback: isActive.alignRight,
        update: ComponentUpdateNode,
        isActive: false,
        isVisible: false
      },
      alignJustify: {
        type: "btn",
        title: "Alight Justify",
        icon: "mdi-format-align-justify",
        command: commands.alignRight,
        isActiveCallback: isActive.alignRight,
        update: ComponentUpdateNode,
        isActive: false,
        isVisible: false
      },
      fontSize: {
        type: "text-field",
        title: "Font size",
        icon: "mdi-format-size",
        command: commands.fontSize,
        updateValueCallback: getValues.fontSize,
        update: ComponentUpdateNode,
        value: "auto",
        isVisible: false
      },
      textColor: {
        type: "color",
        title: "Text Color",
        icon: "mdi-format-color-text",
        command: commands.textColor,
        updateValueCallback: getValues.textColor,
        update: ComponentUpdateNode,
        value: "",
        isActive: false,
        isVisible: false
      },
      backColor: {
        type: "color",
        title: "Back Color",
        icon: "mdi-format-color-fill",
        command: commands.backColor,
        updateValueCallback: getValues.backColor,
        update: ComponentUpdateNode,
        value: "",
        isActive: false,
        isVisible: false
      },
      spacing: {
        type: "spacing",
        title: "Spacing",
        icon: "mdi-view-dashboard",
        command: commands.spacing,
        updateValueCallback: getValues.spacing,
        update: ComponentUpdateNode,
        value: {},
        isActive: false,
        isVisible: false
      },
      border: {
        type: "border",
        title: "Border",
        icon: "fas fa-border-style",
        command: commands.border,
        updateValueCallback: getValues.border,
        update: ComponentUpdateNode,
        value: {},
        isActive: false,
        isVisible: false
      },
    }
  },
  nodes: {
    paragraph: {
      attrs: {
        align: {
          default: null
        },
        fontSize: {
          default: null
        },
        lineSpacing: {
          default: null
        },
        textColor: {
          default: null
        },
        backColor: {
          default: null
        },
        border: {
          default: {},
        },
        spacing: {
          default: {},
        },
      },
      content: "inline*",
      group: "block",
      parseDOM: [
        {
          tag: 'p[data-parser-id="pm-paragraph"]',
          attrs: dom => {
            const align = dom.style.textAlign;
            const fontSize = dom.style.fontSize;
            const textColor = dom.style.color;
            const backColor = dom.style.backgroundColor;

            const attrs = {
              align,
              fontSize,
              textColor,
              backColor
            };
            console.log("parsed", "paragraph", attrs);
            return attrs;
          }
        }
      ],
      toDOM(node) {
        return [
          "pm-paragraph",
          {
            ...node.attrs
          },
          0
        ];
      }
    }
  }
};
</script>
