<template>
  <div class="node" :style="{ left: node.x + 'px', top: node.y + 'px' }">
    <!-- Node box -->
    <div class="node-box" :class="{ root: node.parentId === null }">
      <input
        v-if="node.editing"
        v-model="node.text"
        :ref="el => mindMap.registerInput(el, node.id)"
        @blur="mindMap.finishEdit(node)"
        @keyup.enter="mindMap.finishEdit(node)"
        @keyup.escape="mindMap.cancelEdit(node)"
        @mousedown.stop
      />
      <span v-else @dblclick="mindMap.startEdit(node)">{{ node.text }}</span>
    </div>

    <!-- Direction buttons -->
    <button class="plus-btn plus-top"    @click.stop="mindMap.addNode(node, 'top')"   >+</button>
    <button class="plus-btn plus-bottom" @click.stop="mindMap.addNode(node, 'bottom')">+</button>
    <button class="plus-btn plus-left"   @click.stop="mindMap.addNode(node, 'left')"  >+</button>
    <button class="plus-btn plus-right"  @click.stop="mindMap.addNode(node, 'right')" >+</button>
  </div>
</template>

<script setup>
import { inject } from 'vue'

defineProps({ node: { type: Object, required: true } })

const mindMap = inject('mindMap')
</script>

<style scoped>
.node {
  position: absolute;
  width: 150px;
}

/* ── Node box ── */
.node-box {
  background: white;
  border: 2px solid #3498db;
  border-radius: 10px;
  padding: 10px 14px;
  text-align: center;
  font-size: 14px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 12px rgba(52, 152, 219, 0.15);
  transition: box-shadow 0.2s;
  word-break: break-all;
}

.node-box:hover {
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.3);
}

.node-box.root {
  border-color: #2ecc71;
  background: #f0fff4;
  font-weight: 600;
  box-shadow: 0 3px 12px rgba(46, 204, 113, 0.2);
}

.node-box input {
  border: none;
  outline: none;
  text-align: center;
  font-size: 14px;
  width: 100%;
  background: transparent;
}

.node-box span {
  cursor: text;
  user-select: none;
}

/* ── Plus buttons ── */
.plus-btn {
  position: absolute;
  width: 22px;
  height: 22px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.18s, background 0.15s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.node:hover .plus-btn {
  opacity: 1;
}

.plus-btn:hover {
  background: #2980b9;
}

.plus-top    { top: -28px;    left: 50%;  transform: translateX(-50%); }
.plus-bottom { bottom: -28px; left: 50%;  transform: translateX(-50%); }
.plus-left   { left: -28px;   top: 50%;   transform: translateY(-50%); }
.plus-right  { right: -28px;  top: 50%;   transform: translateY(-50%); }
</style>
