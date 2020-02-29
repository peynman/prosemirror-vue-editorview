<template>
  <v-card class="prosemirror-card">
    <v-toolbar
      flat
      :id="`${formId}-${inputProps.id}-toolbar`"
      v-if="editorMenu"
      x-small
      dense
      dark
      height="38px"
    >
      <div v-for="(item, index) in editorMenuItems" :key="`${formId}-editor-menu-${index}`">
        <v-tooltip v-if="item.type === 'btn'" top>
          <template v-slot:activator="{on}">
            <v-btn
              dense
              small
              icon
              v-on="on"
              @click="editorMenu.onClick(item.command)"
              v-show="item.isVisible"
              :color="item.isActive ? 'primary':''"
            >
              <v-icon small>{{item.icon}}</v-icon>
            </v-btn>
          </template>
          {{item.title}}
        </v-tooltip>
        <v-text-field
          class="prosemirror-text-field"
          v-else-if="item.type === 'text-field'"
          x-small
          small
          dense
          v-show="item.isVisible"
          v-model="item.value"
          :prepend-icon="item.icon"
          @keyup.native="updateMenuItemValue($event, item)"
        ></v-text-field>
        <v-menu offset-y v-else-if="item.type === 'color'">
          <template v-slot:activator="{on}">
            <v-btn dense small icon v-on="on" :color="item.value && item.value.hexa ? item.value.hexa:null">
              <v-icon small>{{item.icon}}</v-icon>
            </v-btn>
          </template>
          <v-color-picker v-model="item.value" @input="updateColorPicker($event, item)" class="ma-0" show-swatches></v-color-picker>
        </v-menu>
      </div>

      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{on}">
          <v-btn icon text small dense v-on="on" @click="editorTreeDrawer = !editorTreeDrawer">
            <v-icon small>{{editorTreeDrawer ? 'mdi-chevron-left':'mdi-settings'}}</v-icon>
          </v-btn>
        </template>
        Toggle Editor/Editor Tree
      </v-tooltip>
    </v-toolbar>
    <div :id="`${formId}-${inputProps.id}-editor`"></div>
    <div style="display: none;" :id="`${formId}-${inputProps.id}-content`"></div>
    <v-navigation-drawer absolute v-model="editorTreeDrawer">
      <v-treeview :items="editorTree">
        <template v-slot:label="{item}">
          <label>{{item.node.type.name}}</label>
        </template>
      </v-treeview>
    </v-navigation-drawer>
    <v-breadcrumbs :items="editorCurrTree" class="small-breadcrumbs pa-0 ma-1">
      <template v-slot:item="{item}">
        <v-chip
          small
          dense
          class="me-1"
          :close-icon="item.settings.show ? 'mdi-chevron-left':'mdi-settings'"
          close
          @click:close="item.settings.show = !item.settings.show"
        >{{item.node.type.name}}</v-chip>
      </template>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <div class="d-flex flex-row ma-1"></div>
  </v-card>
</template>

<script>
import Vue from "vue";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser, DOMSerializer } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { keymap } from "prosemirror-keymap";
import { history } from "prosemirror-history";
import {
  toggleMark,
  setBlockType,
  wrapIn,
  baseKeymap
} from "prosemirror-commands";
import { MenuItem } from "blockly";
import PMComps from "./components";

import ProseMirrorComponents, { ComponentUpdater } from "./components";

import MenuBar, { menubar } from "./menubar";
const exampleSchemeSpec = schema;

import { Decoration, DecorationSet } from "prosemirror-view";

