<template>
  <div class="prosemirror-wrapper d-flex flex-column">
    <slot name="menubar" v-bind:items="editorMenuItems">
      <v-toolbar flat :id="`${id}-toolbar`" v-if="editorMenu" x-small dense dark height="38px">
        <div v-for="(item, index) in editorMenuItems" :key="`${id}-editor-menu-${index}`">
          <v-tooltip v-if="item.type === 'btn'" bottom>
            <template v-slot:activator="{on}">
              <v-btn
                dense
                small
                icon
                v-on="on"
                @click="editorMenu.dispatchCommand(item.command)"
                v-show="item.isVisible"
                :color="item.isActive ? 'primary':''"
              >
                <v-icon small>{{item.icon}}</v-icon>
                <v-icon
                  style="position: absolut;"
                  v-if="item.dropdown"
                  dense
                  x-small
                >mdi-chevron-down</v-icon>
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
          <v-menu offset-y v-else-if="item.type === 'color'" :close-on-content-click="false">
            <template v-slot:activator="{on:onMenu}">
              <v-tooltip bottom>
                <template v-slot:activator="{on}">
                  <v-btn dense small icon v-on="{...on, ...onMenu}" :color="item.value">
                    <v-icon small>{{item.icon}}</v-icon>
                  </v-btn>
                </template>
                {{item.title}}
              </v-tooltip>
            </template>
            <v-color-picker
              v-model="item.color"
              @input="updateColorPicker($event, item)"
              class="ma-0"
              show-swatches
            ></v-color-picker>
          </v-menu>
          <v-menu offset-y v-else-if="item.type === 'spacing'" :close-on-content-click="false">
            <template v-slot:activator="{on: onMenu}">
              <v-tooltip bottom>
                <template v-slot:activator="{on}">
                  <v-btn dense small icon v-on="{...on, ...onMenu}">
                    <v-icon small>{{item.icon}}</v-icon>
                  </v-btn>
                </template>
                {{item.title}}
              </v-tooltip>
            </template>
            <v-list dense x-small>
              <v-list-item>Sample</v-list-item>
            </v-list>
          </v-menu>
          <v-menu offset-y v-else-if="item.type === 'border'" :close-on-content-click="false">
            <template v-slot:activator="{on: onMenu}">
              <v-tooltip bottom>
                <template v-slot:activator="{on}">
                  <v-btn dense small icon v-on="{...on, ...onMenu}">
                    <v-icon small>{{item.icon}}</v-icon>
                  </v-btn>
                </template>
                {{item.title}}
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item dense>
                <v-btn-toggle dense text small>
                  <v-btn small dense text icon>
                    <v-icon>mdi-border-all</v-icon>
                  </v-btn>
                  <v-btn small dense text icon>
                    <v-icon>mdi-border-top</v-icon>
                  </v-btn>
                  <v-btn small dense text icon>
                    <v-icon>mdi-border-bottom</v-icon>
                  </v-btn>
                  <v-btn small dense text icon>
                    <v-icon>mdi-border-left</v-icon>
                  </v-btn>
                  <v-btn small dense text icon>
                    <v-icon>mdi-border-right</v-icon>
                  </v-btn>
                  <v-btn small dense text icon>
                    <v-icon>mdi-border-clear</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-list-item>
              <v-list-item dense>
                <v-menu offset-y :close-on-content-click="false">
                  <template v-slot:activator="{on}">
                    <v-btn dense small icon v-on="on">
                      <v-icon small>mdi-format-color-fill</v-icon>
                    </v-btn>
                  </template>
                  <v-color-picker class="ma-0" show-swatches></v-color-picker>
                </v-menu>
                <v-menu offset-y :close-on-content-click="false">
                  <template v-slot:activator="{on}">
                    <v-btn dense small icon v-on="on">
                      <v-icon small>mdi-format-color-fill</v-icon>
                    </v-btn>
                  </template>
                  <v-color-picker class="ma-0" show-swatches></v-color-picker>
                </v-menu>
                <v-menu offset-y :close-on-content-click="false">
                  <template v-slot:activator="{on}">
                    <v-btn dense small icon v-on="on">
                      <v-icon small>mdi-format-color-fill</v-icon>
                    </v-btn>
                  </template>
                  <v-color-picker class="ma-0" show-swatches></v-color-picker>
                </v-menu>
                <v-menu offset-y :close-on-content-click="false">
                  <template v-slot:activator="{on}">
                    <v-btn dense small icon v-on="on">
                      <v-icon small>mdi-format-color-fill</v-icon>
                    </v-btn>
                  </template>
                  <v-color-picker class="ma-0" show-swatches></v-color-picker>
                </v-menu>
                <v-menu offset-y :close-on-content-click="false">
                  <template v-slot:activator="{on}">
                    <v-btn dense small icon v-on="on">
                      <v-icon small>mdi-format-color-fill</v-icon>
                    </v-btn>
                  </template>
                  <v-color-picker class="ma-0" show-swatches></v-color-picker>
                </v-menu>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{on}">
            <v-btn icon text small dense v-on="on" @click="editorTreeDrawer = !editorTreeDrawer">
              <v-icon small>{{editorTreeDrawer ? 'mdi-chevron-left':'mdi-settings'}}</v-icon>
            </v-btn>
          </template>
          Toggle Editor/Editor Tree
        </v-tooltip>
      </v-toolbar>
    </slot>
    <div class="d-flex flex-row" style="height: 100%;">
      <div class="prosemirror-editor" :id="`${id}-editor`"></div>
      <slot name="toolbar">
        <v-navigation-drawer permenant v-model="editorTreeDrawer">
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
      </slot>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { EditorState, Plugin } from "prosemirror-state";
import { Schema } from "prosemirror-model";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history } from "prosemirror-history";

import PMComps from "./components";
import MenuBar, { menubar } from "./menubar";
import {
  EditorView,
  Decoration,
  DecorationSet
} from "./prosemirror-view/src/index";

export default {
  name: "prose-mirror-vue-editor",
  props: {
    id: {
      type: String,
      default: "example-prosemirror"
    }
  },
  computed: {
    schema: function() {
      return new Schema({
        nodes: this.nodes,
        marks: {
          ...PMComps.Strong.marks,
          ...PMComps.Italic.marks
        }
      });
    }
  },
  data: () => ({
    editorComponents: {
      "pm-paragraph": PMComps.Paragraph,
      "pm-grid": PMComps.Grid,
      "pm-card": PMComps.Card,
      "pm-card-title": PMComps.CardTitle
    },
    nodes: {
      ...PMComps.Doc.nodes,
      ...PMComps.Paragraph.nodes,
      ...PMComps.Grid.nodes,
      ...PMComps.Card.nodes
    },
    editorMenuItems: [
      PMComps.Paragraph.spec.menuItems.alignLeft,
      PMComps.Paragraph.spec.menuItems.alignCenter,
      PMComps.Paragraph.spec.menuItems.alignRight,
      PMComps.Paragraph.spec.menuItems.alignJustify,
      PMComps.Paragraph.spec.menuItems.fontSize,
      PMComps.Paragraph.spec.menuItems.textColor,
      PMComps.Paragraph.spec.menuItems.backColor,
      PMComps.Paragraph.spec.menuItems.spacing,
      PMComps.Paragraph.spec.menuItems.border,
      PMComps.Strong.spec.menuItems.strong,
      PMComps.Italic.spec.menuItems.italic,
      PMComps.Grid.spec.menuItems.insertRow,
      PMComps.Grid.spec.menuItems.insertColumn,
      PMComps.Card.spec.menuItems.insertCard
    ],
    editor: null,
    editorMenu: null,
    view: null,
    editorValues: {
      menuItems: {}
    },
    editorMode: "editor",
    editorTreeDrawer: true,
    editorTree: [],
    editorCurrTree: [],
    editorSwatches: []
  }),

  methods: {
    updateInput(json) {
      this.$emit("input", json);
    },
    updateMenuItemValue(e, item) {
      if (e.keyCode === 13) {
        this.editorMenu.dispatchCommand(item.command, item.value);
      }
    },
    updateColorPicker(e, item) {
      if (item.color) {
        let color = item.color;
        if (typeof color !== "string" && color.hexa) {
          color = color.hexa;
        }
        this.editorMenu.dispatchCommand(item.command, color, false);
      }
    }
  },
  mounted() {
    const self = this;

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
      PMComps.ComponentUpdaterPlugin(self)
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
      document.getElementById(`${this.id}-editor`),
      {
        state: state,
        dispatchTransaction(transaction) {
          self.editor.state = self.editor.state.apply(transaction);
          self.editor.updateState(self.editor.state);
          self.updateInput(self.editor.state.toJSON());
        }
      },
      this.editorComponents,
      Vue
    );
  }
};
</script>

<style scoped>
.small-breadcrumbs .v-breadcrumbs__divider {
  padding: 0 !important;
}
</style>