export default {
  name: "lpd-form-editorjs-prose-mirror-editor",
  props: {
    inputProps: Object,
    initValue: Object,
    formId: String,
    group: String
  },
  computed: {
    editorComponents: () => ({
      "pm-paragraph": PMComps.Paragraph,
      "pm-grid": PMComps.Grid,
      "pm-card": PMComps.Card,
      "pm-card-title": PMComps.CardTitle
    }),
    nodes: function() {
      let nodes = {
        doc: {
          content: "block+"
        },
        text: {
          group: "inline"
        },
        ...PMComps.Paragraph.nodes,
        ...PMComps.Grid.nodes,
        ...PMComps.Card.nodes,
        ...PMComps.CardTitle.nodes
      };

      return nodes;
    },
    marks: function() {
      let marks = exampleSchemeSpec.spec.marks;
      return marks;
    },
    schema: function() {
      return new Schema({
        nodes: this.nodes,
        marks: this.marks
      });
    },
    editorMenuItems: {
      get() {
        const commonUpdate = (item, state, dispatch, editorView) => {
          item.isVisible = item.value
            ? item.command(item.value)(state, dispatch, editorView)
            : item.command(state, dispatch, editorView);
          if (item.updateValueCallback) {
            item.value = item.updateValueCallback(state);
          }
          if (item.isActiveCallback) {
            item.isActive = item.isActiveCallback(state);
          }
        };
        if (!this.menuItems) {
          this.menuItems = [
            {
              type: "btn",
              title: "Alight Left",
              icon: "mdi-format-align-left",
              command: ProseMirrorComponents.Paragraph.spec.commands.alignLeft,
              isActiveCallback:
                ProseMirrorComponents.Paragraph.spec.isActive.alignLeft,
              update: commonUpdate,
              isActive: false,
              isVisible: false
            },
            {
              type: "btn",
              title: "Alight Center",
              icon: "mdi-format-align-center",
              command:
                ProseMirrorComponents.Paragraph.spec.commands.alignCenter,
              isActiveCallback:
                ProseMirrorComponents.Paragraph.spec.isActive.alignCenter,
              update: commonUpdate,
              isActive: false,
              isVisible: false
            },
            {
              type: "btn",
              title: "Alight Right",
              icon: "mdi-format-align-right",
              command: ProseMirrorComponents.Paragraph.spec.commands.alignRight,
              isActiveCallback:
                ProseMirrorComponents.Paragraph.spec.isActive.alignRight,
              update: commonUpdate,
              isActive: false,
              isVisible: false
            },
            {
              type: "btn",
              title: "Alight Justify",
              icon: "mdi-format-align-justify",
              command: ProseMirrorComponents.Paragraph.spec.commands.alignRight,
              isActiveCallback:
                ProseMirrorComponents.Paragraph.spec.isActive.alignRight,
              update: commonUpdate,
              isActive: false,
              isVisible: false
            },
            {
              type: "text-field",
              title: "Font size",
              icon: "mdi-format-size",
              command: ProseMirrorComponents.Paragraph.spec.commands.fontSize,
              updateValueCallback:
                ProseMirrorComponents.Paragraph.spec.getValues.fontSize,
              update: commonUpdate,
              value: null,
              isVisible: false
            },
            {
              type: "color",
              title: "Text Color",
              icon: "mdi-format-color-text",
              command: ProseMirrorComponents.Paragraph.spec.commands.textColor,
              updateValueCallback:
                ProseMirrorComponents.Paragraph.spec.getValues.textColor,
              update: commonUpdate,
              isActive: false,
              isVisible: false
            },
            {
              type: "color",
              title: "Back Color",
              icon: "mdi-format-color-fill",
              command: ProseMirrorComponents.Paragraph.spec.commands.backColor,
              isActiveCallback:
                ProseMirrorComponents.Paragraph.spec.getValues.backColor,
              update: commonUpdate,
              isActive: false,
              isVisible: false
            },
            {
              type: "btn",
              title: "Bold",
              icon: "mdi-format-bold",
              command: toggleMark(this.schema.marks.strong),
              mark: this.schema.marks.strong,
              update: commonUpdate,
              isActive: false,
              isVisible: false
            },
            {
              type: "btn",
              title: "Italic",
              icon: "mdi-format-italic",
              command: toggleMark(this.schema.marks.em),
              mark: this.schema.marks.em,
              isActive: false,
              isVisible: false
            },
            {
              type: "btn",
              title: "Spacing",
              icon: "mdi-select-all",
              isActive: false,
              isVisible: false
            },
            {
              type: "btn",
              title: "Insert Row",
              icon: "mdi-view-agenda",
              command: ProseMirrorComponents.Grid.spec.commands.insertGrid({
                mode: "row"
              }),
              update: commonUpdate,
              isActive: false,
              isVisible: false
            },
            {
              type: "btn",
              title: "Insert Column",
              icon: "mdi-view-column",
              command: ProseMirrorComponents.Grid.spec.commands.insertGrid({
                mode: "column",
                col: { sm: 12 }
              }),
              update: commonUpdate,
              isActive: false,
              isVisible: false
            },
            {
              type: "btn",
              title: "Insert Card",
              icon: "mdi-card",
              command: ProseMirrorComponents.Card.spec.commands.insertCard({}),
              update: commonUpdate,
              isActive: false,
              isVisible: false
            },
            {
              type: "btn",
              title: "Insert Card title",
              icon: "mdi-view-compact",
              command: ProseMirrorComponents.CardTitle.spec.commands.insertCardTitle(
                {}
              ),
              update: commonUpdate,
              isActive: false,
              isVisible: false
            }
          ];
        }
        return this.menuItems;
      },
      set(v) {
        console.log(v);
      }
    }
  },
  data: () => ({
    editor: null,
    editorMenu: null,
    view: null,
    editorValues: {
      menuItems: {}
    },
    menuItems: null,
    editorMode: "editor",
    editorTreeDrawer: false,
    editorTree: [],
    editorCurrTree: [],
    editorSwatches: [
      ["#FF0000", "#AA0000", "#550000"],
      ["#FFFF00", "#AAAA00", "#555500"],
      ["#00FF00", "#00AA00", "#005500"],
      ["#00FFFF", "#00AAAA", "#005555"],
      ["#0000FF", "#0000AA", "#000055"]
    ]
  }),

  methods: {
    updateInput(json) {
      this.$emit("input", json);
    },
    updateMenuItemValue(e, item) {
      if (e.keyCode === 13) {
        this.editorMenu.onClick(item.command, item.value);
      }
    },
    updateColorPicker(e, item) {
      console.log('color');
        this.editorMenu.onClick(item.command, item.value);
    },
  },
  mounted() {
    const self = this;

    DOMSerializer.renderSpec = (doc, structure, xmlNS = null) => {
      console.log(structure, xmlNS);

      if (typeof structure == "string")
        return { dom: doc.createTextNode(structure) };
      if (structure.nodeType != null) return { dom: structure };
      let tagName = structure[0],
        space = tagName.indexOf(" ");
      if (space > 0) {
        xmlNS = tagName.slice(0, space);
        tagName = tagName.slice(space + 1);
      }
      let contentDOM = null;
      let dom = null;
      let vue = false;
      if (xmlNS) {
        dom = doc.createElementNS(xmlNS, tagName);
      } else {
        if (self.editorComponents[tagName]) {
          console.log("vue: ", tagName);
          const comClass = Vue.extend(self.editorComponents[tagName]);
          const comp = new comClass({
            propsData: structure[1].props
          });
          comp.$mount();
          dom = comp.$el;
          dom.editorComponentRef = comp;
          vue = true;
        } else {
          console.log("dom: ", tagName);
          dom = doc.createElement(tagName);
        }
      }
      let attrs = structure[1],
        start = 1;
      if (
        attrs &&
        typeof attrs == "object" &&
        attrs.nodeType == null &&
        !Array.isArray(attrs)
      ) {
        start = 2;
        if (!vue) {
          for (let name in attrs)
            if (attrs[name] != null) {
              let space = name.indexOf(" ");
              if (space > 0)
                dom.setAttributeNS(
                  name.slice(0, space),
                  name.slice(space + 1),
                  attrs[name]
                );
              else dom.setAttribute(name, attrs[name]);
            }
        }
      }
      for (let i = start; i < structure.length; i++) {
        let child = structure[i];
        if (child === 0) {
          if (i < structure.length - 1 || i > start)
            throw new RangeError(
              "Content hole must be the only child of its parent node"
            );
          return { dom, contentDOM: dom };
        } else {
          let {
            dom: inner,
            contentDOM: innerContent
          } = DOMSerializer.renderSpec(doc, child, xmlNS);
          dom.appendChild(inner);
          if (innerContent) {
            if (contentDOM) throw new RangeError("Multiple content holes");
            contentDOM = innerContent;
          }
        }
      }
      return { dom, contentDOM };
    };

    let state = null;
    // prosemirror editor plugins
    const plugins = [
      // Menubar plugin to update components on state change
      menubar(
        self.editorMenuItems.filter(
          i => i.command
        ) /** pass only items with command option available */,
        this
      ),
      keymap(baseKeymap),
      history(),
      ComponentUpdater(self)
    ];

    // init prosemirror editor state from component initValue or empty,
    if (this.initValue) {
      state = EditorState.fromJSON(
        {
          schema: this.schema,
          plugins: plugins
        },
        this.initValue
      );
    } else {
      state = EditorState.create({
        schema: this.schema,
        plugins: plugins
      });
    }

    // init prosemirror editor view
    this.editor = new EditorView(
      document.getElementById(`${this.formId}-${this.inputProps.id}-editor`),
      {
        state: state,
        dispatchTransaction(transaction) {
          self.editor.state = self.editor.state.apply(transaction);
          self.editor.updateState(self.editor.state);
          self.updateInput(self.editor.state.toJSON());
        }
      }
    );
  }
};
</script>

<style scoped>
.small-breadcrumbs .v-breadcrumbs__divider {
  padding: 0 !important;
}
</style>